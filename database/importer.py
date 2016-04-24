import re
import sqlite3 as lite
import sys
from os import listdir
from os.path import exists, isfile
from mutagen.easyid3 import EasyID3


MUSIC_DIR = '/mnt/usbDisk/MUSIC/'
DATABASE_FILE = '/home/martin1/server/database/database.db'

class DatabaseHandler:
	def __init__(self):
		self.con = lite.connect(DATABASE_FILE)
		if not self.con:
			raise Exception("Problem s pripojenim do databazy")

	def closeCon(self):
		if self.con:
			self.con.close() 
	
	def findId(self, what, where, name, value):
		sql = "SELECT " + what + " FROM '" + where + "' as a WHERE a." + name + " = '" + value + "';"
		cur = self.con.cursor()
		cur.execute(sql)
		data = cur.fetchone()
		if data is None:
			return None
		else:
			return data[0]

	def artistId(self, artist):
		aid = self.findId("ArtistID", "PL_Artist", "Name", artist)
		if aid is None:
			self.addArtist(artist)
			return self.findId("ArtistID", "PL_Artist", "Name", artist)
		return aid

	def genderId(self, gender):
		gid = self.findId("GenderID", "PL_Gender_List", "Name", gender)
		if gid is None:
			self.addGender(gender)
			return self.findId("GenderID", "PL_Gender_List", "Name", gender)
		return gid

	def albumId(self, name, year, artist, gender):
		aid = self.findId("AlbumID", "PL_Album", "Name", name)
		if aid is None:
			self.addAlbum(name, year, artist, gender)
			return self.findId("AlbumID", "PL_Album", "Name", name)
		return aid

	def songId(self, name, trackNum, artist, album):
		sid = self.findId("SongID", "PL_Song", "Name", name)
		if sid is None:
			self.addSong(name, trackNum, artist, album)
			return self.findId("SongID", "PL_Song", "Name", name)
		return sid

	def addArtist(self, artist):
		cur = self.con.cursor()
		sql = "INSERT INTO PL_Artist VALUES (null, '" + artist + "');"
		cur.execute(sql)
		self.con.commit()
	
	def addGender(self, gender):
		cur = self.con.cursor()
		sql = "INSERT INTO PL_Gender_List VALUES (null, '" + gender + "');"
		cur.execute(sql)
		self.con.commit()

	def addAlbum(self, name, year, artist, gender):
		cur = self.con.cursor()
		sql = "INSERT INTO PL_Album VALUES (null, '" + name + "','" + year + "',"  + str(artist) + "," + str(gender) + ");"
		cur.execute(sql)
		self.con.commit()

	def addSong(self, name, trackNum, artist, album):
		cur = self.con.cursor()
		sql = "INSERT INTO PL_Song VALUES (null, '" + name + "', '" + str(trackNum) + "', " + str(artist) + ", " + str(album) + ");"
		print(sql)
		cur.execute(sql)
		self.con.commit()

	def test(self):
		cur = self.con.cursor()    
		cur.execute("SELECT * FROM PL_Song")
		rows = cur.fetchall()
		for row in rows:
			print(row)

def escape(string):
	return string.replace("'", "''")

class FileReader:
	def read(self, folder = ''):
		if not exists(MUSIC_DIR + folder):
			raise Exception("Subor " + MUSIC_DIR + folder + " neexistuje!")
		for f in listdir(MUSIC_DIR + folder):
			path = MUSIC_DIR + folder + f
			if isfile(path):
				self.processFile(path)
			else:
				self.read(folder + f + '/')

	def getId3Info(self, info, name, pprint):
		if name in pprint:
			return escape(info[name][0])
		else:
			return ""

	def processFile(self, path):
		try:
			mp3info = EasyID3(path)
		except Exception as e:
			return
		print(path)
		info = mp3info.pprint()
		name = self.getId3Info(mp3info, "title", info)
		trackNum = self.getId3Info(mp3info, "tracknumber", info)
		artist = self.getId3Info(mp3info, "performer", info)
		album = self.getId3Info(mp3info, "album", info)
		gender = self.getId3Info(mp3info, "genre", info)
		year = self.getId3Info(mp3info, "date", info)
		artist = dh.artistId(artist)
		gender = dh.genderId(gender)
		album = dh.albumId(album, year, artist, gender) 
		album = dh.songId(name, trackNum, artist, album) 


dh = DatabaseHandler()
fr = FileReader()
fr.read()
dh.test()
dh.closeCon()
