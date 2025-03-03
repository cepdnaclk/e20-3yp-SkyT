"""
Created by Bimsara Gawesh
Last update on 02 March 2025
Imager for LoRa communication
This module requires a server for the communication
This is currenty support for load image from the current directory and produce numpy array for communication
Version 1.0

Key Parameters:
Compatible OS: Raspberry Pi Bustter 2020
Compatible Python Version: Python 3
Prerequisites: numpy, pillow

Note: Please reffer github repository for more information 
https://github.com/cepdnaclk/e20-3yp-SkyT
"""

# Import Python System Libraries
import numpy as np
from PIL import Image

# Function to print details of the image
def printDetails(image):
    """
    Prints detailed information about the image.

    Parameters:
        image (PIL.Image): A Pillow Image object.

    Returns:
        None
    """
    try:
        print("Image Details:")
        print(f"Format: {image.format}")  # Image format (e.g., JPEG, PNG)
        print(f"Size: {image.size}")      # Tuple (width, height) in pixels
        print(f"Mode: {image.mode}")      # Color mode (e.g., 'RGB', 'L', 'RGBA')
        print(f"Width: {image.width} pixels")
        print(f"Height: {image.height} pixels")
        print(f"Channels: {len(image.getbands())}")  # Number of channels (e.g., 3 for RGB, 1 for grayscale)
        
        # Additional details
        if image.mode == 'P':
            print("Note: Image uses a palette (indexed colors).")
        if image.info:
            print("\nAdditional Metadata:")
            for key, value in image.info.items():
                print(f"{key}: {value}")
        else:
            print("\nNo additional metadata found.")
    except AttributeError:
        print("Error: Input is not a valid Pillow Image object.")
    except Exception as e:
        print(f"Error processing image: {e}")

# Function to print numpy array
def printArrayDetails(array, sample_size=5):
    """
    Prints details of a NumPy array, including shape, data type, and a sample of the array.

    Parameters:
        array (numpy.ndarray): The NumPy array to analyze.
        sample_size (int): Number of elements to display from the beginning and end of the array.

    Returns:
        None
    """
    try:
        if not isinstance(array, np.ndarray):
            raise ValueError("Input is not a NumPy array.")

        print("NumPy Array Details:")
        print(f"Shape: {array.shape}")  # Dimensions of the array
        print(f"Data Type: {array.dtype}")  # Data type of the array elements
        print(f"Number of Elements: {array.size}")  # Total number of elements
        print(f"Number of Dimensions: {array.ndim}")  # Number of dimensions

        # Print a sample of the array
        if array.size <= 2 * sample_size:
            print("\nArray Data:")
            print(array)
        else:
            print("\nArray Data (Sample):")
            print("First few elements:")
            print(array.flatten()[:sample_size])
            print("Last few elements:")
            print(array.flatten()[-sample_size:])

    except Exception as e:
        print(f"Error processing NumPy array: {e}")

# Function to load image and convert it into a numpy array
def loadImage(image_path):
    """
    Loads an image from the specified path and converts it into a NumPy array.

    Parameters:
        image_path (str): Path to the image file.

    Returns:
        numpy.ndarray: A NumPy array representing the image.
                      The shape of the array will be (height, width, channels) for RGB images
                      or (height, width) for grayscale images.
    """
    try:
        # Open the image using Pillow
        img = Image.open(image_path)
        
        # Print details of the loaded image
        printDetails(img)

        # Convert the image to a NumPy array
        img_array = np.array(img)

        # Print array details
        printArrayDetails(img_array)

        return img_array

    except Exception as e:
        print(f"Error loading image: {e}")
        return None
    
try:
    print("LoRa Server Started...")
    imageArr = loadImage("image.webp")
except KeyboardInterrupt:
    print("\nProgram interrupted")
finally:
    # Clean up
    print("GPIO cleaned up and program terminated.")