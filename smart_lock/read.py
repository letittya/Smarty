import RPi.GPIO as GPIO 
import time
import pyrebase
from datetime import datetime
from mfrc522 import SimpleMFRC522  #the python library that reads/writes RFID tags via the budget RC522 RFID module
from rpi_lcd import LCD  #libary to write on the LCD display

lcd=LCD()  #instance of the LCD 

# configure GPIO pins to use the board layout, not BCM description 
GPIO.setmode(GPIO.BOARD) 
GPIO.setwarnings(False)  #opt not to receive warnings for GPIO setup 

#setting the buzzer as output
buzzer = 35
GPIO.setup(buzzer,GPIO.OUT)

#setting relay as output 
relay_module = 37
GPIO.setup(relay_module,GPIO.OUT)
GPIO.output(relay_module,GPIO.HIGH) #the relay is locked in the beginning 

#setting bicolor LED as output
green_led=13
red_led=11
GPIO.setup(green_led,GPIO.OUT)
GPIO.setup(red_led,GPIO.OUT)

direction = 38 # the GPIO pin for direction
step = 40  # the GPIO pin for step
clock_wise = 1
c_clock_wise= 0
# steps per revolution. The motor has 7.5°/step. Dividing 360/7.5 we get 48 steps/revolution.
spr = 48  

#photoresistor is on GPIO pin 7 
photoresistor_pin = 7

#setting direction and step of motor as output
GPIO.setup(direction, GPIO.OUT)
GPIO.setup(step, GPIO.OUT)

stepper_mode = ( 8 , 10 , 12)
GPIO.setup(stepper_mode, GPIO.OUT)
resolution = { 'Full' : ( 0, 0, 0), 
				'Half': ( 1, 0, 0),
				'1/4': (0,1,0),
				'1/8' : (1,1,0),
				'1/16': (0,0,1),
				'1/32' : (1,0,1) }
				
GPIO.output(stepper_mode, resolution['1/32'])

step_count = spr * 32
# 0,0208 is 1sec/48
delay = 0.0208 / 32


#the permitted id
good_id = "789061940596"

rfid_tag=SimpleMFRC522()   #create an instance, that will be used to read the cards


# configuring the firebase realtime database connection
config = {
	"apiKey" : "AIzaSyDS-no7jgHMXU9JzBH16TMt65XWItCGlY4",
	"authDomain" : "smarty-lock.firebaseapp.com",
	"databaseURL" : "https://smarty-lock-default-rtdb.firebaseio.com/",
	"storageBucket" : "smarty-lock.appspot.com",
}
firebase = pyrebase.initialize_app(config)
db = firebase.database()


# handles the countdown on the LCD display when the door is opened 
def door_countdown():
	lcd.clear()
	lcd.text("Door will close",1)
	for i in range(10, 0 , -1):   # counting from 10 -> 1
		concat_string="in " + str(i)  # make a string that contains the countdown
		lcd.text(concat_string ,2)
		time.sleep(1)   # wait 1 sec in between numbers
		

#sends the attempt to open to door to the Firebase database 		
def send_to_database_rfid(ids_successful,id,data):
	current_time = datetime.now().strftime('%d-%m-%Y %H:%M:%S')
	if (ids_successful):
		status = "granted"
	else:
		status = "denied"
		
	data_for_database = { 
		"id" : id,
		"data" : data,
		"timestamp" : current_time,
		"access" : status
	}
	db.child("RFID_scans"). push(data_for_database)
	print("Sent to Firebase")
	print(data_for_database)
	

# check if current id matches the authorized id and if it does, it grants access 
def compare_ids_successful(id,good_id, data):
	if(id==good_id):
		print("Permission granted")
		lcd.clear()
		lcd.text("Permission",1)
		lcd.text("granted",2)
		send_to_database_rfid(True,id,data)
		GPIO.output(green_led,GPIO.HIGH)   #turn green LED on
		GPIO.output(relay_module,GPIO.LOW)   # unlock the door using the relay 
		GPIO.output(buzzer,GPIO.HIGH)   #turn on buzzer 
		time.sleep(1)
		GPIO.output(buzzer,GPIO.LOW)   #turn off buzzer 
		door_countdown()   #display the countdown, 10 seconds until the door locks again 
		GPIO.output(relay_module,GPIO.HIGH)   # lock the door 
		GPIO.output(green_led,GPIO.LOW)   #turn off green LED 


#activates buzzer and red LED in order to indicate a denied entry		
def not_permitted_buzzer():
	GPIO.output(buzzer,GPIO.HIGH)
	GPIO.output(red_led,GPIO.HIGH)
	time.sleep(0.5)
	GPIO.output(buzzer,GPIO.LOW)
	GPIO.output(red_led,GPIO.LOW)
	time.sleep(0.5)


# check if current id does NOT match the authorized id and if it DOESN'T, it denies access 		
def compare_ids_NOT_successful(id,good_id,data):
	if(id!=good_id):
		print("Permission denied")
		lcd.clear()
		lcd.text("Permission",1)
		lcd.text("denied",2)
		send_to_database_rfid(False,id,data)
		# indicate the unsuccessful access attempt by blinking the red led and turning on/off the buzzer 3 times 
		for i in range(3):
			not_permitted_buzzer()

			
def blinds_up():
	db.child("Blinds").set(1) #set in the database that blinds are up
	#direction is clockwise 
	GPIO.output(direction, clock_wise)
	for x in range(step_count):
		GPIO.output(step, GPIO.HIGH)
		time.sleep(delay)
		GPIO.output(step, GPIO.LOW)
		time.sleep(delay)
	
		
def blinds_down():
	db.child("Blinds").set(0) #set in the database that blinds are down
	#direction is counter clockwise 
	GPIO.output(direction, c_clock_wise)
	for x in range(step_count):
		GPIO.output(step, GPIO.HIGH)
		time.sleep(delay)
		GPIO.output(step, GPIO.LOW)
		time.sleep(delay)
	
			
def measure_light_intensity():
	GPIO.setup(photoresistor_pin, GPIO.OUT)
	GPIO.output(photoresistor_pin, GPIO.LOW)
	time.sleep(0.1)
	GPIO.setup(photoresistor_pin, GPIO.IN)
	current_time = time.time()
	diff = 0
	while(GPIO.input (photoresistor_pin) == GPIO.LOW):
		diff = time.time() - current_time
	print(diff *100000)
	if( diff * 100000 > 150):
		if( db.child("Blinds").get().val() != 0 ) :
			blinds_down();
	elif ( diff * 100000 < 60):
		if( db.child("Blinds").get().val() != 1 ) :
			blinds_up();
		
	time.sleep(0.5)
	

flag=0		
	
	
# main loop that checks continuously for RFID tags 
while True:
	if(flag == 0):  #keeps track if a card was scanned or not
		print("Place your card to scan")
		flag=1
	# now print the text to the lcd screen
	lcd.text("Place your", 1)
	lcd.text("card to scan", 2)
	
	#no block so that we can perform other tasks if there's no RFID tag
	# if no block is not needed -> id, data = rfid_tag.read() 
	id, data = rfid_tag.read_no_block()  # read and get the data+id from the rfid card, they are None if there's no card
	if id:
		id=str(id) #converting from int -> string
		print(id)
		print(data)
		flag=0
		# compare the given ID to the authorized ID
		compare_ids_successful(id,good_id, data) 
		compare_ids_NOT_successful(id,good_id, data)
	
	else:
		measure_light_intensity()
		
	


