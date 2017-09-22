#!/usr/bin/python
import hal, time, linuxcnc
import os
h = hal.component("mdi")
h.newpin("run", hal.HAL_BIT, hal.HAL_IN)
h.newpin("busy", hal.HAL_BIT, hal.HAL_OUT)
h.ready()
last_run = h["run"]
c = linuxcnc.command()
try:
	while 1:
		if h["run"] != last_run :
			h["busy"] = True
			c.mode(linuxcnc.MODE_MDI)
			c.wait_complete() # wait until mode switch executed
			f = open(os.path.dirname(os.path.realpath(__file__))+"/mdi_command")
			s = f.read()
			f.close()
			for l in s.split("\n") :
				if l.strip() == "" :
					continue
				c.mdi(l)
				while c.wait_complete()!=1 :
					pass # wait until mode switch executed
			h["busy"] = False
		last_run = h["run"]
		time.sleep(0.04)
except KeyboardInterrupt:
	raise SystemExit
