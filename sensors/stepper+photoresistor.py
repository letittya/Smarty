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

MODE = ( 8 , 10 , 12)
GPIO.setup(MODE, GPIO.OUT)
RESOLUTION = { 'Full' : ( 0, 0, 0), 
				'Half': ( 1, 0, 0),
				'1/4': (0,1,0),
				'1/8' : (1,1,0),
				'1/16': (0,0,1),
				'1/32' : (1,0,1) }
				
GPIO.output(MODE, RESOLUTION['1/32'])


step_count = SPR * 32
delay = 0.0208 / 32


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
	
	
	
	
	
	
