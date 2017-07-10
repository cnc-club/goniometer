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


PORT = 8181
HOST = "127.0.0.1"
db = TinyDB("db.json")


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

    def on_message(self, message):
        print("recv: " + str(len(message)) + " symbols")
        message = json.loads(message)
        if message["type"] == "temp-parameters":
            db.insert(message)
            
        if message["type"] == "save-parameters":
            res = db.search(Query().type == "temp-parameters")
            [i.pop("temp-parameters", None) for i in res]
            res = {"parametres":res, "save_name":message["save_name"]}
            db.insert(res)
    
        if message["type"] == "save-programm":
            pass
        if message["type"] == "get-programm-list":
            pass
        if message["type"] == "get-programm":
            pass
                  
    def on_close(self):
        print("start removing temp")
        db.remove(Query().type == "temp-parameters")
        print("socket closed")
        
        

if __name__ == "__main__":
    
    settings = {"static_path": os.path.join(os.path.dirname(__file__), "static")}
    app = tornado.web.Application([
        (r"/", HTTPHandler),
        (r"/ws", WebSocketsHandler),
        (r"/(websocket\.js)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame1\.js)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame2\.js)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame3\.js)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame4\.js)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame5\.js)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame6\.js)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame7\.js)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame8\.js)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame9\.js)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame10\.js)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(form\.css)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_1\.css)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_2\.css)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_3\.css)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_4\.css)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_5\.css)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_6\.css)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_7\.css)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_8\.css)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_9\.css)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_10\.css)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_1\.html)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_2\.html)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_3\.html)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_4\.html)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_5\.html)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_6\.html)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_7\.html)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_8\.html)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_9\.html)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(frame_10\.html)", tornado.web.StaticFileHandler, dict(path=settings["static_path"])),
        (r"/(stylish-radio-buttons-css-only/css/style\.css)", tornado.web.StaticFileHandler, dict(path=settings["static_path"]))
         ], **settings)
    app.listen(PORT)
    main_loop = tornado.ioloop.IOLoop.instance()
    main_loop.start()