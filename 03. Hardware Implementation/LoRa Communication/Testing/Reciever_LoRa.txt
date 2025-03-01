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

CS = DigitalInOut(board.CE1)
RESET = DigitalInOut(board.D22)
spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)

prev_packet = None

while True:
	print("Searching....")
	packet = None
	
	# check for packet rx
	packet = rfm9x.receive()
	
	if packet is not None:
		prev_packet = packet
		packet_text = str(prev_packet, "utf-8")
		print(f"Message: {packet_text}")
