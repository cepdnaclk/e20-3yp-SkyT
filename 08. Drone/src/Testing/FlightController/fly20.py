import requests

TASK_ENDPOINT = "http://skytimages.pagekite.me/task/"
DRONE_STATUS_ENDPOINT = "http://skytimages.pagekite.me/drone-status"
DRONE_WARNING_ENDPOINT = "http://skytimages.pagekite.me/notifications"
AUTH_TOKEN = "z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4"  # Replace with your actual token

headers = {
    "Authorization": f"Bearer {AUTH_TOKEN}"
}



################
# Function to get the task from the server
################

#Define a function to get the task - in that task assign the Task_ID and Drone_ID - No need to add header since they are common global variable
#With this function we'll fetch all possible available tasks from the server
def get_task(Drone_ID=0):

    try:
        response = requests.get(TASK_ENDPOINT + Drone_ID, headers=headers)
    except requests.RequestException as e:
        print("Failed to connect to the server:", e)
        

    if response.status_code == 200:
        task = response.json()
        #print("Received task:", task)
        #Task_ID = task.get("taskId", 0)
        #Drone_ID = task.get("droneId", 0)
        #print("Task ID:", Task_ID)
        #print("Drone ID:", Drone_ID)

        if (len(task) == 0):
            print("No task available right now.")
            return None

        return task

    # Currently implemented using the 404 status code to indicate no task available
    elif response.status_code == 404:
        print("No task available right now.")
        return None

    else:
        print(f"Unexpected status code: {response.status_code}")
        print("Response content:", response.text)
        return None



# Function to filter out the task with the given drone ID 
def filter_task_by_drone_id(drone_id):

    task = get_task(drone_id)
    if task and task.get("droneId") == drone_id:
        return task
    else:
        print(f"No task available for Drone ID: {drone_id}")
        return None
    


################
# Function to post the task to the server
################

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





############
# Driving functions
############


# Selecting only first task available for the selected drone ID
# This function will return the first available task from the server

def get_first_available_task(Drone_ID):
    task = filter_task_by_drone_id(Drone_ID)
    if task:
        print("First available task for Drone ID:", Drone_ID)

        ##accepting the task
        ##accepting_task(task.get("taskId"))
        ##complete_task(task.get("taskId"))
        return task

    else:
        print("No tasks available for the selected Drone ID.")
        return None
    




############
#Decoding the Json to Nodes 
############

def get_nodes_from_task(drone_Id):

    try:
        task = filter_task_by_drone_id(drone_Id)
    except Exception as e:
        logging.error("Error fetching task :", e)
        print("Error fetching task:", e)
        return None

    if task:
        lot = task.get("lots")
        if lot and len(lot) > 0:
            nodes = lot[0].get("nodes")
            if nodes and len(nodes) > 0:
                task_id = task.get("taskId", 0)
                return nodes, task_id
            else:
                print("No nodes available in the lot.")
                return None
        else:
            print("No lots available in the task.")
            return None
    else:
        print("No task available for the given drone ID.")
        return None
    
    


import asyncio
import logging
from mavsdk import System
from mavsdk.offboard import VelocityNedYaw
import subprocess
import signal


#Default Task ID
Task_ID = 0
#Drone ID
Drone_ID = "14"
#Node List
Node_List= []

# Setup logging
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(message)s')

# ================================
# CONNECTION AND HEALTH CHECKS
# ================================

async def connect_drone(serial_port="/dev/ttyACM0", baudrate=57600) -> System:
    drone = System()
    await drone.connect(system_address=f"serial://{serial_port}:{baudrate}")
    logging.info("🔌 Connecting to drone...")

    async for state in drone.core.connection_state():
        if state.is_connected:
            logging.info("✅ Drone connected successfully.")
            break
    return drone

async def check_basic_health(drone: System):
    logging.info("🩺 Checking gyroscope and accelerometer health...")
    async for health in drone.telemetry.health():
        if health.is_gyrometer_calibration_ok and health.is_accelerometer_calibration_ok:
            logging.info("✅ Gyroscope and accelerometer OK.")
            break
        await asyncio.sleep(1)

async def check_gps_health(drone: System, timeout=30):
    logging.info("📡 Checking GPS and home position status...")
    start = asyncio.get_event_loop().time()
    async for health in drone.telemetry.health():
        if health.is_global_position_ok and health.is_home_position_ok:
            logging.info("✅ GPS and home position OK.")
            break
        if asyncio.get_event_loop().time() - start > timeout:
            logging.error("❌ GPS check timed out.")
            break
        await asyncio.sleep(1)


