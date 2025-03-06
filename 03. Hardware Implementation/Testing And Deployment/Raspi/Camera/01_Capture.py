from picamera import PiCamera
from time import sleep

camera = PiCamera()

# Test by previewing the camera
camera.start_preview()
sleep(5)  # Keep preview on for 5 seconds
camera.stop_preview()

print("Camera test successful!")
