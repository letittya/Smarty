import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)
photoresistor_pin = 7

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
	time.sleep(1)
