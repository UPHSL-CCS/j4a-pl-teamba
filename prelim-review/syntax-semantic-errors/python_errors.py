"""
Python Examples: Syntax vs Semantic Errors
==========================================

This file demonstrates the difference between syntax errors and semantic errors
in Python programming language.
"""

# ===== SYNTAX ERRORS =====
# These are caught by the parser before the program runs
# They violate the grammar rules of the language

print("=== SYNTAX ERROR EXAMPLES ===")

# Example 1: Missing closing parenthesis
# print("Hello World"  # SyntaxError: unexpected EOF while parsing

# Example 2: Invalid indentation
# if True:
# print("This will cause a syntax error")  # IndentationError

# Example 3: Invalid assignment target
# 5 = x  # SyntaxError: can't assign to literal

# Example 4: Missing colon after if statement
# if True  # SyntaxError: invalid syntax
#     print("Missing colon")

print("Syntax errors are caught before execution")

# ===== SEMANTIC ERRORS =====
# These are caught during runtime - the syntax is correct but the meaning is wrong

print("\n=== SEMANTIC ERROR EXAMPLES ===")

# Example 1: Using undefined variable (NameError)
try:
    print(undefined_variable)  # This will raise NameError
except NameError as e:
    print(f"Semantic Error: {e}")

# Example 2: Type mismatch (TypeError)
try:
    result = "Hello" + 5  # This will raise TypeError
except TypeError as e:
    print(f"Semantic Error: {e}")

# Example 3: Division by zero (ZeroDivisionError)
try:
    result = 10 / 0  # This will raise ZeroDivisionError
except ZeroDivisionError as e:
    print(f"Semantic Error: {e}")

# Example 4: Index out of range (IndexError)
try:
    my_list = [1, 2, 3]
    print(my_list[10])  # This will raise IndexError
except IndexError as e:
    print(f"Semantic Error: {e}")

print("\nSemantic errors occur during program execution")

# ===== ADDITIONAL EXAMPLES (CONTRIBUTED) =====

print("\n=== ADDITIONAL SYNTAX ERROR EXAMPLE ===")

# Example 5: Invalid class definition syntax
# class MyClass()  # SyntaxError: expected ':'
#     pass

print("Additional syntax error also prevents code execution")

print("\n=== ADDITIONAL SEMANTIC ERROR EXAMPLE ===")

# Example 5: Attribute error (trying to access a non-existent attribute)
try:
    class SimpleClass:
        pass
    
    obj = SimpleClass()
    print(obj.non_existent_attribute)  # This will raise AttributeError
except AttributeError as e:
    print(f"Additional Semantic Error: {e}")

print("This demonstrates how accessing undefined attributes fails during execution")