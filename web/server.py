# --*-- coding:utf-8 --*--

import tornado.web
import tornado.websocket
import tornado.template
import tornado.ioloop
import tornado.gen
import time
import os
import json
from tinydb import TinyDB, Query
import hal
import linuxcnc
import ConfigParser


PORT = 8181
HOST = "127.0.0.1"
db = TinyDB("db.json")

ws = None



class Handler(tornado.web.RequestHandler):
	def get(self):
		self.render("index.html")

class HTTPHandler(tornado.web.RequestHandler):
	
	def get(self):
		loader = tornado.template.Loader(".")
		self.write(loader.load("index.html").generate(host=HOST, port=PORT))


class WebSocketsHandler(tornado.websocket.WebSocketHandler):

	def open(self):
		print("socket opened")
		global ws
		ws = self

	def on_message(self, message):
		global lar
		message = json.loads(message)
		print message
		
		if "type" in message:
			if message["type"] == "get-param":
				lar.load_cfg()
				ws.write_message(json.dumps({"type":"get-param", "param":lar.param}))
				
			if message["type"] == "set-param":
				for p in message["param"]:
					lar.param[p] = message["param"][p]
				lar.save_cfg()
				  
	def on_close(self):
		print("start removing temp")
		db.remove(Query().type == "temp-parameters")
		print("socket closed")
		
		
		
class Lar():
	def __init__(self):
		self.config = ConfigParser.ConfigParser()
		self.load_cfg()
				
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
