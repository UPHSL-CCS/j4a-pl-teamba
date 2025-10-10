# --- Abstraction Example: Simple Bank System ---
"""
ABSTRACTION DEMONSTRATION:
- Users interact with simple methods without knowing complex internal operations
- Implementation details are hidden behind clean, easy-to-use interfaces
- Complex balance management is simplified into deposit(), withdraw(), get_balance()
"""

class BankAccount:
    """
    ABSTRACTION: This class hides the complexity of balance management
    Users don't need to know HOW balance is stored or calculated
    They just use simple methods: deposit, withdraw, check balance
    """
    
    def __init__(self, owner, balance=0):
        """
        ENCAPSULATION: Constructor sets up account with hidden balance
        """
        self.owner = owner  # Public attribute - can be accessed directly
        self.__balance = balance  # PRIVATE attribute (double underscore) - HIDDEN from outside access
        # This demonstrates INFORMATION HIDING - core principle of abstraction

    def deposit(self, amount):
        """
        ABSTRACTION: Simple interface for adding money
        User doesn't need to know internal validation logic or how balance is updated
        """
        if amount > 0:
            self.__balance += amount  # Internal operation hidden from user
            print(f"Deposited ₱{amount}")
        else:
            print("Invalid deposit amount")  # Error handling abstracted away

    def withdraw(self, amount):
        """
        ABSTRACTION: Safe withdrawal with hidden complexity
        User doesn't see the internal balance checking logic
        """
        if 0 < amount <= self.__balance:  # Complex validation hidden from user
            self.__balance -= amount  # Internal balance manipulation
            print(f"Withdrew ₱{amount}")
        else:
            print("Insufficient balance or invalid amount")

    def get_balance(self):
        """
        ABSTRACTION: Controlled access to balance information
        User gets balance WITHOUT direct access to __balance variable
        This is a 'getter' method - common abstraction pattern
        """
        return self.__balance


def main():
    """
    ABSTRACTION IN ACTION:
    - User interacts with high-level operations (deposit, withdraw, check balance)
    - No need to understand internal balance storage, validation logic, or data structures
    - Complex banking operations are simplified into a user-friendly menu system
    """
    
    # Creating account - user doesn't know how balance is internally stored
    account = BankAccount("Mark", 1000)  # Abstraction: simple account creation

    while True:
        # USER INTERFACE ABSTRACTION: Complex menu logic hidden behind simple choices
        print("\n--- Simple Bank Menu ---")
        print("1. Deposit")     # User sees simple option, not complex validation logic
        print("2. Withdraw")    # User sees simple option, not balance checking complexity  
        print("3. Check Balance") # User sees simple option, not internal data access
        print("4. Exit")
        choice = input("Enter choice: ")

        if choice == '1':
            # ABSTRACTION: User just enters amount, doesn't handle validation logic
            amt = float(input("Enter amount to deposit: "))
            account.deposit(amt)  # All complexity hidden in this method call
            
        elif choice == '2':
            # ABSTRACTION: User just enters amount, doesn't handle balance checking
            amt = float(input("Enter amount to withdraw: "))
            account.withdraw(amt)  # All validation and balance logic hidden
            
        elif choice == '3':
            # ABSTRACTION: User gets balance without knowing how it's stored or calculated
            print(f"Your balance: ₱{account.get_balance()}")  # No direct access to __balance
            
        elif choice == '4':
            print("Goodbye!")
            break  # Simple exit - complexity of cleanup hidden
        else:
            print("Invalid choice")  # Error handling abstracted

"""
KEY ABSTRACTION CONCEPTS DEMONSTRATED:

1. INFORMATION HIDING: 
   - __balance is private, users can't access it directly
   - Internal validation logic is hidden from users

2. INTERFACE SIMPLIFICATION:
   - Complex banking operations reduced to simple method calls
   - deposit(), withdraw(), get_balance() hide implementation details

3. ENCAPSULATION:
   - Data (__balance) and methods that operate on it are bundled together
   - External code can't accidentally corrupt the balance

4. USER-FRIENDLY DESIGN:
   - Technical complexity hidden behind intuitive menu options
   - Users focus on WHAT they want to do, not HOW it's implemented

This is why abstraction is powerful - it makes complex systems usable!
"""

if __name__ == "__main__":
    main()