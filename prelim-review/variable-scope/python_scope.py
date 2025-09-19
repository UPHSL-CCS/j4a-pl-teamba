"""
Python Variable Scope Examples
=============================

This file demonstrates different types of variable scope in Python:
- Global scope: Variables accessible throughout the entire program
- Local scope: Variables accessible only within a specific function/block
- Enclosing scope: Variables in nested function scenarios (LEGB rule)
- Built-in scope: Pre-defined variables and functions
"""

# ===== GLOBAL SCOPE =====
# Variables defined at the module level
print("=== GLOBAL SCOPE ===")

global_variable = "I am global"         # Global variable
global_counter = 0                      # Global counter

def access_global():
    """Function that accesses global variables"""
    print(f"Accessing global variable: {global_variable}")
    print(f"Global counter: {global_counter}")

access_global()

def modify_global():
    """Function that modifies global variables using 'global' keyword"""
    global global_counter
    global_counter += 1
    print(f"Modified global counter: {global_counter}")

modify_global()
modify_global()

# ===== LOCAL SCOPE =====
print("\n=== LOCAL SCOPE ===")

def local_scope_demo():
    """Demonstrates local variable scope"""
    local_variable = "I am local"       # Local variable
    local_number = 42                   # Local variable
    
    print(f"Inside function - local variable: {local_variable}")
    print(f"Inside function - local number: {local_number}")
    
    # Can access global variables without 'global' keyword (read-only)
    print(f"Inside function - global variable: {global_variable}")

local_scope_demo()

# Trying to access local variables outside function scope will cause error
try:
    print(local_variable)  # This will raise NameError
except NameError as e:
    print(f"Error accessing local variable outside scope: {e}")

# ===== VARIABLE SHADOWING =====
print("\n=== VARIABLE SHADOWING ===")

shadow_me = "I am global"

def shadow_demo():
    """Demonstrates variable shadowing"""
    shadow_me = "I am local and shadow the global"  # Shadows global variable
    print(f"Inside function: {shadow_me}")

shadow_demo()
print(f"Outside function: {shadow_me}")  # Original global value unchanged

# ===== ENCLOSING SCOPE (NESTED FUNCTIONS) =====
print("\n=== ENCLOSING SCOPE (LEGB RULE) ===")

def outer_function():
    """Outer function demonstrating enclosing scope"""
    outer_variable = "I am in outer function"
    
    def inner_function():
        """Inner function accessing enclosing scope"""
        inner_variable = "I am in inner function"
        print(f"Inner function - inner variable: {inner_variable}")
        print(f"Inner function - outer variable: {outer_variable}")  # Enclosing scope
        print(f"Inner function - global variable: {global_variable}")  # Global scope
    
    def modify_outer():
        """Inner function modifying enclosing scope variable"""
        nonlocal outer_variable  # 'nonlocal' keyword for enclosing scope
        outer_variable = "Modified by inner function"
    
    print(f"Before inner function: {outer_variable}")
    inner_function()
    
    modify_outer()
    print(f"After modify_outer: {outer_variable}")

outer_function()

# ===== BUILT-IN SCOPE =====
print("\n=== BUILT-IN SCOPE ===")

# Built-in functions and variables are always available
print(f"Built-in function len(): {len([1, 2, 3])}")
print(f"Built-in function abs(): {abs(-5)}")
print(f"Built-in function max(): {max([1, 5, 3])}")

# You can shadow built-in names (not recommended)
def shadow_builtin_demo():
    """Demonstrates shadowing built-in names (bad practice)"""
    len = "I shadowed the len function"  # Shadows built-in len()
    print(f"Shadowed len: {len}")
    # print(len([1, 2, 3]))  # This would cause TypeError

shadow_builtin_demo()
print(f"Built-in len still works outside: {len('hello')}")

# ===== LEGB RULE DEMONSTRATION =====
print("\n=== LEGB RULE DEMONSTRATION ===")
# Local -> Enclosing -> Global -> Built-in

builtin_name = "This shadows built-in names like 'sum'"  # Global

def legb_outer():
    """Demonstrates LEGB rule"""
    enclosing_var = "Enclosing scope"
    
    def legb_inner():
        """Inner function showing LEGB precedence"""
        local_var = "Local scope"
        
        # Python looks for variables in this order: L -> E -> G -> B
        print(f"1. Local: {local_var}")
        print(f"2. Enclosing: {enclosing_var}")
        print(f"3. Global: {global_variable}")
        print(f"4. Built-in example: {abs(-10)}")
        
        # Same name in different scopes
        test_var = "Local test_var"
        print(f"Local test_var: {test_var}")
    
    test_var = "Enclosing test_var"
    legb_inner()
    print(f"Enclosing test_var: {test_var}")

test_var = "Global test_var"
legb_outer()
print(f"Global test_var: {test_var}")

# ===== SCOPE BEST PRACTICES =====
print("\n=== SCOPE BEST PRACTICES ===")

# 1. Minimize use of global variables
def good_practice():
    """Function that doesn't rely on global variables"""
    local_data = [1, 2, 3, 4, 5]
    return sum(local_data) / len(local_data)

average = good_practice()
print(f"Average calculated without globals: {average}")

# 2. Use function parameters instead of globals
def calculate_with_params(data):
    """Better approach using parameters"""
    return sum(data) / len(data) if data else 0

my_numbers = [10, 20, 30, 40, 50]
result = calculate_with_params(my_numbers)
print(f"Average with parameters: {result}")

print("\nScope determines where variables can be accessed in your code!")