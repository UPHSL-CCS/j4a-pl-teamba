# --- Abstraction Example: Simple Bank System ---

class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.__balance = balance  # private attribute (hidden)

    def deposit(self, amount):
        """Add money to the account"""
        if amount > 0:
            self.__balance += amount
            print(f"Deposited ₱{amount}")
        else:
            print("Invalid deposit amount")

    def withdraw(self, amount):
        """Withdraw money safely"""
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            print(f"Withdrew ₱{amount}")
        else:
            print("Insufficient balance or invalid amount")

    def get_balance(self):
        """Return current balance (no direct access to __balance)"""
        return self.__balance


def main():
    # Abstraction in action — user doesn't know how balance is managed
    account = BankAccount("Mark", 1000)

    while True:
        print("\n--- Simple Bank Menu ---")
        print("1. Deposit")
        print("2. Withdraw")
        print("3. Check Balance")
        print("4. Exit")
        choice = input("Enter choice: ")

        if choice == '1':
            amt = float(input("Enter amount to deposit: "))
            account.deposit(amt)
        elif choice == '2':
            amt = float(input("Enter amount to withdraw: "))
            account.withdraw(amt)
        elif choice == '3':
            print(f"Your balance: ₱{account.get_balance()}")
        elif choice == '4':
            print("Goodbye!")
            break
        else:
            print("Invalid choice")

if __name__ == "__main__":
    main()