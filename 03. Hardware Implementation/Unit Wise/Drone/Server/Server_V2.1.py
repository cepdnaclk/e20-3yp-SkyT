"""
Created by Bimsara Gawesh
Last update on 02 March 2025
Server for LoRa communication
This module requires a Sender for the communication
This is currenty support for the one way communication between two devices
Work for Sender_V2.3 and newer
Version 2.1
"""

# Import Python System Libraries
import numpy as np

# Import Sender
from Sender import sendStrings, sendByteArray, sendLargeData, sendImage

# Dummy data set
count = 0

byteData = bytes([0x01, 0x02, 0x03, 0x04])

stringData = "Hello World"

Large_String = """**The Importance of Computers in Modern Society**  

Computers have become an essential part of modern life, transforming the way we work, communicate, and access information. From personal use to large-scale industries, computers play a crucial role in various aspects of our daily activities. They have revolutionized education, business, healthcare, and entertainment, making tasks more efficient and accessible. As technology continues to evolve, computers are becoming even more powerful, influencing every sector of society.  

One of the most significant impacts of computers is in the field of education. With the advent of digital learning, students can now access a wealth of information at their fingertips. Online courses, e-books, and educational videos provide opportunities for people worldwide to learn new skills without attending traditional classrooms. Additionally, computers help educators create engaging content, automate administrative tasks, and conduct virtual classes, making education more interactive and efficient.  

In business, computers have streamlined operations, increasing productivity and efficiency. Companies rely on computers for data management, communication, marketing, and financial transactions. With the rise of e-commerce, businesses can reach a global audience, allowing customers to purchase products and services online. Computer software also helps companies analyze market trends, manage supply chains, and improve customer service. As a result, businesses can operate more effectively and compete in a rapidly evolving marketplace.  

Healthcare has also greatly benefited from the advancements in computer technology. Medical professionals use computers for diagnosing diseases, managing patient records, and conducting research. Hospitals and clinics rely on specialized software to track patient histories, schedule appointments, and store critical medical data. Moreover, cutting-edge technologies such as artificial intelligence and machine learning are assisting in the development of new treatments, improving the accuracy of medical diagnoses, and even predicting potential health risks. Telemedicine, made possible by computers and the internet, enables doctors to consult with patients remotely, increasing access to healthcare services.  

Computers have also revolutionized communication, allowing people to connect instantly across the globe. Social media platforms, emails, and video conferencing have made it easier for individuals and businesses to stay connected. The internet, powered by computers, has created a digital world where people can share ideas, collaborate on projects, and engage in discussions regardless of their geographical location. This has not only strengthened personal relationships but has also enhanced professional networking, enabling businesses and organizations to work together efficiently.  

Entertainment has seen a significant transformation with the advent of computers. From streaming services and video games to digital art and music production, computers provide endless possibilities for creative expression. High-quality graphics, virtual reality, and artificial intelligence have pushed the boundaries of what is possible in gaming and film production. Additionally, content creators use computers to edit videos, compose music, and develop software applications, shaping the future of entertainment and digital media.  

Despite their numerous benefits, computers also pose challenges, such as cybersecurity threats, data privacy concerns, and digital addiction. Hackers and cybercriminals exploit vulnerabilities to steal sensitive information, leading to financial losses and privacy breaches. To address these issues, cybersecurity measures, including firewalls, encryption, and antivirus software, are essential to protect personal and organizational data. Furthermore, excessive screen time can lead to health issues, such as eye strain and decreased physical activity, highlighting the importance of balanced computer usage.  

In conclusion, computers have become an indispensable part of modern society, impacting education, business, healthcare, communication, and entertainment. Their ability to process vast amounts of information quickly and efficiently has made life more convenient and productive. While computers present challenges, proper usage and security measures can mitigate risks. As technology continues to advance, computers will play an even greater role in shaping the future, making them one of the most important inventions in human history.
"""

Image_Array = np.array([
    [0, 50, 100, 150, 200, 250, 200, 150],
    [50, 100, 150, 200, 250, 200, 150, 100],
    [100, 150, 200, 250, 200, 150, 100, 50],
    [150, 200, 250, 200, 150, 100, 50, 0],
    [200, 250, 200, 150, 100, 50, 0, 50],
    [250, 200, 150, 100, 50, 0, 50, 100],
    [200, 150, 100, 50, 0, 50, 100, 150],
    [150, 100, 50, 0, 50, 100, 150, 200]
], dtype=np.uint8)

# Serialize the image array into bytes
image_bytes = Image.tobytes()



# Server Code
try:
    print("LoRa Server Started...")
    # Example counter data sending
    #sendStrings(count)
    #count = 0 if count >= 99 else count + 1

    # Example byte array        
    #sendByteArray(byteData)  # Send data with a 1-second delay

    # Example data to send        
    #sendStrings(stringData)  # Send data with a 1-second delay
        
    # Send the large dataset - String
    #senderID = "DronePi"
    #sendLargeData(Large_String, senderID)

    # Send the large dataset - Image
    #while True:
    #    sendImage(Image_Array)
        
        
except KeyboardInterrupt:
    print("\nProgram interrupted")
finally:
    # Clean up
    print("GPIO cleaned up and program terminated.")