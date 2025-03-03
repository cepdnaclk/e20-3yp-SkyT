"""
Created by Bimsara Gawesh
Last update on 02 March 2025
Sender for LoRa communication
This is currenty support for the one way communication between two devices
Version 1.4

Key Parameters:
Module Name: LoRa-02 SX1278
Frequency: 433 MHz
Bandwidth: 125 kHz
Compatible OS: Raspberry Pi Bustter 2020
Compatible Python Version: Python 3
Prerequisites: spidev, RPi.GPIO, Adafruit_rfm9x

Note: Please reffer github repository for more information 
https://github.com/cepdnaclk/e20-3yp-SkyT
"""

# Import Python System Libraries
import time

# Import RFM9x
import adafruit_rfm9x

# Configure LoRa Radio
# Import Blinka Libraries
import busio
from digitalio import DigitalInOut
import board

# Frequency for communication in MHz
RADIO_FREQ_MHZ = 433.0

# Pin configuration
"""
+-------------+----------------+
| LoRa SX1278 |  Raspberry Pi  |
+-------------+----------------+
|	  VCC	  |      +3V3      |
|	  GND	  |       GND      |
|	  SCK	  |  SCK (GPIO 11) |
|	  MOSI	  | MOSI (GPIO 10) |
|	  MISO	  |  MISO (GPIO 9) |
|	  NSS	  |   CE1 (GPIO 7) |
|	  REST	  |     GPIO 22    |
|	  DIO0	  |       NC       |
|	  DIO1	  |       NC       |
|	  DIO2	  |       NC       |
|	  DIO3	  |       NC       |
|	  DIO4	  |       NC       |
|	  DIO5	  |       NC       |
+-------------+----------------+
"""
CS = DigitalInOut(board.CE1)
RESET = DigitalInOut(board.D22)

# Initialize SPI bus.
spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)

# Initialze SX1278 radio
sx1278 = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)

# You can however adjust the transmit power (in dB).  The default is 13 dB but
# high power radios like the RFM95 can go up to 23 dB:
sx1278.tx_power = 23
sx1278.signal_bandwidth = 125000
sx1278.coding_rate = 14
sx1278.enable_crc = True
#sx1278.spreading_factor = 12

# Sender Functions
def sendStrings(stringData, radio, delay=0.5):
    """
    Converts the input data to a string and sends it as byte data through the LoRa radio.

    Input parameters:
        stringData : The data to send (can be a string or any type that can be converted to a string).
        radio      : The LoRa radio object.
        delay      : Time to wait after sending the packet (in seconds).
    """
    try:
        # Convert input data to a string if it isn't already
        if not isinstance(stringData, str):
            stringData = str(stringData)

        # Convert the string to bytes using UTF-8 encoding
        data = bytes(stringData, "utf-8")

        # Check if the data exceeds 250 bytes
        if len(data) > 250:
            raise ValueError("Data exceeds 250 bytes. Please reduce the size of the input.")

        # Send the byte data through the LoRa radio
        radio.send(data)
        print(f"Data sent: {stringData} (Length: {len(data)} bytes)")

        # Wait for the specified delay
        time.sleep(delay)

    except Exception as e:
        print(f"Error sending data: {e}")

def sendByteArray(byteData, radio, delay=0.5):
    """
    Sends a byte array through the LoRa radio.
    Ensures the data is less than 250 bytes.

    Input parameters:
        byteData : The byte array to send.
        radio    : The LoRa radio object.
        delay    : Time to wait after sending the packet (in seconds).
    """
    try:
        # Check if the input is a byte array
        if not isinstance(byteData, bytes):
            raise ValueError("Input data must be of type 'bytes'.")

        # Check if the data exceeds 250 bytes
        if len(byteData) > 250:
            raise ValueError("Data exceeds 250 bytes. Please reduce the size of the input.")

        # Send the byte array
        radio.send(byteData)
        print(f"Byte array sent: {byteData} (Length: {len(byteData)} bytes)")

        # Wait for the specified delay
        time.sleep(delay)

    except Exception as e:
        print(f"Error sending data: {e}")

count = 0

try:
    print("LoRa TX Started...")
    while True:
        # sendStrings(count, sx1278, 1)

        # Example byte array
        #data = bytes([0x01, 0x02, 0x03, 0x04])  # Replace with your data
        #sendByteArray(data, sx1278, 1)  # Send data with a 1-second delay

        # Example data to send
        data = "Hello, LoRa!"  # Replace with your data
        sendStrings(data, sx1278, 1)  # Send data with a 1-second delay
        
        if(count >= 99):
            count = 0
        else:
            count += 1
        
except KeyboardInterrupt:
    print("\nProgram interrupted")
finally:
    # Clean up
    print("GPIO cleaned up and program terminated.")