import requests

TASK_ENDPOINT = "http://skytimages.pagekite.me/task/14"
AUTH_TOKEN = "z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4"  # Replace with your actual token

#emty intiger variable for Task_ID 
Task_ID = 0
#emty intiger variable for Drone_ID
Drone_ID = 0 


headers = {
    "Authorization": f"Bearer {AUTH_TOKEN}"
}

# try:
#     response = requests.get(TASK_ENDPOINT, headers=headers)

#     if response.status_code == 200:
#         task = response.json()
#         print("Received task:", task)
#         print("Task ID:", task.get("taskId"))
#         print("Drone ID:", task.get("droneId"))
#         Task_ID = task.get("taskId", 0)
#         Drone_ID = task.get("droneId", 0)

#     elif response.status_code == 404:
#         print("No task available right now.")
#     else:
#         print(f"Unexpected status code: {response.status_code}")
#         print("Response content:", response.text)

# except requests.RequestException as e:
#     print("Failed to connect to the server:", e)




#Define a function to get the task - in that task assign the Task_ID and Drone_ID - No need to add header since they are common global variable
def get_task():
    global Task_ID, Drone_ID

    try:
        response = requests.get(TASK_ENDPOINT, headers=headers)
    except requests.RequestException as e:
        print("Failed to connect to the server:", e)
        

    if response.status_code == 200:
        task = response.json()
        print("Received task:", task)
        Task_ID = task.get("taskId", 0)
        Drone_ID = task.get("droneId", 0)
        print("Task ID:", Task_ID)
        print("Drone ID:", Drone_ID)

    elif response.status_code == 404:
        print("No task available right now.")

    else:
        print(f"Unexpected status code: {response.status_code}")
        print("Response content:", response.text)


# Call the function to get the task
get_task()

