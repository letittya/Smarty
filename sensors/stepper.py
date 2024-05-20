from time import sleep
import RPi.GPIO as GPIO

DIR = 38
STEP = 40
CW = 1
CCW = 0
SPR = 48

GPIO.setwarnings(False)

GPIO.setmode(GPIO.BOARD)
GPIO.setup(DIR, GPIO.OUT)
GPIO.setup(STEP, GPIO.OUT)
GPIO.output(DIR, CCW)

MODE = ( 8 , 10 , 12)
GPIO.setup(MODE, GPIO.OUT)
RESOLUTION = { 'Full' : ( 0, 0, 0), 
				'Half': ( 1, 0, 0),
				'1/4': (0,1,0),
				'1/8' : (1,1,0),
				'1/16': (0,0,1),
				'1/32' : (1,0,1) }
				
GPIO.output(MODE, RESOLUTION['1/32'])


step_count = SPR * 60
delay = 0.0208 / 25

for x in range(step_count):
	GPIO.output(STEP, GPIO.HIGH)
	sleep(delay)
	GPIO.output(STEP, GPIO.LOW)
	sleep(delay)
	
#sleep(0.5)
#GPIO.output(DIR, CCW)

#for x in range(step_count):
	#GPIO.output(STEP, GPIO.HIGH)
	#sleep(delay)
	#GPIO.output(STEP, GPIO.LOW)
	#sleep(delay)
