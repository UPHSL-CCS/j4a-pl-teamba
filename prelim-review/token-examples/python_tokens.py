"""
Python Token Examples
====================

This file demonstrates different types of tokens in Python:
- Keywords: Reserved words with special meaning
- Identifiers: Names for variables, functions, classes, etc.
- Literals: Fixed values in the source code
"""

# ===== KEYWORDS =====
# Reserved words that have special meaning in Python
print("=== PYTHON KEYWORDS ===")

# Control flow keywords
if True:        # 'if' keyword
    pass        # 'pass' keyword
elif False:     # 'elif' keyword  
    pass
else:           # 'else' keyword
    pass

for i in range(3):  # 'for', 'in' keywords
    if i == 2:      # 'if' keyword
        break       # 'break' keyword
    continue        # 'continue' keyword

while False:    # 'while' keyword
    pass

# Function/class definition keywords
def my_function():      # 'def' keyword
    return "Hello"      # 'return' keyword

class MyClass:          # 'class' keyword
    def __init__(self): # 'def' keyword
        self.value = 42 # 'self' is an identifier, not keyword

# Exception handling keywords
try:                    # 'try' keyword
    x = 1 / 0
except ZeroDivisionError:  # 'except' keyword
    pass
finally:                # 'finally' keyword
    pass

# Boolean keywords
is_true = True          # 'True' keyword
is_false = False        # 'False' keyword
nothing = None          # 'None' keyword

# Logical keywords
result = True and False # 'and' keyword
result = True or False  # 'or' keyword
result = not True       # 'not' keyword

# Other important keywords
global global_var       # 'global' keyword
import math             # 'import' keyword
from datetime import date  # 'from' keyword

print("Python has 35 keywords total")

# ===== IDENTIFIERS =====
# Names used to identify variables, functions, classes, modules, etc.
print("\n=== PYTHON IDENTIFIERS ===")

# Valid identifiers
variable_name = 100         # Snake case (Python convention)
_private_var = "hidden"     # Leading underscore
__dunder_method__ = "special"  # Double underscores
CamelCaseClass = "class"    # Pascal case for classes
my_function2 = lambda x: x  # Numbers allowed (not at start)
τ = 3.14159                 # Unicode allowed

# Invalid identifiers (commented to avoid syntax errors):
# 2variable = "invalid"     # Cannot start with number
# my-variable = "invalid"   # Hyphen not allowed
# class = "invalid"         # Cannot use keywords
# my var = "invalid"        # Spaces not allowed

print(f"Variable name: {variable_name}")
print(f"Private variable: {_private_var}")
print(f"Unicode identifier τ: {τ}")

# ===== LITERALS =====
# Fixed values that appear directly in the source code
print("\n=== PYTHON LITERALS ===")

# Numeric literals
integer_literal = 42            # Integer
float_literal = 3.14159         # Float
complex_literal = 3 + 4j        # Complex number
binary_literal = 0b1010         # Binary (decimal 10)
octal_literal = 0o12            # Octal (decimal 10)
hex_literal = 0xA               # Hexadecimal (decimal 10)
scientific_literal = 1.23e-4    # Scientific notation

print(f"Integer: {integer_literal}")
print(f"Float: {float_literal}")
print(f"Complex: {complex_literal}")
print(f"Binary 0b1010: {binary_literal}")
print(f"Octal 0o12: {octal_literal}")
print(f"Hex 0xA: {hex_literal}")
print(f"Scientific 1.23e-4: {scientific_literal}")

# String literals
single_quote = 'Hello'          # Single quotes
double_quote = "World"          # Double quotes  
triple_quote = """Multi-line
string literal"""               # Triple quotes
raw_string = r"C:\Users\name"   # Raw string (no escape processing)
f_string = f"Hello {variable_name}"  # F-string (formatted)

print(f"Single quote string: {single_quote}")
print(f"Double quote string: {double_quote}")
print(f"Raw string: {raw_string}")
print(f"F-string: {f_string}")

# Boolean literals
bool_true = True                # Boolean True
bool_false = False              # Boolean False

# None literal
none_value = None               # None type

# Collection literals
list_literal = [1, 2, 3, "mixed", True]     # List
tuple_literal = (1, 2, 3)                   # Tuple
dict_literal = {"key": "value", "num": 42}  # Dictionary
set_literal = {1, 2, 3, 4}                  # Set

print(f"List: {list_literal}")
print(f"Tuple: {tuple_literal}")
print(f"Dictionary: {dict_literal}")
print(f"Set: {set_literal}")