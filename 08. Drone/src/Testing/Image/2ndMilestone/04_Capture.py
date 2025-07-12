from picamera import PiCamera
import time

camera = PiCamera()
camera.resolution = (1024, 768)
camera.start_preview()
time.sleep(5)

for i in range(4):  # 12 images (1 per 5 sec)
    filename = f"/home/raspi/Desktop/Camera/timelapse_{i}.jpg"
    camera.capture(filename)
    print(f"Captured {filename}")
    time.sleep(5)  # Wait 5 seconds

camera.stop_preview()
