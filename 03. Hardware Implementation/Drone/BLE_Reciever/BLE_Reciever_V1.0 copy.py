from bluepy.btle import Scanner, DefaultDelegate, Peripheral, UUID

class ScanDelegate(DefaultDelegate):
    def __init__(self):
        DefaultDelegate.__init__(self)

    def handleDiscovery(self, dev, isNewDev, isNewData):
        if isNewDev:
            print(f"Discovered device {dev.addr}")
        elif isNewData:
            print(f"Received new data from {dev.addr}")

scanner = Scanner().withDelegate(ScanDelegate())
devices = scanner.scan(10.0)

for dev in devices:
    print(f"Device {dev.addr} ({dev.addrType}), RSSI={dev.rssi} dB")
    for (adtype, desc, value) in dev.getScanData():
        print(f"  {desc} = {value}")

# Replace with your ESP32's BLE address
esp32_address = "78:21:84:88:58:a6"

print(f"Connecting to {esp32_address}...")
p = Peripheral(esp32_address)

try:
    services = p.getServices()
    for service in services:
        print(f"Service {service.uuid}")
        characteristics = service.getCharacteristics()
        for char in characteristics:
            print(f"  Characteristic {char.uuid} {char.propertiesToString()}")
            if char.supportsRead():
                print(f"    Value: {char.read()}")

    # Replace with your characteristic UUID
    char_uuid = UUID("beb5483e-36e1-4688-b7f5-ea07361b26a8")
    characteristic = p.getCharacteristics(uuid=char_uuid)[0]

    if characteristic.supportsRead():
        print(f"Characteristic value: {characteristic.read()}")

finally:
    p.disconnect()
