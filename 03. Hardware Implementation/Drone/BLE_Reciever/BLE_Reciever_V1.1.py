from bluepy.btle import Scanner, DefaultDelegate, Peripheral, UUID

class ScanDelegate(DefaultDelegate):
    def __init__(self):
        DefaultDelegate.__init__(self)

    def handleNotification(self, cHandle, data):
        print(f"Received data: {list(data)}")

# Replace with your ESP32's BLE address
esp32_address = "78:21:84:88:58:a6"

print(f"Connecting to {esp32_address}...")
p = Peripheral(esp32_address)

try:
    # Enable notifications
    service_uuid = UUID("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
    char_uuid = UUID("beb5483e-36e1-4688-b7f5-ea07361b26a8")

    service = p.getServiceByUUID(service_uuid)
    characteristic = service.getCharacteristics(char_uuid)[0]

    # Setup to receive notifications
    p.setDelegate(ScanDelegate())
    characteristic.write(b"\x01\x00", withResponse=True)  # Enable notifications

    print("Waiting for data...")
    while True:
        if p.waitForNotifications(1.0):
            continue
        print("Waiting...")

finally:
    p.disconnect()