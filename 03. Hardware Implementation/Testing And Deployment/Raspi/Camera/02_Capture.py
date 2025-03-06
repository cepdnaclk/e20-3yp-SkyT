from picamera import PiCamera
from time import sleep

camera = PiCamera()
camera.resolution = (1024, 768)  # Set resolution
sleep(2)  # Allow time for auto-adjustment

# Capture an image and save it
camera.capture('/home/raspi/Desktop/Camera/image.jpg')
print("Image saved as image.jpg")
