import board
import time
import neopixel

#led_count = 30
#led_pin = 12 #GPIO 12 so board 32
#led_brightness = 0.2

led_strip = neopixel.NeoPixel(board.D12, 30, 1)

def color_strip(color):
	for i in range(led_count):
		led_strip[i] = color
		led_strip.show()
		time.sleep(0.05)
		
while True:
	led_strip.fill((0,220,0))
	time.sleep(5)
	led_strip.fill((0,0,0))
	
	
#Traceback (most recent call last):
  #File "/home/leti/Smarty/sensors/leds.py", line 9, in <module>
   # led_strip = neopixel.NeoPixel(board.D12, 30, 1)
#TypeError: __init__() takes 3 positional arguments but 4 were given


