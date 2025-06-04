from picamera import PiCamera
import time

camera = PiCamera()
camera.resolution = (1024, 768)
time.sleep(2)

filename = f"/home/raspi/Desktop/Camera/Lot01_{time.strftime('%Y-%m-%d_%H-%M-%S')}.jpg"
camera.capture(filename)
print(f"Image saved as {filename}")
