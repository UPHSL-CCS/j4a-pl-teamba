import threading
import time
from datetime import datetime

def timestamp():
    return datetime.now().strftime("%H:%M:%S")

def addition(first_num, second_num):
    print(f"[{timestamp()}] ADDING: {first_num} + {second_num}")
    time.sleep(3)  # Simulate time-consuming calculation
    print(f"[{timestamp()}] SUM: {first_num + second_num}")

def multiplication(first_num, second_num):
    print(f"[{timestamp()}] MULTIPLYING: {first_num} * {second_num}")
    time.sleep(3)  # Simulate time-consuming calculation
    print(f"[{timestamp()}] PRODUCT: {first_num * second_num}")

if __name__ == "__main__":
    # Get input from user
    first_num = int(input("Enter the first number: "))
    second_num = int(input("Enter the second number: "))

    # Create two separate threads for addition and multiplication
    addition_thread = threading.Thread(target=addition, args=(first_num, second_num))
    multiplication_thread = threading.Thread(target=multiplication, args=(first_num, second_num))

    # Start both threads which will run in parallel
    addition_thread.start()
    multiplication_thread.start()

    # Wait for both threads to complete before continuing
    addition_thread.join()
    multiplication_thread.join()