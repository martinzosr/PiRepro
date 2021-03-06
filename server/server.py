import RPi.GPIO as GPIO
import time
import urllib
import http.server
import socketserver
import pygame
import time
import threading
import sys
from os import listdir
from os.path import exists, isfile

PORT = 80
HTML_DIR = 'html/'
PLAYER = None
FILES_READER = None
VOLUME_STEP = 0.1
MUSIC_DIR = '/mnt/usbDisk/MUSIC/'
HTML_DIR = '/home/martin1/server/html/'
RUN = True

class MyHandler(http.server.SimpleHTTPRequestHandler):
	def do_HEAD(s):
		s.send_response(200)
		s.send_header("Content-type", "text/html")
		s.end_headers()

	def do_GET(s):
		if(s.path[:5]=='/img/' or s.path[:5]=='/css/' or s.path[:4]=='/js/'):
			s.send_response(200)
			if s.path[-3:] == 'css':
				s.send_header("Content-type", "text/css")
			else:
				s.send_header("Content-type", "text/html")
			s.end_headers()
			file = open(HTML_DIR + s.path[1:])
			s.wfile.write(bytes(file.read(), "UTF-8"))
#print(s.path)
#			super(MyHandler, s).do_GET()
		elif(s.path[:5]=='/cmd/'):
			s.send_response(204)
			s.end_headers()
			s.parseCommand(urllib.parse.unquote(s.path[5:]))
		else:
#s.path="index.html"
#super(MyHandler, s).do_GET()
			s.send_response(200)
			s.send_header("Content-type", "text/html")
			s.end_headers()
			file = open("/home/martin1/server/html/index.html", "r")
			data = file.read().splitlines(True)
			folder = ''
			if '?file=' in s.path:
				t = s.path.split('?file=')
				folder = urllib.parse.unquote(t[1])
			folderData = FILES_READER.getFolderHTML(folder)
			for line in data:
				line = line.replace("{folders}", s.getFoldersLinks(folder))
				line = line.replace("{folderData}", folderData)
				line = line.replace("{queueData}", PLAYER.queueHTML())
				s.wfile.write(bytes(line, "UTF-8"))

	def parseCommand(self, command):
		print("command " + command)
		print(command[:14])
#if not (PLAYER is None):
#			return
		if(command == 'nextSong'):
			print("nextSong")
			PLAYER.nextSong()
		if(command == 'volUp'):
			PLAYER.volumeUp()
		if(command == 'shutDown'):
			print("Shut down server")
			global RUN
			RUN = False
			PLAYER.runPlayer = False
		if(command == 'volDown'):
			print("volDown")
			PLAYER.volumeDown()
		if(command[:14] == 'playFile?file='):
			command = command[14:]
			print("song added to queue " + command)
			PLAYER.addSong("MAC", command)

	def getFoldersLinks(self, folder = ''):
		if folder == '':
			return ''
		result = "<ol class='breadcrumb'>"
		result += '<li><a href="index.html">home</a></li>'
		lastPath = ''
		for f in folder.split('/'):
			result += '<li><a href="index.html?file=' + lastPath + f + '/">' + f + '</a></li>'
			lastPath += f + '/'
		return result + "</ol>"



class Player(threading.Thread):
	def __init__(self):
#threading.Thread.__init__(self, "player")
		super().__init__()
		self.player = "test"
		self.daemon = True
		self.runPlayer = True
		self.fileReaderWriter = FileReaderWriter("queue")
		pygame.init()
		pygame.mixer.init(48000, -16, 2, 4096)

	def addSong(self, mac, fileName):
		self.fileReaderWriter.append(mac, fileName)

	def nextSong(self):
		pygame.mixer.music.stop()

	def volumeUp(self):
		volume = pygame.mixer.music.get_volume() + VOLUME_STEP
		pygame.mixer.music.set_volume(volume)
	
	def volumeDown(self):
		volume = pygame.mixer.music.get_volume() - VOLUME_STEP
		pygame.mixer.music.set_volume(volume)

	def queueHTML(self):
		return self.fileReaderWriter.queueHTML()

	def run(self):
		while self.runPlayer:
			if (not self.fileReaderWriter.isEmpty()):
				macFile = self.fileReaderWriter.readFirst().split('|')
				print("PLAYING" + macFile[1])
				if exists(MUSIC_DIR + macFile[1]):
					pygame.mixer.music.load(MUSIC_DIR + macFile[1])
					pygame.mixer.music.play()
					while pygame.mixer.music.get_busy() == True:
						continue
				else:
					print("NOT FOUND" + MUSIC_DIR + macFile[1])
			else:
				time.sleep(1)
	

