"""
Python Loops Examples
====================

This file demonstrates the syntax and usage of various loop constructs in Python.

"""

print("=== PYTHON LOOPS EXAMPLES ===\n")

# Example 1: Basic for loop with range
print("Example 1: Basic for loop (counting 1 to 5)")
for i in range(1, 6):
    print(f"Count: {i}")

# Example 2: for loop with list iteration
print("\nExample 2: For loop iterating through a list")
teamba = ["mark", "larie", "agatha", "jorome"]
for member in teamba:
    print(f"Member: {member}")

# Example 3: Basic while loop
print("\nExample 3: Basic while loop (countdown from 5)")
countdown = 5
while countdown > 0:
    print(f"Countdown: {countdown}")
    countdown -= 1
print("Time's up :P")

# Example 4: List comprehension
print("\nExample 4: List comprehension")
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]
print(f"Original numbers: {numbers}")
print(f"Squared numbers: {squares}")

# Example 5: Loop with break and continue (control flow)
print("\nExample 5: Loop with break and continue statements")
all_numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print("Processing numbers (skip 2, stop at 5):")
for number in all_numbers:
    if number == 2:
        print("Skipping 2")
        continue  # Skip this iteration
    if number == 5:
        print("Stopping at 5")
        break  # Exit the loop
    print(f"Number: {number}")
