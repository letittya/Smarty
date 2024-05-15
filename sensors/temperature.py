import time
import adafruit_dht
import board

DHT_SENSOR = adafruit_dht.DHT11(board.D4)

while True:
	try:
		temp = DHT_SENSOR.temperature
		hum = DHT_SENSOR.humidity
		print(f"Temp = {temp:.1f}C      Hum = {hum:.1f}%")
	except RuntimeError as error:
		print(error.args[0])
	time.sleep(2)
