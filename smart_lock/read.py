import RPi.GPIO as GPIO 
import time
import pyrebase
import Adafruit_DHT as dht
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

#setting fan (a relay) as output
fan=31
GPIO.setup(fan,GPIO.OUT)
GPIO.output(fan,GPIO.HIGH) #fan is off in the beginning

#setting bicolor LED as output
green_led=13
red_led=11
GPIO.setup(green_led,GPIO.OUT)
GPIO.setup(red_led,GPIO.OUT)

#setting heating on LED as output
heat_led=18
GPIO.setup(heat_led,GPIO.OUT)

#setting button as input to unlock door from inside the house
button=16
#configure an internal pull-up resistor so that when button isn't pressed it will read as HIGH
GPIO.setup(button,GPIO.IN, pull_up_down = GPIO.PUD_UP) 

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

step_count = spr * 60
# 0,0208 is 1sec/48
delay = 0.0208 / 25

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

current_blinds_state = db.child("Blinds").get().val()  #get the value thats stored in database for blinds

# handles the countdown on the LCD display when the door is opened 
def door_countdown(number):
	lcd.clear()
	lcd.text("Door will close",1)
	for i in range(number, 0 , -1):   # counting from number -> 1
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
		door_countdown(10)   #display the countdown, 10 seconds until the door locks again 
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
	global current_blinds_state
	current_blinds_state = 1
	db.child("Blinds").set(1) #set in the database that blinds are up
	#direction is clockwise 
	GPIO.output(direction, clock_wise)
	for x in range(step_count):
		GPIO.output(step, GPIO.HIGH)
		time.sleep(delay)
		GPIO.output(step, GPIO.LOW)
		time.sleep(delay)
	
		
def blinds_down():
	global current_blinds_state
	current_blinds_state = 0
	db.child("Blinds").set(0) #set in the database that blinds are down
	#direction is counter clockwise 
	GPIO.output(direction, c_clock_wise)
	for x in range(step_count):
		GPIO.output(step, GPIO.HIGH)
		time.sleep(delay)
		GPIO.output(step, GPIO.LOW)
		time.sleep(delay)


def blinds_half(clockwise_or_counter_clockwise, status , step_count_half):
	global current_blinds_state
	current_blinds_state = status
	db.child("Blinds").set(status) #set in the database that blinds are half-up ( same as half-down )
	GPIO.output(direction, clockwise_or_counter_clockwise)
	for x in range(step_count_half):  #performing floor division
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
	# get value from database to see if automated blinds are enabled or disabled
	automated_blinds = db.child("Automated_blinds").get().val()
	if( diff * 100000 > 400 and automated_blinds=='enabled'):
		if( current_blinds_state == 1) :
			blinds_down()
		if( current_blinds_state == 0.5 ):
			blinds_half(0,0,(spr * 40) )
	elif ( diff * 100000 < 60 and automated_blinds=='enabled'):
		if( current_blinds_state == 0 ) :
			blinds_up();
		if( current_blinds_state == 0.5 ):
			blinds_half(1,1,(spr * 20))
	else:
		status_from_app = db.child("Blinds").get().val()
		if (status_from_app == 1 and current_blinds_state == 0):
			blinds_up()
		elif (status_from_app == 0 and current_blinds_state == 1):
			blinds_down()
		elif (status_from_app == 1 and current_blinds_state == 0.5):
			blinds_half(1,1,(spr * 20) )
		elif (status_from_app == 0 and current_blinds_state == 0.5):
			blinds_half(0,0,(spr * 40) )
		elif (status_from_app == 0.5 and current_blinds_state == 1):
			blinds_half(0,0.5,(spr * 20) ) # counter clock wise
		elif (status_from_app == 0.5 and current_blinds_state == 0):
			blinds_half(1,0.5, (spr * 40) ) #clock wise
		
	time.sleep(0.5)
	

def read_DHT22_and_automated_fan():
	humidity,temperature_C = dht.read(dht.DHT22, 16) #GPIO pin 16 (board pin 36) is the DHT22's data pin
	if humidity is not None and temperature_C is not None:
		humidity = round(humidity,1)
		temperature_C = round(temperature_C,1)
		print( "Celcius: {}C,Humidity: {}%".format(temperature_C,humidity))
		db.child("DHT22").child("Temperature_Celcius").set(temperature_C)
		db.child("DHT22").child("Humidity").set(humidity)
		fan_enabled = db.child("DHT22").child("Fan_automated").get().val()
		heat_enabled = db.child("DHT22").child("Heating_automated").get().val()
		if(temperature_C >= 26 and fan_enabled == 'enabled'):
			GPIO.output(fan,GPIO.LOW)
			db.child("DHT22").child("Fan").set(1)
		elif(temperature_C <= 24 and fan_enabled == 'enabled'):
			GPIO.output(fan,GPIO.HIGH)
			db.child("DHT22").child("Fan").set(0)
		elif (temperature_C <= 18 and heat_enabled == 'enabled'):
			GPIO.output(heat_led,GPIO.HIGH)
			db.child("DHT22").child("Heating").set(1)
		elif (temperature_C >= 21 and heat_enabled == 'enabled'):
			GPIO.output(heat_led,GPIO.LOW)
			db.child("DHT22").child("Heating").set(0)
		# check for values from app
		fan_rn = db.child("DHT22").child("Fan").get().val()
		heat_rn = db.child("DHT22").child("Heating").get().val()
		if( fan_rn == 1):
			GPIO.output(fan,GPIO.LOW)
		elif (fan_rn == 0):
			GPIO.output(fan,GPIO.HIGH)
		if( heat_rn == 1):
			GPIO.output(heat_led,GPIO.HIGH)
		elif ( heat_rn == 0):
			GPIO.output(heat_led,GPIO.LOW)
			

def button_pressed():
	global button_was_pressed
	print("Button pressed")
	GPIO.output(relay_module,GPIO.LOW)   # unlock the door using the relay 
	door_countdown(5)
	GPIO.output(relay_module,GPIO.HIGH)   # lock the door 
	print("Button is finished doing its business")


flag = 0	
	
# main loop that checks continuously for RFID tags 
while True:
	if(flag == 0):  #keeps track if a card was scanned or not
		print("Place your card to scan")
		flag=1
	# now print the text to the lcd screen
	lcd.text("Place your", 1)
	lcd.text("card to scan", 2)
	
	button_state = GPIO.input(button)
	
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
	
	#if button pressed -> open the door for 5 seconds
	elif button_state == 0:
		button_pressed()
	
	else:
		measure_light_intensity()
		read_DHT22_and_automated_fan()

		
	


