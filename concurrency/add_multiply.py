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