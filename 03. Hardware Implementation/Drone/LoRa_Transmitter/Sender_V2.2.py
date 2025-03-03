"""
Created by Bimsara Gawesh
Last update on 02 March 2025
Sender for LoRa communication
This module requires a server for the communication
This is currenty support for the one way communication between two devices
Version 2.2

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

# Delay between two packets in seconds
DELAY = 1

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
def sendStrings(stringData, radio=sx1278, delay=DELAY):
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

def sendByteArray(byteData, radio=sx1278, delay=DELAY):
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

def sendLargeData(data, radio=sx1278, delay=DELAY):
    """
    Sends a large dataset by splitting it into chunks of 250 bytes (or less) and transmitting each chunk.

    Input parameters:
        data       : The data to send (can be a string, bytes, or bytearray).
        radio      : The LoRa radio object (defaults to sx1278).
        delay      : Time to wait after sending each chunk (in seconds).
        chunk_size : Maximum size of each chunk (default is 250 bytes).
    """
    
    chunk_size = 250 # Allowed maximum size of each chunk

    try:
        # Convert input data to bytes if it isn't already
        if isinstance(data, str):
            data = bytes(data, "utf-8")
        elif isinstance(data, bytearray):
            data = bytes(data)
        elif not isinstance(data, bytes):
            raise ValueError("Input data must be a string, bytes, or bytearray.")

        # Split the data into chunks
        chunks = [data[i:i + chunk_size] for i in range(0, len(data), chunk_size)]

        # Send each chunk
        for i, chunk in enumerate(chunks):
            print(f"Sending chunk {i + 1}/{len(chunks)} (Length: {len(chunk)} bytes)")
            radio.send(chunk)
            time.sleep(delay)  # Wait before sending the next chunk

        print("All chunks sent successfully.")

    except Exception as e:
        print(f"Error sending large data: {e}")

def sendImage(image_array, radio=sx1278, delay=DELAY):
    """
    Sends a 2D (grayscale) or 3D (RGB) NumPy array (image) over LoRa by splitting it into chunks.

    Input parameters:
        image_array : The 2D (grayscale) or 3D (RGB) NumPy array to send.
        radio       : The LoRa radio object (defaults to sx1278).
        delay       : Time to wait after sending each chunk (in seconds).
        chunk_size  : Maximum size of each chunk (default is 250 bytes).
    """
    
    chunk_size=250

    try:
        # Check if the image is grayscale (2D) or RGB (3D)
        if image_array.ndim == 2:
            image_type = "grayscale"
        elif image_array.ndim == 3 and image_array.shape[2] == 3:
            image_type = "RGB"
        else:
            raise ValueError("Unsupported image format. Must be 2D (grayscale) or 3D (RGB).")

        # Serialize the image array into bytes
        image_bytes = image_array.tobytes()

        # Split the byte stream into chunks
        chunks = [image_bytes[i:i + chunk_size] for i in range(0, len(image_bytes), chunk_size)]

        # Send metadata (image shape, dtype, and type) first
        metadata = {
            "shape": image_array.shape,
            "dtype": str(image_array.dtype),
            "type": image_type  # Add image type (grayscale or RGB)
        }
        metadata_bytes = str(metadata).encode("utf-8")

        # Sending meta data
        radio.send(metadata_bytes)
        time.sleep(delay)
        
        print(f"Metadata sent: {metadata}")

        # Send each chunk
        for i, chunk in enumerate(chunks):
            print(f"Sending chunk {i + 1}/{len(chunks)} (Length: {len(chunk)} bytes)")
            radio.send(chunk)
            time.sleep(delay)  # Wait before sending the next chunk

        print("Image sent successfully.")

    except Exception as e:
        print(f"Error sending image: {e}")