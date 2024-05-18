import time
import adafruit_dht
import board
import threading

dht22_temperature_sensor = adafruit_dht.DHT22(board.D16)

def dht22_read():
	while True:
		try:
			temperature_C = dht22_temperature_sensor.temperature
			temperature_F = ( 9/5 * temperature_C ) + 32
			humidity = dht22_temperature_sensor.humidity
			print( "Celcius: {:.1f}C, Fahrenheit: {:.1f}F, Humidity: {:.1f}%".format(temperature_C, temperature_F, humidity))
		except RuntimeError as error: #ignore errors and continue
			print(error.args[0])
		time.sleep(2)
		
sensor_thread = threading.Thread(target = dht22_read)
sensor_thread.daemon = True
sensor_thread.start()

while True:
	print("bla")
	time.sleep(1)
