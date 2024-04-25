import RPi.GPIO as GPIO 
import time
from mfrc522 import SimpleMFRC522

#GPIO.setmode(GPIO.BCM)

reader=SimpleMFRC522()

while True:
	id, text = reader.read()
	print(id)
	print(text)
	time.sleep(3)

