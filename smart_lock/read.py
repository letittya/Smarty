import RPi.GPIO as GPIO 
import time
from mfrc522 import SimpleMFRC522  #the python library that reads/writes RFID tags via the budget RC522 RFID module
from rpi_lcd import LCD  #libary to write on the LCD

lcd=LCD()  #instance of the LCD 

# configure GPIO pins to use the board layout, not BCM description 
GPIO.setmode(GPIO.BOARD) 
GPIO.setwarnings(False)  #opt not to receive warnings for GPIO setup 

#initiate the buzzer as output
buzzer = 35
GPIO.setup(buzzer,GPIO.OUT)

#initiate relay as output 
relay_module = 37
GPIO.setup(relay_module,GPIO.OUT)
GPIO.output(relay_module,GPIO.HIGH) #the relay is locked in the beginning 

#initiate bicolor LED as output
green_led=13
red_led=11
GPIO.setup(green_led,GPIO.OUT)
GPIO.setup(red_led,GPIO.OUT)

#the permitted id
good_id = "789061940596"

rfid_tag=SimpleMFRC522()   #create an instance, that will be used to read the cards


def door_countdown():
	lcd.clear()
	lcd.text("Door will close",1)
	for i in range(10, 0 , -1):   # counting from 10 -> 1
		concat_string="in " + str(i)  # make a string that contains the countdown
		lcd.text(concat_string ,2)
		time.sleep(1)   # wait 1 sec in between counts 

def compare_ids_successful(id,good_id):
	# check if current id matches the good id
	if(id==good_id):
		print("Permission granted")
		lcd.clear()
		lcd.text("Permission",1)
		lcd.text("granted",2)
		GPIO.output(green_led,GPIO.HIGH)   #turn green LED on
		GPIO.output(relay_module,GPIO.LOW)   # unlock the door using the relay 
		GPIO.output(buzzer,GPIO.HIGH)   #turn on buzzer 
		time.sleep(1)
		GPIO.output(buzzer,GPIO.LOW)   #turn off buzzer 
		door_countdown()   #display the countdown, 10 seconds until the door locks again 
		GPIO.output(relay_module,GPIO.HIGH)   # lock the door 
		GPIO.output(green_led,GPIO.LOW)   #turn off green LED 
		
def not_permitted_buzzer():
	GPIO.output(buzzer,GPIO.HIGH)
	GPIO.output(red_led,GPIO.HIGH)
	time.sleep(0.5)
	GPIO.output(buzzer,GPIO.LOW)
	GPIO.output(red_led,GPIO.LOW)
	time.sleep(0.5)
		
def compare_ids_NOT_successful(id,good_id):
	# check if current id does NOT match the good id
	if(id!=good_id):
		print("Permission denied")
		lcd.clear()
		lcd.text("Permission",1)
		lcd.text("denied",2)
		# indicate the unsuccessful access attempt by blinking the red led and turning on/off the buzzer 3 times 
		for i in range(3):
			not_permitted_buzzer()
		
	
# main loop that checks continuously for RFID tags 
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
	
	# compare the given ID to the authorized ID
	compare_ids_successful(id,good_id) 
	compare_ids_NOT_successful(id,good_id)
	


