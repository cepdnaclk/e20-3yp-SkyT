import serial
import time

# Configure these based on your setup
COM_PORT = "COM13"  # Change to your ESP32's COM port
BAUD_RATE = 9600   # Matches Serial.begin(9600)
OUTPUT_FILE = "payload.txt"

# Open serial connection
ser = serial.Serial(COM_PORT, BAUD_RATE, timeout=1)
print(f"Connected to {COM_PORT}. Logging data to {OUTPUT_FILE}...")

# Open file for writing
with open(OUTPUT_FILE, "w") as file:
    try:
        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode("utf-8").strip()
                if line.startswith("PKT:"):  # Only save payload lines
                    print(line)  # Optional: Display on console
                    file.write(line + "\n")
                    file.flush()  # Ensure data is written immediately
            time.sleep(0.1)  # Small delay to avoid CPU overload
    except KeyboardInterrupt:
        print("Stopped by user.")
    finally:
        ser.close()
        print("Serial connection closed.")

print(f"Data saved to {OUTPUT_FILE}")