import time
import pigpio

# LED strip configuration
LED_COUNT = 30        # Number of LED pixels
GPIO_PIN = 18         # GPIO pin connected to the pixels (18 is commonly used with PWM)

# Initialize pigpio
pi = pigpio.pi()

# Create a function to set the color of all pixels
def set_strip_color(pi, gpio_pin, led_count, color):
    # Generate the waveform to set the color
    waveform = []
    for _ in range(led_count):
        for byte in color:
            for i in range(8):
                if byte & (1 << (7 - i)):
                    waveform.append(pigpio.pulse(1 << gpio_pin, 0, 900))
                    waveform.append(pigpio.pulse(0, 1 << gpio_pin, 350))
                else:
                    waveform.append(pigpio.pulse(1 << gpio_pin, 0, 350))
                    waveform.append(pigpio.pulse(0, 1 << gpio_pin, 900))

    pi.wave_add_generic(waveform)
    wave_id = pi.wave_create()
    pi.wave_send_once(wave_id)

# Main program logic
if __name__ == '__main__':
    try:
        set_strip_color(pi, GPIO_PIN, LED_COUNT, (255, 0, 0))  # Set all LEDs to red
        time.sleep(1)  # Keep the script running
    except KeyboardInterrupt:
        set_strip_color(pi, GPIO_PIN, LED_COUNT, (0, 0, 0))  # Turn off all LEDs on exit
    finally:
        pi.stop()
