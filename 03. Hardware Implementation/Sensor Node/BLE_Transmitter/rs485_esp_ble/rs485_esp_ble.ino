#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <DHT.h>

// Pin definitions
#define RE_DE 4     // RS485 Direction control pin
#define RX_PIN 16   // ESP32 RX2 pin
#define TX_PIN 17   // ESP32 TX2 pin
#define DHT_PIN 5  // DHT11 data pin
#define DHT_TYPE DHT11  // Define the DHT sensor type

// Modbus frame to read 7 registers starting from address 0x0000
byte readData[] = {0x01, 0x03, 0x00, 0x00, 0x00, 0x07, 0x04, 0x08};
byte receivedData[20];
byte transmitData[12];

// BLE related variables
BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
BLECharacteristic* qCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;
uint32_t value = 0;

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/
#define SERVICE_UUID        "PUT_YOUR_SERVICE_UUID"
#define CHARACTERISTIC_UUID "PUT_YOUR_CHARACTERISTIC_UUID"

HardwareSerial sensorSerial(2); // UART2
DHT dht(DHT_PIN, DHT_TYPE);

class MyServerCallbacks: public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("Device connected");
  };

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("Device disconnected");
    pServer->getAdvertising()->start();
  }
};

void setup() {
  // Start serial communications
  Serial.begin(115200);     // Main serial for debug output on USB
  sensorSerial.begin(4800, SERIAL_8N1, RX_PIN, TX_PIN); // Default sensor baud rate
  
  // Initialize DHT sensor
  dht.begin();
  
  // Configure RE_DE pin for direction control
  pinMode(RE_DE, OUTPUT);
  digitalWrite(RE_DE, LOW);  // Set to receive mode initially
  
  Serial.println("ESP32 Soil Sensor Reader Started");
  Serial.println("----------------------------------");

  // Initialize BLE
  BLEDevice::init("Soil Sensor");
  
  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create the BLE Characteristic for sensor data
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  // Add descriptors
  pCharacteristic->addDescriptor(new BLE2902());

  // Start the service
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  
  Serial.println("BLE initialized, waiting for connections...");
}

void loop() {
  //Read sensor data
  readSensorData();
  
  //Transmit data via BLE if connected
  if (deviceConnected) {
    // Send sensor data through the first characteristic
    pCharacteristic->setValue(transmitData, 12);
    pCharacteristic->notify();
    Serial.println("Soil sensor data transmitted via BLE");
  }
  
  // Handle BLE connection changes
  if (!deviceConnected && oldDeviceConnected) {
    delay(500); // Give the Bluetooth stack time to get ready
    pServer->startAdvertising(); // Restart advertising
    Serial.println("Started advertising");
    oldDeviceConnected = deviceConnected;
  }
  
  if (deviceConnected && !oldDeviceConnected) {
    // Handle new connection
    oldDeviceConnected = deviceConnected;
  }
  
  delay(5000);  // Wait 5 seconds before next reading
}

void readSensorData() {
  // Read DHT11 humidity
  float dhtHumidity = dht.readHumidity();
  float dhtTemperature = dht.readTemperature();
  
  // Send read command
  digitalWrite(RE_DE, HIGH);  // Set to transmit mode
  delay(10);
  
  Serial.println("\nSending command bytes:");
  for(byte i = 0; i < 8; i++) {
    sensorSerial.write(readData[i]);
    Serial.print("0x");
    Serial.print(readData[i], HEX);
    Serial.print(" ");
  }
  Serial.println();
  
  sensorSerial.flush();
  digitalWrite(RE_DE, LOW);  // Set back to receive mode
  delay(100);  // Wait for response
  
  // Read response
  byte index = 0;
  Serial.println("Received bytes:");
  
  unsigned long startTime = millis();
  while((millis() - startTime < 1000) && (index < 20)) {  // Timeout after 1 second
    if(sensorSerial.available()) {
      receivedData[index] = sensorSerial.read();
      Serial.print("0x");
      Serial.print(receivedData[index], HEX);
      Serial.print(" ");
      index++;
    }
  }
  
  Serial.println();
  Serial.print("Bytes received: ");
  Serial.println(index);
    
  // Process and print the data if we received a valid response
  if(receivedData[0] == 0x01) {
    // Calculate values from received data
    
    float humidity = (receivedData[3] << 8 | receivedData[4]) * 0.1;
    float temperature = (receivedData[5] << 8 | receivedData[6]) * 0.1;
    int conductivity = (receivedData[7] << 8 | receivedData[8]);
    float ph = (receivedData[9] << 8 | receivedData[10]) * 0.1;
    int nitrogen = (receivedData[11] << 8 | receivedData[12]);
    int phosphorus = (receivedData[13] << 8 | receivedData[14]);
    int potassium = (receivedData[15] << 8 | receivedData[16]);
    int dhtTemperatureInt = (int)(dhtTemperature * 10);
    // Copy raw data to transmitData array for BLE transmission
    
    transmitData[0] = (dhtTemperatureInt >> 8) & 0xFF;  // DHT Temperature MSB
    transmitData[1] = dhtTemperatureInt & 0xFF;         // DHT Temperature LSB
    transmitData[2] = receivedData[9];  // pH MSB
    transmitData[3] = receivedData[10]; // pH LSB
    transmitData[4] = receivedData[11]; // Nitrogen MSB
    transmitData[5] = receivedData[12]; // Nitrogen LSB
    transmitData[6] = receivedData[13]; // Phosphorus MSB
    transmitData[7] = receivedData[14]; // Phosphorus LSB
    transmitData[8] = receivedData[15]; // Potassium MSB
    transmitData[9] = receivedData[16]; // Potassium LSB
    
    // Add DHT11 humidity to transmitData (converting to 16-bit integer)
    int dhtHumidityInt = (int)(dhtHumidity * 10);
    transmitData[10] = (dhtHumidityInt >> 8) & 0xFF; // DHT Humidity MSB
    transmitData[11] = dhtHumidityInt & 0xFF;        // DHT Humidity LSB
    
    // Print values to serial monitor
    Serial.println("\n--- Soil Sensor Readings ---");
    Serial.print("Temperature: "); Serial.print(dhtTemperature); Serial.println(" °C");
    Serial.print("Humidity (Modbus): "); Serial.print(humidity); Serial.println(" %RH");
    Serial.print("DHT11 Humidity: "); Serial.print(dhtHumidity); Serial.println(" %RH");
    Serial.print("Conductivity: "); Serial.print(conductivity); Serial.println(" us/cm");
    Serial.print("pH: "); Serial.println(ph);
    Serial.print("Nitrogen: "); Serial.print(nitrogen); Serial.println(" mg/kg");
    Serial.print("Phosphorus: "); Serial.print(phosphorus); Serial.println(" mg/kg");
    Serial.print("Potassium: "); Serial.print(potassium); Serial.println(" mg/kg");
  } else {
   Serial.println("Error: Invalid response or no data received");
  }
}
