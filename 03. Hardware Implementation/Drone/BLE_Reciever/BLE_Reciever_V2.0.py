from bluepy.btle import Scanner, DefaultDelegate, Peripheral, UUID

class MyDelegate(DefaultDelegate):
    def __init__(self):
        DefaultDelegate.__init__(self)

    def handleNotification(self, cHandle, data):
        # This method is called when a notification is received
        print(f"Received data: {list(data)}")  # Print the received byte array as a list of integers

# Replace with your ESP32's BLE address
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