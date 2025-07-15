#Posting to task that is received from the server
# Need to inform task is in progress and post the task to the server
# Now we will post the task to the server using the Task_ID and Drone_ID received from the server

import requests

# Define the endpoint and headers
TASK_ENDPOINT = "https://skytimages.pagekite.me/task/"  # Replace with your actual endpoint
AUTH_TOKEN = "z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4"  # Replace with your actual token


headers = {
    "Authorization": f"Bearer {AUTH_TOKEN}"
}

# Function to post the task
def accepting_task(task_id):
    payload = {
        "status": "InProgress"
    }
    
    try:
        response = requests.post(TASK_ENDPOINT + str(task_id), json=payload, headers=headers)
        
        if response.status_code == 200:
            print("Task posted successfully:", response.json())
        else:
            print(f"Failed to post task. Status code: {response.status_code}")
            print("Response content:", response.text)
    
    except requests.RequestException as e:
        print("Failed to connect to the server:", e)

#Inform the server that the task is completed
def complete_task(task_id):
    payload = {
        "status": "Completed"
    }
    
    try:
        response = requests.post(TASK_ENDPOINT + str(task_id), json=payload, headers=headers)
        
        if response.status_code == 200:
            print("Task completed successfully:", response.json())
        else:
            print(f"Failed to complete task. Status code: {response.status_code}")
            print("Response content:", response.text)
    
    except requests.RequestException as e:
        print("Failed to connect to the server:", e)


# Example usage
if __name__ == "__main__":
    # Example Task_ID and Drone_ID
    Task_ID = 2  # Replace with actual Task_ID
    Drone_ID = 14  # Replace with actual Drone_ID
    
    #accepting_task(Task_ID)
    complete_task(Task_ID)