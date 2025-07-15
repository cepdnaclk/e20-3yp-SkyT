#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <DHT.h>
#include <RTClib.h>
#include <Wire.h>

// Pin definitions
#define RE_DE 4     // RS485 Direction control pin
#define RX_PIN 16   // ESP32 RX2 pin
#define TX_PIN 17   // ESP32 TX2 pin
#define DHT_PIN 5  // DHT11 data pin
#define DHT_TYPE DHT11  // Define the DHT sensor type
#define SDA_PIN 21  // I2C SDA pin for RTC
#define SCL_PIN 22  // I2C SCL pin for RTC

// Sleep schedule configuration (24-hour format)
#define SLEEP_START_HOUR 21    // 8 PM (20:00)
#define SLEEP_START_MINUTE 0   // 0 minutes
#define WAKE_UP_HOUR 5         // 5 AM (05:00)
#define WAKE_UP_MINUTE 0       // 0 minutes

#define MEASUREMENT_INTERVAL 3000  // 3 seconds
#define BLE_POWER_LEVEL ESP_PWR_LVL_P6  // Reduce BLE power to 0dBm

// Modbus frame to read 7 registers starting from address 0x0000
byte readData[] = {0x01, 0x03, 0x00, 0x00, 0x00, 0x07, 0x04, 0x08};
byte receivedData[20];
byte transmitData[12];

// BLE related variables
BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

#define SERVICE_UUID        "YOUR_SERVICE_UUID"
#define CHARACTERISTIC_UUID "YOUR_CHARACTERISTIC_UUID"

HardwareSerial sensorSerial(2); // UART2
DHT dht(DHT_PIN, DHT_TYPE);  // Initialize DHT sensor
RTC_DS1307 rtc;              // Initialize RTC

bool isInSleepTime = false;

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

  // Initialize I2C for RTC
  Wire.begin(SDA_PIN, SCL_PIN);
  
  // Initialize RTC
  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    Serial.flush();
    while (1) delay(10);
  }

  if (! rtc.isrunning()) {
    Serial.println("RTC is NOT running, setting the time...");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }

  // Initialize DHT sensor
  dht.begin();
  
  // Configure RE_DE pin for direction control
  pinMode(RE_DE, OUTPUT);
  digitalWrite(RE_DE, LOW);  // Set to receive mode initially

  setCpuFrequencyMhz(80); // Set CPU frequency to 80MHz
  
  Serial.println("ESP32 Soil Sensor Reader Started");
  Serial.println("----------------------------------");

  // Initialize BLE
  BLEDevice::init("SkyT - NODE 56");

  // Set BLE power level to minimum for close-range communication
  esp_ble_tx_power_set(ESP_BLE_PWR_TYPE_DEFAULT, BLE_POWER_LEVEL);
  esp_ble_tx_power_set(ESP_BLE_PWR_TYPE_ADV, BLE_POWER_LEVEL);
  esp_ble_tx_power_set(ESP_BLE_PWR_TYPE_SCAN, BLE_POWER_LEVEL);
  
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
  pAdvertising->setMinPreferred(1600);  // 1 second
  pAdvertising->setMaxPreferred(3200);  // 2 seconds
  BLEDevice::startAdvertising();
  
  Serial.println("BLE initialized, waiting for connections...");
}

void loop() {
  // Check current time before each measurement
  checkSleepTime();  

  if (isInSleepTime) {
    Serial.println("Sleep time reached, entering deep sleep...");
    if (pServer) {
      pServer->getAdvertising()->stop();
    }
    BLEDevice::deinit(true);
    Serial.println("BLE deinitialized for sleep");
    enterDeepSleepUntilWakeTime();
  }

  //Read sensor data
  readSensorData();
  
  //ransmit data via BLE if connected
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

void checkSleepTime() {
  DateTime now = rtc.now();
  int currentHour = now.hour();
  int currentMinute = now.minute();
  
  // Convert current time to minutes since midnight
  int currentMinutes = currentHour * 60 + currentMinute;
  int sleepStartMinutes = SLEEP_START_HOUR * 60 + SLEEP_START_MINUTE;
  int wakeUpMinutes = WAKE_UP_HOUR * 60 + WAKE_UP_MINUTE;
  
  // Handle overnight sleep period
  if (sleepStartMinutes > wakeUpMinutes) {
    // Sleep period crosses midnight
    isInSleepTime = (currentMinutes >= sleepStartMinutes) || (currentMinutes < wakeUpMinutes);
  } else {
    // Sleep period is within the same day
    isInSleepTime = (currentMinutes >= sleepStartMinutes) && (currentMinutes < wakeUpMinutes);
  }
  
  if (isInSleepTime) {
    Serial.print("In sleep time - Current: ");
    Serial.print(currentHour);
    Serial.print(":");
    if (currentMinute < 10) Serial.print("0");
    Serial.println(currentMinute);
  }
}

void enterDeepSleepUntilWakeTime() {
  DateTime now = rtc.now();
  DateTime wakeTime;
  
  // Calculate next wake time
  if (now.hour() >= SLEEP_START_HOUR || now.hour() < WAKE_UP_HOUR) {
    // We're in the sleep period, wake up at WAKE_UP_HOUR today or tomorrow
    if (now.hour() < WAKE_UP_HOUR) {
      // Wake up today
      wakeTime = DateTime(now.year(), now.month(), now.day(), WAKE_UP_HOUR, WAKE_UP_MINUTE, 0);
    } else {
      // Wake up tomorrow
      DateTime tomorrow = now + TimeSpan(1, 0, 0, 0);
      wakeTime = DateTime(tomorrow.year(), tomorrow.month(), tomorrow.day(), WAKE_UP_HOUR, WAKE_UP_MINUTE, 0);
    }
  } else {
    // We're in active period, sleep at SLEEP_START_HOUR today
    wakeTime = DateTime(now.year(), now.month(), now.day(), SLEEP_START_HOUR, SLEEP_START_MINUTE, 0);
  }
  
  // Calculate sleep duration in seconds
  long sleepDuration = wakeTime.unixtime() - now.unixtime();
  
  // Ensure minimum sleep duration
  if (sleepDuration <= 0) {
    sleepDuration = 300; // 5 minutes minimum
  }
  
  Serial.print("Sleeping for ");
  Serial.print(sleepDuration);
  Serial.print(" seconds until ");
  
  // Power down sensors
  digitalWrite(RE_DE, LOW);
  
  // Configure wake up timer (max ~71 minutes for ESP32, so we'll use shorter intervals)
  uint64_t sleepMicroseconds = _min((long)4200000000ULL, sleepDuration * 1000000ULL); // Max ~70 minutes
  esp_sleep_enable_timer_wakeup(sleepMicroseconds);
  
  // Enter deep sleep
  Serial.println("Entering deep sleep...");
  Serial.flush();
  esp_deep_sleep_start();
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
    
    //DHT11 humidity to transmitData (converting to 16-bit integer)
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
