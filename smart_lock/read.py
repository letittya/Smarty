import RPi.GPIO as GPIO 
import time
from mfrc522 import SimpleMFRC522
from rpi_lcd import LCD

lcd=LCD()

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)

buzzer = 35
GPIO.setup(buzzer,GPIO.OUT)

#relay_module = 37
#GPIO.setup(relay_module,GPIO.OUT)

good_id = "789061940596"

rfid_tag=SimpleMFRC522()

def compare_ids_successful(id,good_id):
	if(id==good_id):
		print("Permission granted")
		lcd.clear()
		lcd.text("Permission",1)
		lcd.text("granted",2)
		#GPIO.output(relay_module,GPIO.HIGH)
		GPIO.output(buzzer,GPIO.HIGH)
		time.sleep(1)
		GPIO.output(buzzer,GPIO.LOW)
		time.sleep(5)
		#GPIO.output(relay_module,GPIO.LOW)
		
def not_permitted_buzzer():
	GPIO.output(buzzer,GPIO.HIGH)
	time.sleep(0.5)
	GPIO.output(buzzer,GPIO.LOW)
	time.sleep(0.5)
		
def compare_ids_NOT_successful(id,good_id):
	if(id!=good_id):
		print("Permission denied")
		lcd.clear()
		lcd.text("Permission",1)
		lcd.text("denied",2)
		for i in range(3):
			not_permitted_buzzer()
		
	

while True:
	# read and get the data+id from the rfid card 
	print("Place your card to scan")
	# now print the text to the lcd screen
	lcd.text("Place your", 1)
	lcd.text("card to scan", 2)
	id, data = rfid_tag.read()
	id=str(id) #converting from int -> string
	print(id)
	print(data)
	
	compare_ids_successful(id,good_id) 
	compare_ids_NOT_successful(id,good_id)
	


