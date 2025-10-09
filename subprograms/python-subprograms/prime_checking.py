"""
Python Prime Number Module
=========================
This simple module provides prime number checking functionality.
It can be imported and used in other files.

Author: Al jorome A. Gonzaga
"""

def is_prime(n):
    """
    Check if a number is prime.
    
    Args:
        n: An integer to check
        
    Returns:
        bool: True if prime, False otherwise
    """
    # Handle edge cases
    if n <= 1:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    
    # Check odd divisors up to the square root of n
    for i in range(3, int(n ** 0.5) + 1, 2):
        if n % i == 0:
            return False
    return True