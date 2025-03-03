"""
Created by Bimsara Gawesh
Last update on 03 March 2025
Reciever for BLE communication
This is currenty support for the one way communication between two devices (ESP32 and Raspi Zero W)

Key Parameters:
Module Name: Built-in Bluetooth Module
Compatible OS: Raspberry Pi Bustter 2020
Compatible Python Version: Python 3
Prerequisites: bluepy

Note: Please reffer github repository for more information 
https://github.com/cepdnaclk/e20-3yp-SkyT
"""

# Import bluepy
from bluepy.btle import Scanner, DefaultDelegate, Peripheral, UUID

# Custom class for capture packets
class MyDelegate(DefaultDelegate):
    def __init__(self):
        DefaultDelegate.__init__(self)

    # This method is called when a notification is received
    def handleNotification(self, cHandle, data):
        # Print the received byte array as a list of integers
        print(f"Received data: {list(data)}")  

# ESP32's BLE address
esp32_address = "78:21:84:88:58:a6"

print(f"Connecting to {esp32_address}...")
p = Peripheral(esp32_address)

try:
    # Set the delegate to handle notifications
    p.setDelegate(MyDelegate())

    # Get the service and characteristic
    service_uuid = UUID("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
    char_uuid = UUID("beb5483e-36e1-4688-b7f5-ea07361b26a8")

    service = p.getServiceByUUID(service_uuid)
    characteristic = service.getCharacteristics(char_uuid)[0]

    # Enable notifications
    print("Enabling notifications...")
    cccd_handle = characteristic.getHandle() + 1  # CCCD handle is usually +1 from the characteristic handle
    p.writeCharacteristic(cccd_handle, b"\x01\x00", withResponse=True)  # Enable notifications

    print("Waiting for notifications...")
    while True:
        if p.waitForNotifications(1.0):
            # handleNotification() was called
            continue
        print("Waiting...")  # Timeout occurred, no notifications received

finally:
    p.disconnect()