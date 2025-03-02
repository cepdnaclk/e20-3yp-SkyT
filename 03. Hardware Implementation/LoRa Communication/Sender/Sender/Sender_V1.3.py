"""
Created by Bimsara Gawesh
Last update on 01 March 2025
Sender for LoRa communication
This is currenty support for the one way communication between two devices

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
    This convert the input data to string and then send it through as a byte data
    Input parameters: 
        stringData : The data to send
        radio : The Lora radio 
        delay : Time waiting for sending packet
    """

    if(type(stringData) != str):
        stringData = str(stringData)

    data = bytes(stringData, "utf-8")
    radio.send(data)
    print(f"Data sent: {data.decode()}")

    time.sleep(delay)

count = 0

try:
    print("LoRa TX Started...")
    while True:
        sendStrings(count, sx1278, 1)
        
        if(count >= 99):
            count = 0
        else:
            count += 1
        
except KeyboardInterrupt:
    print("\nProgram interrupted")
finally:
    # Clean up
    print("GPIO cleaned up and program terminated.")