class FileReaderWriter:
	def __init__(self, fileName):
		self._fileName=fileName
		self.openFile()
	
	def openFile(self):
		self._file = open(self._fileName, "a+")
		self._file.seek(0)
		self._data = self._file.read().splitlines(True)

	def writeData(self):
		self._file.seek(0)
		self._file.truncate()
		for line in self._data:
			self._file.write(line + '\n')

	def isEmpty(self):
		return len(self._data) == 0

	def readFirst(self):
		if(len(self._data) > 0):
			result = self._data[0]
			self._data = self._data[1:]
			self.writeData()
			return result
		else:
			return "empty" 

	def append(self, mac, fileName):
		self._data += [mac + "|"+  fileName]
		self.writeData()

	def queueHTML(self):
		if len(self._data) == 0:
			return "queue is empty"
		result = "<table>"
		for i in self._data:
			result += "<tr><td>" + i + "</tr></td>\n"
		result += "</table>"
		return result

	def quit(self):
		self._file.close()
			



class FilesReader:
	def __init(self):
		pass

	def readFolder(self, folder = ''):
		if not (exists(MUSIC_DIR + folder)):
			print("folder " + MUSIC_DIR + folder + " does not exist!")
			folder = '' 	
		onlyfiles = [ f for f in listdir(MUSIC_DIR + folder)]
		return onlyfiles

	def getFolderHTML(self, folder = ''):
		actFolders = self.readFolder(folder)
		result = "<table>\n"
		for f in actFolders:
			result += "<tr><td><a href='"
			path = folder + "/" + f
			if path[0] == '/':
				path = path[1:]
			if isfile(MUSIC_DIR + path):
				result += "cmd/playFile?file="
			else:
				result += "index.html?file="
			result += path + "'>" + f + "</a></td></tr>\n"
		result += "</table>"
		return result


class Driver:
	def __init__(self):
		GPIO.setmode(GPIO.BCM)
		GPIO.setup(0, GPIO.IN, pull_up_down=GPIO.PUD_UP)
		GPIO.setup(5, GPIO.IN, pull_up_down=GPIO.PUD_UP)
		GPIO.setup(6, GPIO.IN, pull_up_down=GPIO.PUD_UP)
		GPIO.setup(13, GPIO.IN, pull_up_down=GPIO.PUD_UP)
		GPIO.setup(11, GPIO.OUT)
		GPIO.setup(4, GPIO.OUT, pull_up_down=GPIO.PUD_DOWN)
		GPIO.add_event_detect(0, GPIO.FALLING, callback=self.switchRight, bouncetime=300)
		GPIO.add_event_detect(5, GPIO.FALLING, callback=self.switchLeft, bouncetime=300)
		GPIO.add_event_detect(6, GPIO.FALLING, callback=self.switchUp, bouncetime=300)
		GPIO.add_event_detect(13, GPIO.FALLING, callback=self.switchDown, bouncetime=300)
		print("GPIO setup")
		
	def ledEnable(self, val):
		GPIO.output(11, val)

	def ampEnable(self, val):
		GPIO.output(4, val)

	def switchUp(self, channel):
		print("up")
		self.ledEnable(True)
		self.ampEnable(True)

	def switchDown(self, channel):
		print("down")
		self.ledEnable(False)
		self.ledEnable(False)

	def switchLeft(self, channel):
		print("left")

	def switchRight(self, channel):
		print("right")

httpd = socketserver.TCPServer(("", PORT), MyHandler)
print("serving at port", PORT)
PLAYER = Player()
DRIVER = Driver()
FILES_READER = FilesReader()
PLAYER.start()
while RUN:
	httpd.handle_request()
httpd.server_close()
httpd.stopped = True
#httpd.serve_forever()

