import time
from rpi_ws281x import PixelStrip, Color

# LED strip configuration:
LED_COUNT = 30        # Number of LED pixels.
LED_PIN = 18          # GPIO pin connected to the pixels (18 is commonly used with PWM).
LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800kHz).
LED_DMA = 10          # DMA channel to use for generating signal (try 10).
LED_BRIGHTNESS = 255  # Set to 0 for darkest and 255 for brightest.
LED_INVERT = False    # True to invert the signal (when using NPN transistor level shift).
LED_CHANNEL = 0       # Set to 1 for GPIOs 13, 19, 41, 45 or 53.

# Create PixelStrip object with appropriate configuration.
strip = PixelStrip(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)

# Initialize the library (must be called once before other functions).
strip.begin()

def set_strip_color(strip, color):
    """Set the color of all pixels on the strip."""
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)
    strip.show()

# Main program logic follows:
if __name__ == '__main__':
    try:
        set_strip_color(strip, Color(255, 0, 0))  # Set all LEDs to red
        while True:
            time.sleep(1)  # Keep the script running
    except KeyboardInterrupt:
        set_strip_color(strip, Color(0, 0, 0))  # Turn off all LEDs on exit
