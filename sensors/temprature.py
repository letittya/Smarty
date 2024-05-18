import time
import adafruit_dht
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)

dht22_temperature_sensor = adafruit_dht.DHT22(16)


while True:
	try:
		temperature_C = dht22_temperature_sensor.temperature
		temperature_F = ( 9/5 * temperature_C ) + 32
		humidity = dht22_temperature_sensor.humidity
		print( "Celcius: {:.1f}C, Fahrenheit: {:.1f}F, Humidity: {:.1f}%".format(temperature_C, temperature_F, humidity))
	except RuntimeError as error: #ignore errors and continue
		print(error.args[0])
	time.sleep(2)
		
#Traceback (most recent call last):
  #File "/home/leti/Smarty/sensors/temprature.py", line 5, in <module>
   # GPIO.setmode(GPIO.BOARD)
#ValueError: A different mode has already been set!
