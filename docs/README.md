---
layout: home
permalink: index.html

# Please update this with your repository name and project title
repository-name: e20-3yp-SkyT
title: SkyT
---

[comment]: # "This is the standard layout for the project, but you can clean this and use your own template"

# SkyT - Drone Based Crop Management System

---
## Product Introduction
[![Video Title](https://img.youtube.com/vi/4Rkz7F0_JOQ/0.jpg)](https://youtu.be/4Rkz7F0_JOQ)

## Team
-  e20032, Bandara A.M.N.C.
-  e20034, Bandara G.M.M.R.
-  e20157, Janakatha S.M.B.G.
-  e20173, Jayasooriya P.A.S.V.


<!-- Image (photo/drawing of the final hardware) should be here -->

<!-- This is a sample image, to show how to add images to your page. To learn more options, please refer [this](https://projects.ce.pdn.ac.lk/docs/faq/how-to-add-an-image/) -->

<!-- ![Sample Image](./images/sample.png) -->

#### Table of Contents
1. [Introduction](#introduction)
2. [Solution Architecture](#solution-architecture )
3. [Hardware & Software Designs](#hardware-and-software-designs)
4. [Testing](#testing)
5. [Detailed budget](#detailed-budget)
6. [Conclusion](#conclusion)
7. [Links](#links)

## Introduction

Tea plantation management faces significant challenges due to inefficient monitoring of vast tea lots, leading to suboptimal crop health and reduced yields. **Sky T**, a smart drone-based crop management system, addresses these challenges by introducing a real-time monitoring system for tea plantations. This system leverages advanced IoT devices to track ***soil quality, temperature, and humidity***, ensuring optimal growing conditions. **Drones** play a crucial role by *capturing high-resolution images* and *collecting sensor data* from designated nodes, enabling real-time field monitoring. This allows for the early detection of potential issues, improving decision-making and enhancing overall plantation productivity. By integrating smart technologies, Sky T offers a data-driven approach to revolutionizing tea plantation management.


## Solution Architecture
Our solution architecture comprises both IoT devices and a cloud-based web application. The high-level overview of the system, as depicted in the accompanying diagram, consists of the following key components

1. Sensor Node 
2. Drone
3. Docking station
4. Cloud backend
5. Web dashboard
   
### 1.Sensor Node
The sensor node is a compact environmental monitoring unit installed within a designated tea plantation area, typically covering a perimeter of approximately 500 meters. This unit is designed to collect essential soil and atmospheric data, including pH levels, nutrient content (NPK), temperature, and humidity.

The sensor node operates on either solar power or a rechargeable battery, depending on its location. It remains in a low-power state and is activated only upon receiving a triggering signal from the drone via Bluetooth Low Energy (BLE) communication.

**Hardware Components**
1. *ESP32 Microcontroller* – Handles data acquisition and wireless communication.
2. *RS485 NPK Sensor* – Measures nitrogen (N), phosphorus (P), and potassium (K) levels in the soil.
3. *AHT10 Humidity Sensor* – Monitors temperature and humidity conditions.
## Hardware and Software Designs

### Software Design
Our software solution is a web-based dashboard built using the following technology stack

1. Front End - React + Bootstrap
2. Back End - Typescript
3. Database - Mongo DB, MySQL
4. Cloud Service Provider - AWS

#### Front End Designs
To ensure a seamless user experience that balances simplicity, ease of use, and professionalism, we have developed a fully customizable dashboard with dynamic role-based access control. The system includes secure login and signup validation, adapting the interface dynamically based on the user’s role to enhance usability. Additionally, the design has undergone UI/UX testing, focusing on learnability, usability, and overall user experience, ensuring an intuitive and efficient platform for users.

## Testing

Testing done on hardware and software, detailed + summarized results

## Detailed budget

All items and costs

| Item          | Quantity  | Unit Cost  | Total  |
| ------------- |:---------:|:----------:|-------:|
| NodeMCU       | 2         | 2000 LKR | 4000 LKR |
| RS508 Soil Sensor | 1 | 11000 LKR | 11000 LKR |
| DHT 11 Humidity Sensor | 1 | 400 LKR | 400 LKR |
| 3300mAh Li-Po Battery | 2 | 3300 LKR | 6600 LKR |
| Drone | 1 | 30000 LKR | 30000 LKR | 
| Raspberry Pi Zero | 1 | 3500 LKR | 3500 LKR |
| 5MP Raspi Camera Module | 1 | 2500 LKR | 2500 LKR |
| RA02 Lora Module | 2 | 3000 LKR | 6000 LKR |
| 32GB Storage Device | 2 | 1790 LKR | 3580 LKR |
| 4G Dongle | 1 | 3690 LKR | 3690 LKR |
| Miscellaneous | N/A | N/A | 3000 LKR |
| **SUB TOTAL** | **14** | **N/A** | **74270 LKR** |


## Conclusion
Sky T has successfully reached the proof-of-concept stage, marking a significant milestone before full-scale product development. The complete data path from collecting sensor data and capturing images using a manually flown drone to processing and visualizing the information on a web dashboard has been fully implemented. This achievement validates the system’s feasibility and lays a strong foundation for further enhancements, including automation and scalability. With this progress, Sky T is now poised for the next phase of development, bringing smart, data-driven solutions to tea plantation management.

## Links

- [Project Repository](https://github.com/cepdnaclk/e20-3yp-SkyT)
- [Project Page](https://cepdnaclk.github.io/e20-3yp-SkyT/)
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)

[//]: # (Please refer this to learn more about Markdown syntax)
[//]: # (https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
