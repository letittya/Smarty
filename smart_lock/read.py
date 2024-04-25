import RPi.GPIO as GPIO 
import time
from mfrc522 import SimpleMFRC522

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

buzzer=35
GPIO.setup(buzzer,GPIO.OUT)

rfid_tag=SimpleMFRC522()

while True:
	print("Place your tag to scan")
	id, data = rfid_tag.read()
	print(id)
	print(data)
	GPIO.output(buzzer,GPIO.HIGH)
	time.sleep(1)
	GPIO.output(buzzer,GPIO.LOW)
	
	time.sleep(3)

