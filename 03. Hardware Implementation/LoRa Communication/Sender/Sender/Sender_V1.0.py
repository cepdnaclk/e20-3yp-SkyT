# Import Python System Libraries
import time

# Import RFM9x
import adafruit_rfm9x

# Configure LoRa Radio
# Import Blinka Libraries
import busio
from digitalio import DigitalInOut, Direction, Pull
import board

RADIO_FREQ_MHZ = 433.0

print("Board:", end=": ") 
print(board.CE0)

CS = DigitalInOut(board.CE1)
RESET = DigitalInOut(board.D22)
spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)#

# You can however adjust the transmit power (in dB).  The default is 13 dB but
# high power radios like the RFM95 can go up to 23 dB:
rfm9x.tx_power = 23

# Apply new modem config settings to the radio to improve its effective range
rfm9x.signal_bandwidth = 125000
rfm9x.coding_rate = 14
#rfm9x.spreading_factor = 12
rfm9x.enable_crc = True

count = 0

while True:
	data=bytes(str(count),"utf-8")
	rfm9x.send(data)
	print(f"data sent: {data.decode()}")
	
	if(count >= 99):
		count = 0
	else:
		count += 1
	
	time.sleep(1)
