"""
This is used for build the image using the payload.txt file
"""

import numpy as np
from PIL import Image
import re

# Image parameters
HEIGHT = 280
WIDTH = 388
CHANNELS = 3  # RGB
OUTPUT_FILE = "output_rgb_image.png"
EXPECTED_SIZE = HEIGHT * WIDTH * CHANNELS  # 325,920 bytes

# Read payload data from file
def load_payload_data(filename):
    with open(filename, "r") as file:
        lines = file.readlines()

    byte_data = []
    for line in lines:
        # Match lines like "Packet:<number>:DATA:<hex values>"
        match = re.match(r"PKT:\d+:DATA:(.+)", line.strip())
        if match:
            hex_string = match.group(1)
            # Split hex values by spaces and filter out empty strings
            hex_values = [x for x in hex_string.split(" ") if x]
            # Convert each hex value to an integer (byte) and append
            for hex_val in hex_values:
                byte_data.append(int(hex_val, 16))
    
    return byte_data

# Main processing
def generate_rgb_image():
    # Load the payload data
    byte_data = load_payload_data("payload.txt")
    data_size = len(byte_data)
    print(f"Received {data_size} bytes of payload data.")

    # Adjust to expected size (pad with zeros or truncate)
    if data_size < EXPECTED_SIZE:
        print(f"Warning: Data is short ({data_size} bytes), padding with zeros to reach {EXPECTED_SIZE}.")
        byte_data.extend([0] * (EXPECTED_SIZE - data_size))
    elif data_size > EXPECTED_SIZE:
        print(f"Warning: Data is too long ({data_size} bytes), truncating to {EXPECTED_SIZE}.")
        byte_data = byte_data[:EXPECTED_SIZE]

    # Convert to NumPy array
    data_array = np.array(byte_data, dtype=np.uint8)

    # Reshape into (HEIGHT, WIDTH, CHANNELS)
    reshaped_array = data_array.reshape((HEIGHT, WIDTH, CHANNELS))

    # Create RGB image from the array
    image = Image.fromarray(reshaped_array, mode="RGB")
    image.save(OUTPUT_FILE)
    print(f"RGB image saved as {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_rgb_image()