"""
Python Arithmetic and Logical Expressions
========================================

This file demonstrates the syntax and usage of arithmetic and logical expressions in Python.
Author: Antonio (Team Member)
"""

print("=== PYTHON ARITHMETIC AND LOGICAL EXPRESSIONS ===\n")

# =====================
# ARITHMETIC EXPRESSIONS
# =====================

print("--- ARITHMETIC EXPRESSIONS ---")

# Basic arithmetic operators
a = 15
b = 4

print(f"\nBasic Arithmetic with a = {a}, b = {b}:")
print(f"Addition (a + b): {a + b}")
print(f"Subtraction (a - b): {a - b}")
print(f"Multiplication (a * b): {a * b}")
print(f"Division (a / b): {a / b}")
print(f"Floor Division (a // b): {a // b}")
print(f"Modulus (a % b): {a % b}")
print(f"Exponentiation (a ** b): {a ** b}")

# Assignment operators
print(f"\nAssignment Operators:")
num = 20
print(f"Initial num: {num}")
num += 5  # num = num + 5
print(f"After num += 5: {num}")
num -= 3  # num = num - 3
print(f"After num -= 3: {num}")
num *= 2  # num = num * 2
print(f"After num *= 2: {num}")
num /= 4  # num = num / 4
print(f"After num /= 4: {num}")
num //= 2  # Floor division assignment
print(f"After num //= 2: {num}")
num %= 7  # num = num % 7
print(f"After num %= 7: {num}")
num **= 2  # Exponentiation assignment
print(f"After num **= 2: {num}")

# Complex arithmetic expressions
print(f"\nComplex Arithmetic Expressions:")
result1 = (5 + 3) * 2 - 4 / 2
print(f"(5 + 3) * 2 - 4 / 2 = {result1}")

import math
result2 = math.pow(3, 2) + math.sqrt(16) - abs(-5)
print(f"3^2 + √16 - |-5| = {result2}")

# Using built-in math functions
print(f"\nBuilt-in Math Functions:")
numbers = [1, 2, 3, 4, 5]
print(f"Numbers: {numbers}")
print(f"Sum: {sum(numbers)}")
print(f"Max: {max(numbers)}")
print(f"Min: {min(numbers)}")
print(f"Average: {sum(numbers) / len(numbers)}")

# =====================
# LOGICAL EXPRESSIONS
# =====================

print("\n--- LOGICAL EXPRESSIONS ---")

# Comparison operators
print(f"\nComparison Operators with a = {a}, b = {b}:")
print(f"Equal (a == b): {a == b}")
print(f"Not equal (a != b): {a != b}")
print(f"Greater than (a > b): {a > b}")
print(f"Less than (a < b): {a < b}")
print(f"Greater than or equal (a >= b): {a >= b}")
print(f"Less than or equal (a <= b): {a <= b}")

# Identity operators
print(f"\nIdentity Operators:")
x = [1, 2, 3]
y = [1, 2, 3]
z = x
print(f"x: {x}, y: {y}, z: {z}")
print(f"x is y: {x is y}")  # False - different objects
print(f"x is z: {x is z}")  # True - same object
print(f"x == y: {x == y}")  # True - same values

# Membership operators
print(f"\nMembership Operators:")
fruits = ["apple", "banana", "cherry"]
print(f"Fruits: {fruits}")
print(f"'apple' in fruits: {'apple' in fruits}")
print(f"'orange' in fruits: {'orange' in fruits}")
print(f"'grape' not in fruits: {'grape' not in fruits}")

# Logical operators
print(f"\nLogical Operators:")
is_true = True
is_false = False

print(f"is_true: {is_true}, is_false: {is_false}")
print(f"Logical AND (is_true and is_false): {is_true and is_false}")
print(f"Logical OR (is_true or is_false): {is_true or is_false}")
print(f"Logical NOT (not is_true): {not is_true}")
print(f"Logical NOT (not is_false): {not is_false}")

# Complex logical expressions
print(f"\nComplex Logical Expressions:")
age = 25
has_license = True
has_insurance = False

print(f"age: {age}, has_license: {has_license}, has_insurance: {has_insurance}")

can_drive = age >= 18 and has_license
print(f"Can drive (age >= 18 and has_license): {can_drive}")

can_rent_car = age >= 21 and has_license and has_insurance
print(f"Can rent car (age >= 21 and has_license and has_insurance): {can_rent_car}")

needs_documents = not has_license or not has_insurance
print(f"Needs documents (not has_license or not has_insurance): {needs_documents}")

# =====================
# EXPRESSIONS IN CONTROL FLOW
# =====================

print("\n--- EXPRESSIONS IN CONTROL FLOW ---")

# Using expressions in if statements
print(f"\nUsing expressions in if statements:")
score = 85
bonus = 10
final_score = score + bonus

if final_score > 90 and score >= 80:
    print(f"Excellent! Final score: {final_score}")
elif final_score >= 80 or bonus > 5:
    print(f"Good! Final score: {final_score}")
else:
    print(f"Needs improvement. Final score: {final_score}")

# Using expressions in loops
print(f"\nUsing expressions in loops:")
print("Even numbers from 2 to 10:")
for i in range(1, 11):
    if i % 2 == 0:
        print(f"{i} is even")

# List comprehensions with expressions
print(f"\nList Comprehensions with Expressions:")
numbers = list(range(1, 11))
even_squares = [x**2 for x in numbers if x % 2 == 0]
print(f"Original numbers: {numbers}")
print(f"Squares of even numbers: {even_squares}")

# Conditional expressions (ternary operator)
print(f"\nConditional Expressions (Ternary Operator):")
temperature = 25
weather = "warm" if temperature > 20 else "cold"
print(f"Temperature: {temperature}°C - It's {weather}")

status = "senior" if age >= 65 else ("adult" if age >= 18 else "minor")
print(f"Age: {age} - Status: {status}")

# Short-circuit evaluation
print(f"\nShort-circuit Evaluation:")
user = {"name": "John", "email": None}
display_email = user["email"] or "No email provided"
print(f"Display email: {display_email}")

greeting = user["name"] and f"Hello, {user['name']}!"
print(f"Greeting: {greeting}")

# Boolean context and truthiness
print(f"\nBoolean Context and Truthiness:")
values = [0, 1, "", "hello", [], [1, 2], None, True, False]
print("Testing truthiness of different values:")
for value in values:
    print(f"{repr(value):10} -> {bool(value)}")

# Chained comparisons (unique to Python)
print(f"\nChained Comparisons (Python specific):")
x = 5
print(f"x = {x}")
print(f"1 < x < 10: {1 < x < 10}")
print(f"0 <= x <= 5: {0 <= x <= 5}")
print(f"x == 5 == 5: {x == 5 == 5}")

# Using all() and any() with expressions
print(f"\nUsing all() and any() with expressions:")
test_scores = [85, 92, 78, 96, 88]
print(f"Test scores: {test_scores}")
print(f"All scores >= 75: {all(score >= 75 for score in test_scores)}")
print(f"Any score >= 90: {any(score >= 90 for score in test_scores)}")
print(f"All scores < 100: {all(score < 100 for score in test_scores)}")

print("\n=== END OF PYTHON EXPRESSIONS DEMO ===")