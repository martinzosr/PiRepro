from pydub import AudioSegment
import numpy as np
# https://github.com/jiaaro/pydub
file = open("output.csv", 'w')


class Song:
    def __init__(self, filename):
        sound = AudioSegment.from_wav(filename)
        self.data = sound.get_array_of_samples()
        self.frame_rate = sound.frame_rate

    def fft(self):
        N = len(self.data)
        # sample spacing
        T = 1.0 / 44000.0
        x = np.linspace(0.0, N*T, N)
        y = np.sin(50*2.0*np.pi*x)
        y = self.data
        yf = y
        # yf = np.fft.fft(y)[:N/2]
        yf = 2.0/N * np.abs(yf)
        np.linspace(0.0, 1.0/(2.0*T), N/2)
        # file.write(output)
        file.close()

    def getBPM(self):
        pass

    def countEnergySample(self, data):
        result = 0
        for i in range(len(data)):
            result += pow(data[i], 2)
        return result

    def countEnergySampleFFT(self, data):
        n = len(data)
        avg = [0] * 16
        for i in range(n/32):
            sample = data[i*32:(i+1)*32]
            fft = (np.fft.fft(sample)/n)[:16]
            fft2 = 2.0/n * np.abs(fft)
            for i in range(len(fft2)):
                avg[i] += fft2[i]
        avg = [round(m, 3) for m in avg]
        out = ""
        for i in avg:
            out += str(i) + ","
        out = out[:-1]
        file.write(out + '\n')
        print(avg)
        return (avg)

    def countEnergy(self):
        dataForAverage = []
        allEnergies = []
        numberOfSamples = len(self.data)/1024
        average = 0
        for i in range(numberOfSamples):
            energy = self.countEnergySample(self.data[i*1024:(i+1)*1024])
            allEnergies += [energy]

        for i in range(1, numberOfSamples):
            average += energy
            if len(dataForAverage) > 43:
                dataForAverage = dataForAverage[1:]
            dataForAverage += [allEnergies[i]]
            if self.checkEnergy(dataForAverage, allEnergies[i]):
                print(i)

    def countVarianceSample(average, energy):
        pass

    def checkEnergy(self, dataForAverage, energy):
        if len(dataForAverage) < 10:
            return False
        average = 0
        for i in range(len(dataForAverage)):
            average += dataForAverage[i]
        average = average / len(dataForAverage)
        return energy - average > 0


song = Song("../song.wav")
song2 = Song("../nohavica.wav")
for i in range(30):
    res = song.countEnergySampleFFT(song.data[(i+500)*1024:(i+501)*1024])
print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
file.write('\n')
for i in range(30):
    song2.countEnergySampleFFT(song2.data[(i+500)*1024:(i+501)*1024])
file.close()