async def check_rc_signal(drone: System):
    logging.info("🎮 Checking RC signal...")
    async for rc_status in drone.telemetry.rc_status():
        if rc_status.is_available:
            logging.info(f"✅ RC signal detected. Strength: {rc_status.signal_strength_percent:.1f}%")
            break
        await asyncio.sleep(1)

async def check_armable(drone: System):
    async for is_armed in drone.telemetry.armed():
        if not is_armed:
            logging.info("✅ Drone is currently disarmed and ready to arm.")
            break
        await asyncio.sleep(1)

# ================================
# ACTIONS
# ================================

async def arm_drone(drone: System):
    try:
        await drone.action.arm()
        logging.info("🚀 Drone armed.")
    except Exception as e:
        logging.error(f"❌ Failed to arm: {e}")

async def takeoff(drone: System, altitude=2.0):
    try:
        logging.info(f"🛫 Taking off to {altitude}m...")
        await drone.action.set_takeoff_altitude(altitude)
        await drone.action.takeoff()
        await asyncio.sleep(5)
    except Exception as e:
        logging.error(f"❌ Takeoff failed: {e}")

async def land(drone: System):
    logging.info("🛬 Landing...")
    await drone.action.land()

async def move_ned(drone: System, north=0.0, east=0.0, down=0.0, duration=4):
    try:
        velocity = VelocityNedYaw(north, east, down, 0.0)
        await drone.offboard.set_velocity_ned(velocity)
        logging.info(f"➡️ Moving NED: N={north}, E={east}, D={down} for {duration}s")

        try:
            await drone.offboard.start()
        except:
            await drone.offboard.stop()
            await drone.offboard.start()

        await asyncio.sleep(duration)
        await drone.offboard.stop()
    except Exception as e:
        logging.error(f"❌ Movement failed: {e}")

# ================================
# Log
# ================================

async def monitor_status_text(drone: System):
    async for status_text in drone.telemetry.status_text():
        level = status_text.type
        text = status_text.text

        if level.name in ["ERROR", "CRITICAL", "WARNING"]:
            logging.warning(f"📣 [{level.name}] {text}")
        else:
            logging.info(f"ℹ️ [{level.name}] {text}")

# ================================
# GPS
# ================================
async def get_gps_coordinates(drone: System):
    async for position in drone.telemetry.position():
        logging.info(f"📍 GPS Position: Latitude={position.latitude_deg:.7f}, "
                     f"Longitude={position.longitude_deg:.7f}, "
                     f"Altitude={position.relative_altitude_m:.2f}m")
        break  # Only get one update


# ================================
# Altitude
# ================================

async def get_absolute_altitude(drone: System):
    async for pos in drone.telemetry.position():
        return pos.absolute_altitude_m




# ================================
# Location Moving
# ================================

async def go_to_gps_location(drone: System , latt , longg):
    lat = latt
    lon = longg

    # 
    await recover_and_resume_if_landed(drone)
    # Get current absolute altitude to maintain level flight
    abs_alt = await get_absolute_altitude(drone)

    try:
        logging.info(f"✈️ Going to Latitude={lat}, Longitude={lon}, Altitude={abs_alt:.2f}")
        await drone.action.goto_location(lat, lon, abs_alt, 0.0)
        logging.info("📌 Navigation command sent. Waiting to reach...")
    except Exception as e:
        logging.error(f"❌ Failed to navigate: {e}")



# async def go_to_gps_location1(drone: System):
#     lat = 7.2530242
#     lon = 80.5922737

#     # Get current absolute altitude to maintain level flight
#     abs_alt = await get_absolute_altitude(drone)

#     try:
#         logging.info(f"✈️ Going to Latitude={lat}, Longitude={lon}, Altitude={abs_alt:.2f}")
#         await drone.action.goto_location(lat, lon, abs_alt, 0.0)
#         logging.info("📌 Navigation command sent. Waiting to reach...")
#     except Exception as e:
#         logging.error(f"❌ Failed to navigate: {e}")

async def go_to_gps_location_land(drone: System , lat = 7.2530244 , lon=80.5924079 ):
    lat = 7.2530244
    lon = 80.5924079

    # Get current absolute altitude to maintain level flight
    abs_alt = await get_absolute_altitude(drone)

    try:
        logging.info(f"✈️ Going to Latitude={lat}, Longitude={lon}, Altitude={abs_alt:.2f}")
        await drone.action.goto_location(lat, lon, abs_alt, 0.0)
        logging.info("📌 Navigation command sent. Waiting to reach...")
    except Exception as e:
        logging.error(f"❌ Failed to navigate: {e}")


