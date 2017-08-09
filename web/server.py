# --*-- coding:utf-8 --*--

import tornado.web
import tornado.websocket
import tornado.template
import tornado.ioloop
import tornado.gen
import time
import os
import json
import hal
import linuxcnc
import ConfigParser
import sys

PORT = 8181
HOST = "127.0.0.1"


ws = None
		
class Handler(tornado.web.RequestHandler):
	def get(self):
		self.render("index.html")

class HTTPHandler(tornado.web.RequestHandler):
	
	def get(self):
		loader = tornado.template.Loader(".")
		self.write(loader.load("index.html").generate(host=HOST, port=PORT))


class WebSocketsHandler(tornado.websocket.WebSocketHandler):
	counter = 0
	def open(self):
		print("socket opened")
		global ws
		ws = self

	def on_message(self, message):
		global lar
		message = json.loads(message)
		self.counter += 1
		if self.counter%10 == 0:
			print ".",
			sys.stdout.flush()
		
		if "type" in message:
			if message["type"] == "get-param":
				lar.load_cfg()
				ws.write_message(json.dumps({"type":"get-param", "param":lar.param}))
				
			if message["type"] == "set-param":
				for p in message["param"]:
					lar.param[p] = message["param"][p]
				lar.save_cfg()
				
			if message["type"] == "pin":
				pins = message["pin"]
				for p in pins :
					if p in lar.bit_out or p in lar.float_out :
						lar.h[p] = pins[p]
					else :
						print "warning unknown pin %s"%p
				pins = {}
				for p in lar.float_in+lar.bit_in :
					pins[p] = lar.h[p]
				message = {"type":"pin", "pin":pins}	
				ws.write_message(json.dumps(message))									
				
			if message["type"] == "mdi":
				cmd = message["mdi"]

				lar.c.mode(linuxcnc.MODE_MDI)
				lar.c.wait_complete() # wait until mode switch executed
				lar.c.mdi(cmd)
				  
	def on_close(self):
		print("socket closed")
		
		
		
class Lar():
	def __init__(self):
		self.config = ConfigParser.ConfigParser()
		self.load_cfg()
		self.c = linuxcnc.command()
		
		self.h = hal.component("web")
		
		self.bit_in = ["homed", "is-on", "estop-led", "global-led", "local-led", ]
		self.bit_out = [
				"reset", "estop", "home", "on", "global", "local", 
				"xp", "xm", "yp", "ym", "zp", "zm", "ap", "am", "bp", "bm", 		
				"xpc", "xmc", "ypc", "ymc", "zpc", "zmc", "apc", "amc", "bpc", "bmc", 		
				]
		self.float_out = [ "increment", "jog-speed", ]
		self.float_in  = [ "xpos", "ypos", "zpos", "apos", "bpos", ]
		for p in self.bit_in :
			self.h.newpin(p, hal.HAL_BIT, hal.HAL_IN)
		for p in self.bit_out :
			self.h.newpin(p, hal.HAL_BIT, hal.HAL_OUT)
		for p in self.float_in :
			self.h.newpin(p, hal.HAL_FLOAT, hal.HAL_IN)
		for p in self.float_out :
			self.h.newpin(p, hal.HAL_FLOAT, hal.HAL_OUT)
		self.h.ready()

				
	def save_cfg(self) :
		for p in self.param :
			self.config.set("LAR",p,self.param[p])
		self.config.write(open('lar.cfg',"w"))

	def load_cfg(self) :
		self.param = {}
		self.config.readfp(open('lar.cfg'))
		for p in self.config.items("LAR") :
			self.param[p[0]] = p[1]

			

if __name__ == "__main__":
	
	settings = {"static_path": os.path.join(os.path.dirname(__file__), "static")}
	app = tornado.web.Application([
		(r"/", HTTPHandler),
		(r"/ws", WebSocketsHandler),
		(r"/(websocket\.js)", 	tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
		(r"/(.*\.html)",	tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
		(r"/(.*\.css)",		tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
		(r"/(.*\.js)", 		tornado.web.StaticFileHandler, dict(path=settings["static_path"]))
		 ], **settings)	
	lar = Lar()
	
	app.listen(PORT)
	main_loop = tornado.ioloop.IOLoop.instance()
	main_loop.start()
