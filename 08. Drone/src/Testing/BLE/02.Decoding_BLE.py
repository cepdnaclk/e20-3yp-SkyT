import struct
# Read the current state of a characteristic on a BLE device
import asyncio
from bleak import BleakClient


def decode_soil_sensor_data(transmit_data):

    # Ensure input is bytes
    if not isinstance(transmit_data, bytes):
        transmit_data = bytes(transmit_data)
    
    # Check if the data length is correct
    if len(transmit_data) != 12:
        raise ValueError("Transmit data must be 12 bytes long")
    
    # Decode temperature (2 bytes)
    temperature = struct.unpack('>h', transmit_data[0:2])[0] / 10.0
    
    # Decode pH (2 bytes)
    ph = struct.unpack('>h', transmit_data[2:4])[0] / 10.0
    
    # Decode Nitrogen (2 bytes)
    nitrogen = struct.unpack('>H', transmit_data[4:6])[0]
    
    # Decode Phosphorus (2 bytes)
    phosphorus = struct.unpack('>H', transmit_data[6:8])[0]
    
    # Decode Potassium (2 bytes)
    potassium = struct.unpack('>H', transmit_data[8:10])[0]
    
    # Decode DHT11 Humidity (2 bytes)
    dht_humidity = struct.unpack('>h', transmit_data[10:12])[0]*0.1
    
    # Return decoded values as a dictionary
    return {
        'Temperature °C': temperature,
        'pH': ph,
        'Nitrogen (mg/kg)': nitrogen,
        'Phosphorus (mg/kg)': phosphorus,
        'Potassium (mg/kg)': potassium,
        'Air Humidity (Relative Humidity %)': dht_humidity
    }

# Example
example_transmit_data = [
        0x1, 0x10,   # Temperature: 27.2°C
        0x00, 0x28,   # pH: 4.0
        0x00, 0x55,   # Nitrogen: 85 mg/kg
        0x00, 0xF4,   # Phosphorus: 244 mg/kg
        0x00, 0xEE,   # Potassium: 238 mg/kg
        0x00, 0x0A    # DHT Relative Humidity: 10.0%
]
    
# Decode the data
#sensor_data = decode_soil_sensor_data(example_transmit_data)
#for key, value in sensor_data.items():
            #print(f"{key}: {value}")
            

        
async def main():
    ble_address = 'E0:5A:1B:75:C5:96'
    characteristic_uuid = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'
	
    async with BleakClient(ble_address) as client:
        data = await client.read_gatt_char(characteristic_uuid)
        print(data)
        #print(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9], data[10] , data[11], data[12], data[13], data[14], data[15], data[16], data[17], data[18], data[19], data[20], data[21])
        #print(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9], data[10], data[11])
        #print("data =", data[48])
        print(data[0])
        decoded_data = decode_soil_sensor_data (data)
        
        print(decoded_data)
        
        
asyncio.run(main())

