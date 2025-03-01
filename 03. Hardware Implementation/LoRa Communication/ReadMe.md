# Raspberry Pi LoRa Project Setup Guide

This guide provides step-by-step instructions for setting up a Raspberry Pi with LoRa capabilities.

Last update: 2025 March 01

## Prerequisites

- Raspberry Pi board (Zero, Zero W, Zero WH, Zero 2W, ... , 4B+)
- LoRa module (SX1278 LoRa-02 433MHz)
- Raspberry Pi Buster 2020 OS image
- Jumpers
- Basic tool kit

## Installation Steps

### Step 1: Choosing the Right Raspberry Pi OS

The current implementation works specifically with **Raspberry Pi Buster 2020 OS**. Newer OS versions like Bookworm have been tested but aren't compatible with the required `RPi.GPIO` library needed for LoRa functionality.

> **Note:** `RPi.GPIO` is a required dependency for the LoRa library used in this project.

### Step 2: Checking avalabilty of the required Libraries

Since we're using Raspberry Pi Buster 2020, we can check all installed packages directly using pip3:

```bash
# Check availability of the SPI device library
pip3 show spidev

# Check availability of the RPi.GPIO library
pip3 show RPi.GPIO
```

> **Note:** We can check all installed libraries by using the `pip3 list` command.

### Step 3: Installing Required Libraries

Since we're using Raspberry Pi Buster 2020, we can install all packages directly using pip3:

```bash
# Install SPI device library (if it is not installed)
sudo pip3 install spidev

# Install RPi.GPIO library (if it is not installed)
sudo pip3 install RPi.GPIO

# Install LoRa library
sudo pip3 install adafruit-circuitpython-rfm9x
```

> **Important:** Always use `pip3` instead of `pip` because Buster OS comes with both Python 2 and Python 3 installed by default.

### Step 4: Hardware Connection

Connect your LoRa module to the Raspberry Pi's SPI interface:

| LoRa Pin | Raspberry Pi Pin |
| -------- | ---------------- |
| VCC      | 3.3V             |
| GND      | GND              |
| MISO     | GPIO 9 (MISO)    |
| MOSI     | GPIO 10 (MOSI)   |
| SCK      | GPIO 11 (SCLK)   |
| NSS      | GPIO 8 (CE0)     |
| RESET    | GPIO 22          |
| DIO0     | GPIO 0           |

### Step 5: Enabling SPI Interface

Enable the SPI interface on your Raspberry Pi:

1. Run `sudo raspi-config`
2. Navigate to "Interface Options"
3. Select "SPI"
4. Choose "Yes" to enable the SPI interface
5. Select "Finish" and reboot your Raspberry Pi

> **Note:** You can use `sudo reboot now` command to reboot your Raspberry Pi Board

### Step 6: Testing Your Setup

To verify your LoRa module is working correctly, run the tests in the `Testing` directory.

## Troubleshooting

If you encounter any issues:

- Make sure SPI is enabled in raspi-config
- Check your wiring connections
- Verify you're using Raspberry Pi Buster 2020 OS
- Ensure all libraries are installed using pip3

## Further Documentation

For more detailed information about the LoRa library and its API, refer to the documentation for the used library `https://github.com/adafruit/Adafruit_CircuitPython_RFM9x`.
