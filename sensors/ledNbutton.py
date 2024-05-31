import RPi.GPIO as GPIO 
import time

GPIO.setmode(GPIO.BOARD) 
GPIO.setwarnings(False)  #opt not to receive warnings for GPIO setup 

heat_led=18
GPIO.setup(heat_led,GPIO.OUT)

#setting bicolor LED as output
green_led=13
red_led=11
GPIO.setup(green_led,GPIO.OUT)
GPIO.setup(red_led,GPIO.OUT)


button=16
#configure an internal pull-up resistor so that when button isn't pressed it will read as HIGH
GPIO.setup(button,GPIO.IN, pull_up_down = GPIO.PUD_DOWN) 

def button_pressed(channel): #passes the pin nr (channel)
	print("Button was pressed")
	GPIO.output(red_led,GPIO.HIGH)
	time.sleep(3)
	GPIO.output(red_led,GPIO.LOW)
	print("DONE")
	
#works like an interrupt; check for changes in the button pin without blocking the main program 
#when it's 'falling' from high->low it executes the function and it ignores additional button presses for 300 ms
GPIO.add_event_detect(button,GPIO.RISING, callback = button_pressed, bouncetime = 300)

while True:
	GPIO.output(green_led,GPIO.HIGH)
	GPIO.output(heat_led,GPIO.HIGH)
	time.sleep(5)
	GPIO.output(heat_led,GPIO.LOW)
	GPIO.output(green_led,GPIO.LOW)
	time.sleep(5)
