"""
Python Typing System Examples
============================

This file demonstrates Python's typing system characteristics:
- Dynamic typing: Types are determined at runtime
- Strong typing: Type coercion is limited and explicit
- Duck typing: "If it walks like a duck and quacks like a duck, it's a duck"
- Type hints: Optional static type annotations (Python 3.5+)
"""

# ===== DYNAMIC TYPING =====
print("=== DYNAMIC TYPING ===")

# Variables can hold different types during execution
dynamic_var = 42                    # Integer
print(f"dynamic_var as int: {dynamic_var}, type: {type(dynamic_var)}")

dynamic_var = "Now I'm a string"    # String
print(f"dynamic_var as str: {dynamic_var}, type: {type(dynamic_var)}")

dynamic_var = [1, 2, 3]            # List
print(f"dynamic_var as list: {dynamic_var}, type: {type(dynamic_var)}")

dynamic_var = {"key": "value"}      # Dictionary
print(f"dynamic_var as dict: {dynamic_var}, type: {type(dynamic_var)}")

# ===== STRONG TYPING =====
print("\n=== STRONG TYPING ===")

# Python prevents implicit type conversions that might lose data
print("Strong typing prevents unsafe implicit conversions:")

# These operations will raise TypeError (no implicit conversion)
try:
    result = "5" + 3  # String + Integer
except TypeError as e:
    print(f"TypeError: {e}")

try:
    result = "hello" - "world"  # String subtraction not supported
except TypeError as e:
    print(f"TypeError: {e}")

try:
    result = [1, 2, 3] + "string"  # List + String
except TypeError as e:
    print(f"TypeError: {e}")

# Explicit conversions are required
print("\nExplicit conversions work:")
number_str = "5"
number_int = 3
result = int(number_str) + number_int  # Explicit conversion
print(f"int('5') + 3 = {result}")

result = number_str + str(number_int)  # Explicit conversion
print(f"'5' + str(3) = '{result}'")

# ===== TYPE CHECKING AND INTROSPECTION =====
print("\n=== TYPE CHECKING AND INTROSPECTION ===")

def check_types(value):
    """Demonstrates type checking methods"""
    print(f"Value: {value}")
    print(f"  type(): {type(value)}")
    print(f"  isinstance(value, int): {isinstance(value, int)}")
    print(f"  isinstance(value, str): {isinstance(value, str)}")
    print(f"  isinstance(value, (int, float)): {isinstance(value, (int, float))}")

check_types(42)
check_types("hello")
check_types(3.14)

# ===== DUCK TYPING =====
print("\n=== DUCK TYPING ===")

class Duck:
    def quack(self):
        return "Quack quack!"
    
    def walk(self):
        return "Waddle waddle"

class Person:
    def quack(self):
        return "I'm pretending to be a duck!"
    
    def walk(self):
        return "Walking normally"

class Robot:
    def quack(self):
        return "BEEP: Quack simulation"
    
    def walk(self):
        return "MECHANICAL_WALK_MODE_ACTIVATED"

def treat_as_duck(duck_like_object):
    """If it quacks like a duck and walks like a duck, treat it as a duck"""
    print(f"Quacking: {duck_like_object.quack()}")
    print(f"Walking: {duck_like_object.walk()}")

print("Duck typing allows different objects with same interface:")
duck = Duck()
person = Person()
robot = Robot()

treat_as_duck(duck)
treat_as_duck(person)
treat_as_duck(robot)

# ===== TYPE HINTS (STATIC TYPING) =====
print("\n=== TYPE HINTS (Python 3.5+) ===")

from typing import List, Dict, Optional, Union, Callable

def add_numbers(x: int, y: int) -> int:
    """Function with type hints"""
    return x + y

def process_names(names: List[str]) -> Dict[str, int]:
    """Process a list of names and return their lengths"""
    return {name: len(name) for name in names}

def maybe_convert(value: Optional[str]) -> Union[int, None]:
    """Convert string to int, or return None"""
    if value is not None:
        try:
            return int(value)
        except ValueError:
            return None
    return None

def apply_operation(x: int, operation: Callable[[int], int]) -> int:
    """Apply a function to a number"""
    return operation(x)

# Type hints don't affect runtime behavior
print(f"add_numbers(5, 3) = {add_numbers(5, 3)}")
print(f"add_numbers('5', '3') = {add_numbers('5', '3')}")  # Still works at runtime!

names_list = ["Alice", "Bob", "Charlie"]
name_lengths = process_names(names_list)
print(f"Name lengths: {name_lengths}")

print(f"maybe_convert('42'): {maybe_convert('42')}")
print(f"maybe_convert('invalid'): {maybe_convert('invalid')}")
print(f"maybe_convert(None): {maybe_convert(None)}")

square = lambda x: x * x
result = apply_operation(5, square)
print(f"apply_operation(5, lambda x: x*x): {result}")

# ===== NUMERIC TYPE COERCION =====
print("\n=== NUMERIC TYPE COERCION ===")

# Python allows some numeric type promotions
int_val = 5
float_val = 3.14
complex_val = 2 + 3j

print("Numeric type promotion examples:")
print(f"int + float: {int_val + float_val} (type: {type(int_val + float_val)})")
print(f"float + complex: {float_val + complex_val} (type: {type(float_val + complex_val)})")
print(f"int * True: {int_val * True} (type: {type(int_val * True)})")  # bool is subclass of int

# ===== CONTAINER TYPE BEHAVIOR =====
print("\n=== CONTAINER TYPE BEHAVIOR ===")

# Lists can contain mixed types (dynamic)
mixed_list = [1, "string", 3.14, True, None, [1, 2]]
print(f"Mixed list: {mixed_list}")
print("Types in list:", [type(item).__name__ for item in mixed_list])

# Dictionary with mixed key and value types
mixed_dict = {
    1: "integer key",
    "string_key": 42,
    (1, 2): "tuple key",
    frozenset([1, 2]): "frozenset key"
}
print(f"Mixed dict keys: {list(mixed_dict.keys())}")

# ===== COMPARISON WITH WEAK TYPING =====
print("\n=== COMPARISON: Python (Strong) vs JavaScript-style (Weak) ===")

# Python (strong typing) - explicit conversions required
print("Python strong typing:")
try:
    result = "5" + 3  # Error
except TypeError:
    print("  '5' + 3 → TypeError (must convert explicitly)")

print(f"  int('5') + 3 = {int('5') + 3}")
print(f"  '5' + str(3) = {'5' + str(3)}")

