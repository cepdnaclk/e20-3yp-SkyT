from BLE_Reciever import BLEClient
import time

# Replace with your ESP32's BLE address
esp32_address = "78:21:84:88:58:a6"

# Replace the Client ID
clientId = "DronePi"

# Create an instance of the BLE client
ble_client = BLEClient(esp32_address)

try:
    # Connect to the BLE device
    ble_client.connect()

    # Verification
    if ble_client.verifyClient(clientId):
        print("Client verified successfully!")
        
        # Wait for notifications and print received data
        print("Waiting for notifications...")

        for i in range(10):
            if ble_client.wait_for_notifications():
                data = ble_client.get_received_data()
                if data:
                    print(f"Data returned by function: {list(data)}")  # Print the data returned by the function
            else:
                print("Waiting...")  # Timeout occurred, no notifications received
            
            time.sleep(1)  # Add a small delay to avoid busy-waiting

    else:
        print("Client verification failed.")
        ble_client.disconnect()      

except KeyboardInterrupt:
    print("Exiting...")

finally:
    # Disconnect from the BLE device
    ble_client.disconnect()