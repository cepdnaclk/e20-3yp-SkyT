#include <Arduino.h>
//2.0
//Import wifi library - blocking method
//#include <WiFiMulti.h>
//2.0

//3.0 - Import wifi library - non-blocking method
//Core wifi library
#include <WiFi.h>
//3.0




//Constants for wifi
#define WIFI_SSID "Nokia 7.2"
#define WIFI_PASS "blablabla"

//2.0 - wifi blocking method
//Define wifi object - This is C++ not C
//WiFiMulti wifiMulti;
//2.0

// put function declarations here:
int myFunction(int, int);

void setup() {
  // put your setup code here, to run once:

  //1.0 - Initial setting up to configure an turn on LED

  //Accessing pins
  pinMode(2, OUTPUT);

  // initialize serial communication at 921600 bits per second:
  Serial.begin(921600);
  Serial.println("Hello from setup!");

  //1.0




  //2.0 - Connecting to wifi bloicking method

  //Creating access point to wifi
  //Here we dan have multiple wifi access points
  //If one fails, it will try the next one
  //wifiMulti.addAP(WIFI_SSID, WIFI_PASS);

  // Connecting to wifi
  //This will keep trying to connect to wifi until it is connected
  //If wifi gets disconnected, it will try to reconnect
  // while(wifiMulti.run() != WL_CONNECTED){
  //   delay(1000);
  //   Serial.println("Connecting to wifi...");
  // }

  // Serial.println("Connected to wifi!");

  //2.0

  //3.0 - Connecting to wifi non-blocking method
  //Connecting to wifi
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  Serial.println("Startting");

}

//3.0
bool isConnected = false;

void loop() {

  //1.Initial settin up to configure an turun on LED
  // put your main code here, to run repeatedly:
  //delay(1000);
  //Setting up LED pin to high
  //digitalWrite(2, HIGH);
  //Serial.println("Hello from loop!");
  //delay(1000);
  //Setting up LED pin to low
  //digitalWrite(2, LOW);


  //2. Connecting to wifi
  //digitalWrite(2, WiFi.status() == WL_CONNECTED);
  //2.0

  //3.0 - Connecting to wifi non-blocking method

  //Checking if wifi is connected
  if(WiFi.status() == WL_CONNECTED & !isConnected){
    Serial.println("Connected to wifi!");
    digitalWrite(2, HIGH);
    isConnected = true;
  } 

  if(WiFi.status() != WL_CONNECTED ){
    Serial.println("Disconnected from wifi!");
    digitalWrite(2, !digitalRead(2));
    delay(1000);
    isConnected = false;

  }

  //3.0


}

// put function definitions here:
int myFunction(int x, int y) {
  return x + y;
}