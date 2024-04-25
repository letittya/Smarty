import RPi.GPIO as GPIO 
from mfrc522 import SimpleMFRC522     #the python library that reads/writes RFID tags via the budget RC522 RFID module

rfid_tag= SimpleMFRC522()      #create an instance of the class, that will be used to read/write the cards

try:
	data = input('new data:')      # variable 'data' will store the given input
	print("Please place the tag")
	rfid_tag.write(data)      # the data that was given as input is written on the RFID card
	print("Data written")
	
finally:    #code that always gets executed 
	GPIO.cleanup()  # release all GPIO pins 

