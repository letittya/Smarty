import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)

relay_module = 37
GPIO.setup(relay_module,GPIO.OUT)

while 1:
	GPIO.output(relay_module,GPIO.LOW)
	time.sleep(5)
	GPIO.output(relay_module,GPIO.HIGH)
	time.sleep(5)
