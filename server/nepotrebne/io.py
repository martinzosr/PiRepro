import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
	 
GPIO.setup(13, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(11, GPIO.OUT)
TB = True
while True:
	print(GPIO.input(13))
	GPIO.output(11, TB)
	if TB:
		TB = False
	else:
		TB = True
	time.sleep(1)
