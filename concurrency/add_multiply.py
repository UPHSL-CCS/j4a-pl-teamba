import threading
import time
from datetime import datetime

def timestamp():
    return datetime.now().strftime("%H:%M:%S")

if __name__ == "__main__":
    # Get input from user
    first_num = int(input("Enter the first number: "))
    second_num = int(input("Enter the second number: "))