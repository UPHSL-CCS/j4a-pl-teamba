"""
Python If-Else Statement Examples
================================

This file demonstrates the syntax and usage of if-else statements in Python.
Author: Larie Amimiorg
"""

print("=== PYTHON IF-ELSE EXAMPLES ===\n")

# Example 1: Basic if-else
num = 7
print(f"Example 1: Testing if {num} is even or odd")
if num % 2 == 0:
    print(f"{num} is even")
else:
    print(f"{num} is odd")

# Example 2: if-elif-else chain
grade = 85
print(f"\nExample 2: Grading a score of {grade}")
if grade >= 90:
    print("Grade: A")
elif grade >= 80:
    print("Grade: B")
elif grade >= 70:
    print("Grade: C")
elif grade >= 60:
    print("Grade: D")
else:
    print("Grade: F")

# Example 3: Nested if-else
hour = 14
is_weekend = True
print(f"\nExample 3: Determining activity for hour {hour} on {'weekend' if is_weekend else 'weekday'}")
if is_weekend:
    if hour < 12:
        print("Sleep in")
    else:
        print("Go outside")
else:
    if hour < 9:
        print("Get ready for work")
    elif hour < 17:
        print("At work")
    else:
        print("Relax at home")

# Example 4: Conditional expression (shorthand if-else)
age = 20
can_vote = "Yes" if age >= 18 else "No"
print(f"\nExample 4: Can a person aged {age} vote? {can_vote}")

# Example 5: Truthy and falsy values
username = ""
print("\nExample 5: Testing truthy and falsy values")
if username:
    print("Username is provided")
else:
    print("Username is empty")

# Example 6: Logical operators in conditions
has_permission = True
is_admin = False
print("\nExample 6: Testing combined conditions")
if has_permission and is_admin:
    print("Full access granted")
elif has_permission or is_admin:
    print("Partial access granted")
else:
    print("Access denied")

# Output a conclusion
print("\nPython if-else statements use indentation to define code blocks, making the code clean and readable.")