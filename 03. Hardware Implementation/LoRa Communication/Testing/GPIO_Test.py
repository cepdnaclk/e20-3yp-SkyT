import RPi.GPIO as GPIO
import time

# GPIO pin configuration
LED_PIN = 26  # GPIO 26
BUTTON_PIN = 21  # GPIO 21

# GPIO setup
GPIO.setmode(GPIO.BCM)  # Use BCM numbering
GPIO.setup(LED_PIN, GPIO.OUT)  # Set LED pin as output
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)  # Set button pin as input with pull-down resistor

try:
    print("Press the button to toggle the LED. Press Ctrl+C to exit.")
    while True:
        # Read the button state
        button_state = GPIO.input(BUTTON_PIN)

        # Toggle the LED based on the button state
        GPIO.output(LED_PIN, button_state)

        time.sleep(0.1)  # Small delay to debounce the button
except KeyboardInterrupt:
    print("\nProgram interrupted")
finally:
    # Clean up
    GPIO.output(LED_PIN, 0)  # Turn off the LED
    GPIO.cleanup()
    print("GPIO cleaned up and program terminated.")
