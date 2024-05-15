import time
import RPi.GPIO as GPIO

GPIO.setwarnings(False) 
DIR = 38
STEP = 40
CW = 1
CCW = 0
SPR = 48

photoresistor_pin = 7

GPIO.setmode(GPIO.BOARD)
GPIO.setup(DIR, GPIO.OUT)
GPIO.setup(STEP, GPIO.OUT)
GPIO.output(DIR, CW)

step_count = SPR
delay = 0.0208

while 1:
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
		for x in range(step_count):
			GPIO.output(STEP, GPIO.HIGH)
			time.sleep(delay)
			GPIO.output(STEP, GPIO.LOW)
			time.sleep(delay)
	time.sleep(1)
	
	
	
	
	
	
