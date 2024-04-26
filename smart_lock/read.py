import RPi.GPIO as GPIO 
import time
from mfrc522 import SimpleMFRC522
from rpi_lcd import LCD

lcd=LCD()

lcd.text("hello ebi",1)

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

buzzer = 35
GPIO.setup(buzzer,GPIO.OUT)

relay_module = 37
GPIO.setup(relay_module,GPIO.OUT)

good_id = "789061940596"

rfid_tag=SimpleMFRC522()

while True:
	print("Place your tag to scan")
	id, data = rfid_tag.read()
	print(id)
	print(data)
	id=str(id)
	
	if(id==good_id):
		print("Permission granted")
		GPIO.output(relay_module,GPIO.HIGH)
		GPIO.output(buzzer,GPIO.HIGH)
		time.sleep(1)
		GPIO.output(buzzer,GPIO.LOW)
		time.sleep(5)
		GPIO.output(relay_module,GPIO.LOW)
		
	else:
		print("Permission denied")
		GPIO.output(buzzer,GPIO.HIGH)
		time.sleep(0.5)
		GPIO.output(buzzer,GPIO.LOW)
		time.sleep(0.5)
		GPIO.output(buzzer,GPIO.HIGH)
		time.sleep(0.5)
		GPIO.output(buzzer,GPIO.LOW)
		time.sleep(0.5)
		GPIO.output(buzzer,GPIO.HIGH)
		time.sleep(0.5)
		GPIO.output(buzzer,GPIO.LOW)
		
	


