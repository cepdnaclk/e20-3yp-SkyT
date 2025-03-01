import spidev

spi = spidev.SpiDev()
spi.open(0, 0)  # CE0 is bus 0, device 0
spi.max_speed_hz = 5000000
try:
    data = spi.xfer2([0x42])  # Dummy read
    print(f"SPI Response: {data}")
except Exception as e:
    print(f"SPI Error: {e}")
spi.close()
