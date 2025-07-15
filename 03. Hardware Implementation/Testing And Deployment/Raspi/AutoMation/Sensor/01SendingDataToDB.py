# Read the current state of a characteristic on a BLE device

import asyncio
from bleak import BleakClient

async def main():
    ble_address = 'E0:5A:1B:75:C5:96'
    characteristic_uuid = 'beb5483e-36e1-4688-b7f5-ea07361b26a8'

    async with BleakClient(ble_address) as client:
        data = await client.read_gatt_char(characteristic_uuid)
        print(data)
        #print(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9], data[10] , data[11], data[12], data[13], data[14], data[15], data[16], data[17], data[18], data[19], data[20], data[21])
        #print(data[0],data[1],data[2],data[3],data[4],data[5],data[6],data[7],data[8],data[9], data[10], data[11])
        #print("data =", data[48])
        print(data[10],data[11])
asyncio.run(main())