# ================================
# Outside Data capturing - shell commands
# ================================
async def run_sensor_script(node_id, mac, char_uuid):
    """
    Asynchronously runs a predefined Python script and logs output/errors.
    """
    command = f"python3 /home/raspig11/Caputuring/BLE/DecodeUploader6.py {node_id} {mac} {char_uuid}"
    process = await asyncio.create_subprocess_shell(
        command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    stdout, stderr = await process.communicate()

    if process.returncode == 0:
        logging.info("✅ Script executed successfully.")
        logging.debug(stdout.decode())
    else:
        logging.error(f"❌ Script failed with return code {process.returncode}.")
        logging.error(f"Stdout: {stdout.decode()}")
        logging.error(f"Stderr: {stderr.decode()}")

async def run_camera_script(node_ID):
    """
    Asynchronously runs a predefined Python script and logs output/errors.
    """
    command = f"python3 /home/raspig11/Caputuring/Camera/capture4.py {node_ID}"
    process = await asyncio.create_subprocess_shell(
        command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    stdout, stderr = await process.communicate()

    if process.returncode == 0:
        logging.info("✅ Script executed successfully.")
        logging.debug(stdout.decode())
    else:
        logging.error(f"❌ Script failed with return code {process.returncode}.")
        logging.error(f"Stdout: {stdout.decode()}")
        logging.error(f"Stderr: {stderr.decode()}")


# ================================
# Failsafe
# ================================

# async def wait_until_arrival(drone, target_lat, target_lon, threshold=0.00001):
#     logging.info("🕒 Waiting until drone reaches target location...")
#     async for position in drone.telemetry.position():
#         lat_diff = abs(position.latitude_deg - target_lat)
#         lon_diff = abs(position.longitude_deg - target_lon)
#         if lat_diff < threshold and lon_diff < threshold:
#             logging.info("📍 Arrived at destination.")
#             break
#         await asyncio.sleep(1)

async def wait_until_arrival(drone, target_lat, target_lon, threshold=0.00001, max_wait=120):
    logging.info("🕒 Waiting until drone reaches target location...")

    start_time = asyncio.get_event_loop().time()

    while True:
        async for position in drone.telemetry.position():
            lat_diff = abs(position.latitude_deg - target_lat)
            lon_diff = abs(position.longitude_deg - target_lon)

            # ✅ ARRIVAL CHECK
            if lat_diff < threshold and lon_diff < threshold:
                logging.info("📍 Arrived at destination.")
                return

            # ✅ MAX WAIT TIME CHECK
            elapsed = asyncio.get_event_loop().time() - start_time
            if elapsed > max_wait:
                logging.warning("⏳ Waited too long. Rechecking drone status...")
                # 🛠️ Try recovery
                await recover_and_resume_if_landed(drone)
                # Reset timer
                start_time = asyncio.get_event_loop().time()

            await asyncio.sleep(1)
            break  # Needed to exit inner async for-loop before looping again




# async def wait_until_arrival1(drone, target_lat = 7.2530242, target_lon = 80.5922737, threshold=0.00001):
#     logging.info("🕒 Waiting until drone reaches target location...")
#     async for position in drone.telemetry.position():
#         lat_diff = abs(position.latitude_deg - target_lat)
#         lon_diff = abs(position.longitude_deg - target_lon)
#         if lat_diff < threshold and lon_diff < threshold:
#             logging.info("📍 Arrived at destination.")
#             break
#         await asyncio.sleep(1)

# async def wait_until_arrival2(drone, target_lat = 7.2530244, target_lon = 80.5924079, threshold=0.00001):
#     logging.info("🕒 Waiting until drone reaches target location...")
#     async for position in drone.telemetry.position():
#         lat_diff = abs(position.latitude_deg - target_lat)
#         lon_diff = abs(position.longitude_deg - target_lon)
#         if lat_diff < threshold and lon_diff < threshold:
#             logging.info("📍 Arrived at destination.")
#             break
#         await asyncio.sleep(1)

async def wait_until_arrival_land(drone, target_lat = 7.2530244, target_lon = 80.5924079, threshold=0.00001):
    logging.info("🕒 Waiting until drone reaches target location...")
    async for position in drone.telemetry.position():
        lat_diff = abs(position.latitude_deg - target_lat)
        lon_diff = abs(position.longitude_deg - target_lon)
        if lat_diff < threshold and lon_diff < threshold:
            logging.info("📍 Arrived at destination.")
            break
        await asyncio.sleep(1)



def handle_sigint(*args):
    logging.warning("❗ KeyboardInterrupt detected. Disarming...")
    asyncio.create_task(drone.action.disarm())
    exit(0)

signal.signal(signal.SIGINT, handle_sigint)


# ================================
# Regular status updates
# ================================

async def regular_status_updates(drone: System, interval=10):

    # Creating a gps get function
    async def get_gps():
        async for position in drone.telemetry.position():
            return f"Latitude: {position.latitude_deg:.7f}, Longitude: {position.longitude_deg:.7f}, Altitude: {position.relative_altitude_m:.2f}m"
        
    # Creating a battery get function
    async def get_battery():
        async for battery in drone.telemetry.battery():
            return f"Battery: {battery.remaining_percent:.1f}%"
        
    # Creating a RC signal get function
    async def get_rc_signal():
        async for rc_status in drone.telemetry.rc_status():
            return f"RC Signal Strength: {rc_status.signal_strength_percent:.1f}%"
        
    #Send the data to web server need send lat , lng rc, battery
    # Example payload structure:
    #     -d '{
    #     "droneId": 6,
    #     "lat": 7.2906,
    #     "lng": 80.6337,
    #     "battery": 87,
    #     "signalStrength": 70,
    #     "altitude": 120.5,
    #     "speed": 15.2
    #   }'
    #Sendding default speed value
    async def send_status_to_server(gps, battery, rc_signal):
        payload = {
            "droneId": Drone_ID,
            "lat": gps.split(",")[0].split(":")[1].strip(),
            "lng": gps.split(",")[1].split(":")[1].strip(),
            "battery": battery.split(":")[1].strip(),
            "signalStrength": rc_signal.split(":")[1].strip(),
            "altitude": gps.split(",")[2].split(":")[1].strip(),
            "speed" : "5" 
        }

        try:
            response = requests.post(DRONE_STATUS_ENDPOINT, json=payload, headers=headers)
            if response.status_code == 200:
                logging.info("✅ Status sent to server successfully.")
            else:
                logging.error(f"❌ Failed to send status. Status code: {response.status_code}")
        except requests.RequestException as e:
            logging.error(f"❌ Error sending status to server: {e}")

    while True:
        gps = await get_gps()
        battery = await get_battery()
        rc_signal = await get_rc_signal()

        logging.info(f"🔄 Regular Status Update - {gps}, {battery}, {rc_signal}")
        await send_status_to_server(gps, battery, rc_signal)

        await asyncio.sleep(interval)

    




# =============================================================
# Regular watchdog for update Status( Warning, Error, Critical)
# =============================================================

async def regular_watchdog(drone: System, interval=10):
    async for status_text in drone.telemetry.status_text():
        level = status_text.type
        text = status_text.text

        #Need to post the data regylarly in gollowing content
        #          -d '{
        #     "droneId": 14,
        #     "title": "WARNING",
        #     "message": "Drone battery is below 20%" 
        #   }'

        if level.name in ["ERROR", "CRITICAL", "WARNING"]:
            logging.warning(f"📣 [{level.name}] {text}")
            payload = {
                "droneId": Drone_ID,
                "title": level.name,
                "message": text
            }

            try:
                response = requests.post(DRONE_WARNING_ENDPOINT, json=payload, headers=headers)
                if response.status_code == 200:
                    logging.info("✅ Warning sent to server successfully.")
                else:
                    logging.error(f"❌ Failed to send warning. Status code: {response.status_code}")
            except requests.RequestException as e:
                logging.error(f"❌ Error sending warning to server: {e}")

        else:
            logging.info(f"ℹ️ [{level.name}] {text}")

        await asyncio.sleep(interval)



# ================================
# Recover from failsafe error
# ================================

async def recover_and_resume_if_landed(drone: System, altitude=2.0, max_retries=60):
    """
    If the drone is landed, wait for all health checks to pass and resume flight.
    """
    async for in_air in drone.telemetry.in_air():
        if in_air:
            # Already flying; no need to recover
            return
        break

    logging.warning("⚠️ Drone has landed. Attempting recovery...")

    for attempt in range(max_retries):
        healthy = True

        # Check gyro + accel + GPS + home position
        async for health in drone.telemetry.health():
            if not (health.is_gyrometer_calibration_ok and
                    health.is_accelerometer_calibration_ok and
                    health.is_global_position_ok and
                    health.is_home_position_ok):
                healthy = False
                logging.info(f"❌ Health not OK - attempt {attempt + 1}/{max_retries}")
                break

        # Check RC
        async for rc_status in drone.telemetry.rc_status():
            if not rc_status.is_available:
                healthy = False
                logging.info(f"❌ RC signal missing - attempt {attempt + 1}/{max_retries}")
            break

        if healthy:
            logging.info("✅ All health checks passed. Re-arming and resuming flight.")
            await arm_drone(drone)
            await takeoff(drone, altitude=altitude)
            return

        await asyncio.sleep(5)

    # If we fail to recover after max_retries
    logging.critical("🛑 Recovery failed after maximum retries. Aborting mission.")
    raise Exception("Recovery failed")



# ================================
# Do a task
# ================================

# This function performs basic health checks before starting the task
async def basic_health_checks(drone):
    await check_basic_health(drone)
    await check_gps_health(drone)
    await check_rc_signal(drone)
    await check_armable(drone)

# This function performs the initial setup before starting the task
async def initially_start(drone):
    await arm_drone(drone)
    await takeoff(drone)


# This function performs the main task of going to a GPS location, running camera and sensor scripts
async def do_the_task(drone, nodeId, lat , long, mac, char_UUID ):

    # ✅ Ensure we’re in the air before proceeding
    await recover_and_resume_if_landed(drone)

    # ✅ Go to the GPS location
    await go_to_gps_location(drone, lat, long)
    await wait_until_arrival(drone, lat, long)
    logging.info(f"📍 Reached Node {nodeId} at Latitude={lat}, Longitude={long}")

    # For stable capture, we can wait for a few seconds
    await asyncio.sleep(5)
    await run_camera_script(nodeId)
    logging.info(f"📷 Camera script executed for Node {nodeId}")
    # Wait for a 2 seconds before running the sensor script
    await asyncio.sleep(2)
    logging.info(f"🔍 Running sensor script for Node {nodeId} with MAC={mac} and UUID={char_UUID}")
    await run_sensor_script(nodeId, mac, char_UUID)

# This function performs the final task of landing the drone
async def end_the_task(drone):
    await go_to_gps_location_land(drone)
    await wait_until_arrival_land(drone)
    await land(drone)

# This function combines all the steps to perform the full task
async def full_task(drone, Node_List):
    await basic_health_checks(drone)
    await initially_start(drone)

    # Loop through each node in the Node_List and perform the task
    for node in Node_List:
      nodeID = node.get("nodeId")
      mac = node.get("mac_address")
      char_UUID = node.get("char_UUID")
      lat = float(node.get("lat"))
      lng = float(node.get("lng"))
      await do_the_task(drone, nodeID, lat, lng, mac, char_UUID)

  
    await end_the_task(drone)



# ================================
# MAIN MENU
# ================================

async def main():
    drone = await connect_drone()
    
    # Start background task to monitor Pixhawk status messages
    asyncio.create_task(monitor_status_text(drone))

    # Start background task for regular status updates
    asyncio.create_task(regular_status_updates(drone, interval=10))

    # Start background task for regular watchdog
    asyncio.create_task(regular_watchdog(drone, interval=10))

    while True:
    
      logging.info("🔄 Checking for new tasks...")
      # Fetch the node list
      Nodes_and_task_Id = get_nodes_from_task("14")

      while Nodes_and_task_Id is None:
        logging.info("❌ No tasks available. Waiting for new tasks...")
        await asyncio.sleep(60)  # Wait for 60 seconds before checking again
        #Fetcj the node list again
        Nodes_and_task_Id = get_nodes_from_task("14")
      
      

      # Extract Node_List and Task_ID from the fetched data
      Node_List, Task_ID = Nodes_and_task_Id

      # Accept the task
      logging.info("📝 Accepting task...")
      accepting_task(Task_ID)

      #Check if the Node list is empty
      if Node_List:
        # If not empty
        logging.info(f"✅ New task found with ID: {Task_ID}")
        
        # Log the task ID and number of nodes to visit
        logging.info(f"📋 Task ID: {Task_ID} - Nodes to visit: {len(Node_List)}")
        # Do the mission
        await full_task(drone, Node_List)
      
      else :
        # If empty
        logging.info("❌ No new tasks found. Waiting for new tasks...")
        # wait for 20 seconds before checking again
        logging.info("⏳ Waiting for 20 seconds before checking for new tasks...")
        await asyncio.sleep(20)
        # skip the rest of the loop 
        continue

      #Inform the server that the task is completed
      logging.info(f"✅ Task {Task_ID} completed. Informing server...")  
      complete_task(Task_ID)
      #wait for 20 seconds before checking again
      logging.info("⏳ Waiting for 20 seconds before checking for new tasks...")
      await asyncio.sleep(20)
      
      #Clear the Node List and Task_ID for the next iteration
      logging.info("🔄 Clearing Node List and TaskId for next iteration...")
      Node_List.clear()
      Task_ID = 0
      

if __name__ == "__main__":
    asyncio.run(main())
