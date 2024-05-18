import time
import Adafruit_DHT as dht

#dht22_temperature_sensor = adafruit_dht.DHT22(16)

while True:
	#temperature_C = dht22_temperature_sensor.temperature
	#temperature_F = ( 9/5 * temperature_C ) + 32
	#humidity = dht22_temperature_sensor.humidity
	#print( "Celcius: {:.1f}C, Fahrenheit: {:.1f}F, Humidity: {:.1f}%".format(temperature_C, temperature_F, humidity))
	h,t = dht.read(dht.DHT22, 16)
	if h is not None and t is not None:
		print( "Celcius: {:.1f}C,Humidity: {:.1f}%".format(t,h))
	else :
		print("FAILEEED")
	time.sleep(2)
		
#Traceback (most recent call last):
  #File "/home/leti/Smarty/sensors/temprature.py", line 5, in <module>
   # GPIO.setmode(GPIO.BOARD)
#ValueError: A different mode has already been set!
