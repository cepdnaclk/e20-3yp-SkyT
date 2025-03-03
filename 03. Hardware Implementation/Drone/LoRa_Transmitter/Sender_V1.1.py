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
from digitalio import DigitalInOut, Direction, Pull
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
|	  DIO0	  |      GPIO 0    |
+-------------+----------------+
"""
CS = DigitalInOut(board.CE1)
RESET = DigitalInOut(board.D22)
spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
sx1278 = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)

# You can however adjust the transmit power (in dB).  The default is 13 dB but
# high power radios like the RFM95 can go up to 23 dB:
sx1278.tx_power = 23
sx1278.signal_bandwidth = 125000
sx1278.coding_rate = 14
#sx1278.spreading_factor = 12
sx1278.enable_crc = True

count = 0

try:
    while True:
        data=bytes(str(count),"utf-8")
        sx1278.send(data)
        print(f"data sent: {data.decode()}")
        
        if(count >= 99):
            count = 0
        else:
            count += 1
        
        time.sleep(1)
except KeyboardInterrupt:
    print("\nProgram interrupted")
finally:
    # Clean up
    print("GPIO cleaned up and program terminated.")