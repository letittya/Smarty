import RPi.GPIO as GPIO 
from mfrc522 import SimpleMFRC522     #the python library that reads/writes RFID tags via the budget RC522 RFID module
from rpi_lcd import LCD #libary to write on the LCD

rfid_tag= SimpleMFRC522()      #create an instance, that will be used to read/write the cards
lcd=LCD() #instance of the LCD 

try:
	lcd.text("Insert the",1)
	lcd.text("new data",2)
	data = input('new data:')      # variable 'data' will store the given input
	print("Please place the tag")
	lcd.clear()
	lcd.text("Please place",1)
	lcd.text("the tag",2)
	rfid_tag.write(data)      # the data that was given as input is written on the RFID card
	print("Data written. Done!")
	lcd.clear()
	lcd.text("Done!",1)
	
finally:    #code that always gets executed 
	GPIO.cleanup()  # release all GPIO pins 

