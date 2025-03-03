import serial
import os

def save_image_chunk(data, packet_number, image_data):
    while len(image_data) <= packet_number:
        image_data.append(None)
    image_data[packet_number] = data

def reassemble_image(serial_port, output_image_file):
    ser = serial.Serial(serial_port, 115200)  # Adjust COM port and baud rate
    print("Waiting for data...")

    image_data = []
    try:
        while True:
            if ser.in_waiting >= 4:  # Ensure at least 4 bytes (packet number)
                packet = ser.read(4)
                packet_number = int.from_bytes(packet, 'big')

                print(f"Received packet {packet_number}")

                chunk = ser.read(250)  # Read image chunk

                if chunk:
                    save_image_chunk(chunk, packet_number, image_data)

                if None not in image_data:  # Stop when all packets arrive
                    print("Image complete!")
                    break
    except KeyboardInterrupt:
        print("Interrupted.")

    with open(output_image_file, 'wb') as img_file:
        for chunk in image_data:
            img_file.write(chunk)

    print(f"Saved image as {output_image_file}")

if __name__ == '__main__':
    serial_port = 'COM13'  # Change to correct port (e.g., 'COM4', '/dev/ttyUSB0')
    output_image_file = 'received_image.jpg'

    reassemble_image(serial_port, output_image_file)
