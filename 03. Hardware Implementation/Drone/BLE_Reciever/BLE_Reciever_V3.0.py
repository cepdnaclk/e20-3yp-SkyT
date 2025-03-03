"""
Created by Bimsara Gawesh
Last update on 03 March 2025
Reciever for BLE communication
This is currenty support for the one way communication between two devices (ESP32 and Raspi Zero W)
Version 3.0

Key Parameters:
Module Name: Built-in Bluetooth Module
Compatible OS: Raspberry Pi Bustter 2020
Compatible Python Version: Python 3
Prerequisites: bluepy

Note: Please reffer github repository for more information 
https://github.com/cepdnaclk/e20-3yp-SkyT
"""

# Import bluepy
from bluepy.btle import DefaultDelegate, Peripheral, UUID

class BLEClient:
    def __init__(self, address):
        self.address = address
        self.received_data = None
        self.peripheral = None
        self.delegate = None

    class MyDelegate(DefaultDelegate):
        def __init__(self, outer):
            DefaultDelegate.__init__(self)
            self.outer = outer

        # This method is called when a notification is received
        def handleNotification(self, cHandle, data):
            self.outer.received_data = data  # Store the received data
            print(f"Received data: {list(data)}")  # Print the received byte array as a list of integers

    def connect(self):
        """Connect to the BLE device and enable notifications."""
        print(f"Connecting to {self.address}...")
        self.peripheral = Peripheral(self.address)
        self.delegate = self.MyDelegate(self)
        self.peripheral.setDelegate(self.delegate)

        # Get the service and characteristic
        service_uuid = UUID("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
        char_uuid = UUID("beb5483e-36e1-4688-b7f5-ea07361b26a8")

        service = self.peripheral.getServiceByUUID(service_uuid)
        characteristic = service.getCharacteristics(char_uuid)[0]

        # Enable notifications
        print("Enabling notifications...")
        cccd_handle = characteristic.getHandle() + 1  # CCCD handle is usually +1 from the characteristic handle
        self.peripheral.writeCharacteristic(cccd_handle, b"\x01\x00", withResponse=True)  # Enable notifications

    def get_received_data(self):
        """Return the received data as a byte array."""
        return self.received_data

    def wait_for_notifications(self, timeout=1.0):
        """Wait for notifications."""
        if self.peripheral.waitForNotifications(timeout):
            return True
        return False

    def disconnect(self):
        """Disconnect from the BLE device."""
        if self.peripheral:
            self.peripheral.disconnect()
            print("Disconnected from the BLE device.")