from pydub import AudioSegment

sound = AudioSegment.from_mp3("../song.mp3")

# sound._data is a bytestring
raw_data = sound._data
print(raw_data)
