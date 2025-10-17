import threading
import time
import random
import os

# Shared resource (nectar storage)
nectar_collected = 0
nectar_lock = threading.Lock()  # Prevent race condition when bees add nectar


def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')


def display_hive():
    clear_screen()
    print("🐝 BEE COLONY SIMULATION — Threading in Python 🐝\n")
    print(f"🍯 Total nectar in hive: {nectar_collected} drops\n")
    print("Bees are collecting nectar from flowers...\n")
    for bee, status in bee_status.items():
        print(f"{bee}: {status}")
    print("\nPress Ctrl + C to stop simulation.\n")


# ========================================
# TASK CREATION
# ========================================
# Define the task that each thread (bee) will execute
def bee_worker(bee_name):
    """
    Task function for each bee thread
    - Each bee collects nectar independently
    - Uses locks for thread-safe access to shared resource
    """
    global nectar_collected

    while True:
        # Bee leaves the hive
        bee_status[bee_name] = "🪴 Flying to flower..."
        display_hive()
        time.sleep(random.uniform(1, 2))

        # Bee collects nectar
        collected = random.randint(1, 5)
        bee_status[bee_name] = f"🌼 Collecting {collected} drops of nectar..."
        display_hive()
        time.sleep(random.uniform(1, 2))

        # Bee returns to hive
        bee_status[bee_name] = "🍯 Returning to hive..."
        display_hive()
        time.sleep(random.uniform(1, 2))

        # Bee stores nectar (shared resource)
        with nectar_lock:
            nectar_collected += collected

        # Bee rests a bit
        bee_status[bee_name] = "😴 Resting..."
        display_hive()
        time.sleep(random.uniform(1, 2))


# Dictionary to track each bee's activity
bee_status = {
    "Bee 1": "😴 Resting...",
    "Bee 2": "😴 Resting...",
    "Bee 3": "😴 Resting...",
    "Bee 4": "😴 Resting..."
}

# ========================================
# THREAD SETUP
# ========================================
# Create threads for each bee worker
threads = []
for bee in bee_status.keys():
    # Create a new thread:
    # - target: the function to execute
    # - args: arguments to pass to the function
    # - daemon: allows program to exit even if threads are running
    t = threading.Thread(target=bee_worker, args=(bee,), daemon=True)
    threads.append(t)
    t.start()  # Start the thread execution


# Keep main thread running to allow worker threads to continue
try:
    while True:
        time.sleep(0.1)
except KeyboardInterrupt:
    print("\n🍯 Hive closed! Simulation ended.")