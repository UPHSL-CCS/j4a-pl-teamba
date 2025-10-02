[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/A8wrl9OQ)  
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=20344359&assignment_repo_type=AssignmentRepo)  

---

# Prelim Exam - TeamBa

## Group Name
**TeamBa**

## Group Members
- Hernandez, Mark Anthony  
- Amimirog, Larie  
- Gonzaga, Al Jorome  
- Floreta, Agatha Wendie  

## Course / Section
**BSCS - JA4**

---

## Programming Languages Concept Review Activity

This repository contains our exploration of fundamental programming language concepts through practical code examples in Python and JavaScript.

### 📁 Project Structure

```
prelim-review/
├── syntax-semantic-errors/    # Syntax vs Semantic error demonstrations
├── token-examples/           # Keywords, identifiers, and literals
├── variable-scope/          # Global vs local scope examples  
└── typing-systems/          # Strong vs weak typing demonstrations
control-flow/
├── if-else-statements/    # If-else statements 
└── loops/       # Loops (for, while)
```

### 🔍 Concepts Explored

1. **Syntax vs Semantic Errors**
   - Syntax errors: Caught by parser before execution
   - Semantic errors: Runtime errors with valid syntax but incorrect logic
   - Examples in both Python and JavaScript with proper error handling

2. **Token Analysis**
   - Keywords: Reserved words with special meaning
   - Identifiers: Variable, function, and class names
   - Literals: Fixed values (numeric, string, boolean, collections)

3. **Variable Scope**
   - Python: LEGB rule (Local, Enclosing, Global, Built-in)
   - JavaScript: Function scope (var) vs Block scope (let/const)
   - Demonstrations of hoisting, closures, and scope chains

4. **Typing Systems**
   - Python: Strong typing with dynamic behavior and duck typing
   - JavaScript: Weak typing with extensive implicit coercion
   - Type safety comparisons and best practices

5. **Control Flow Structures**
   - If-else statements: Conditional branching
   - Loops: For and while loop implementations
   - Arithmetic and logical expressions in control flow

### 💭 Reflection

#### **What concept was most challenging in the activity?**

The most challenging concept was understanding the nuances between strong and weak typing systems. While both Python and JavaScript are dynamically typed (types determined at runtime), their approach to type coercion is fundamentally different. Python's strong typing requires explicit conversions and prevents potentially unsafe operations, while JavaScript's weak typing performs automatic conversions that can lead to unexpected results. 

The challenge was not just in demonstrating these differences, but in understanding when and why each approach is beneficial. JavaScript's implicit coercion can make code more flexible but less predictable, while Python's explicit approach reduces ambiguity but requires more verbose type handling.

#### **Individual Reflections:**

**Larie:**
I'm familiar with variable scope, shadowing, closures, and typing in JavaScript and Python, but they can still be confusing at times. I often have to look up terms like hoisting or closures to remind myself how they work. Even though I understand the basics, some of the quirks in weak typing and scope rules can trip me up occasionally.

**Agatha:**
For me, the most challenging concept in this activity was the kinds of typing. Although I understand the difference between the two, weak typing allows implicit type conversion while strong typing enforces types explicitly, applying and identifying them in a code snippet proved to be a bit difficult. I found it tricky to predict whether a certain language convert types on its own or give errors when types didn’t match.

**Al jorome:**
I started this not even knowing what a typing system was, so everything felt new. In Python, the easiest part was strong typing because it clearly errors when types don’t match, but duck typing and type hints were harder to wrap my head around. In JavaScript, dynamic typing made sense quickly, but weak typing and its strange coercions, like [] + [] turning into an empty string—were the most challenging.

#### **What tools did you use to complete the exercise?**

- **Programming Languages**: Python 3.9.6 and JavaScript (demonstrated conceptually)
- **Development Environment**: VS Code with integrated terminal
- **Version Control**: Git with proper commit message formatting
- **Testing Tools**: Python interpreter for validating code execution
- **Documentation**: Markdown for clear explanations and code comments
- **Code Organization**: Structured directory layout for different concepts

The combination of hands-on coding, systematic testing, and incremental version control helped reinforce the theoretical concepts through practical implementation.

---

## Control Flow Activity

This repository also contains our exploration of control flow structures in programming languages, comparing their implementation in Python and JavaScript.

### 🔍 Control Flow Structures Explored

1. **If-else statements**
   - Conditional execution based on boolean expressions
   - Multiple examples in both languages showing different use cases
   - Comparison of syntax and behavior

2. **Loops (for, while)**
   - **For loops**: Traditional counting loops and modern iteration patterns
   - **While loops**: Condition-based iteration and loop control
   - **Loop control**: Break and continue statements

### 💭 Control Flow Reflection

#### **What concept was most challenging in the activity?**

Implementing if-else statements across different programming languages highlighted how the same logical concept can have different syntactic implementations. The most challenging aspect was understanding the nuanced differences in how conditions are evaluated between languages, particularly with truthy and falsy values.

#### **Differences in how each language handles control flow:**

**If-else statements:**
- **JavaScript**: Uses curly braces `{}` to define blocks. Has the ternary operator `condition ? value1 : value2` as a shorthand for if-else. Coerces values to booleans in conditions.
- **Python**: Uses indentation and colons to define blocks. Has the conditional expression `value1 if condition else value2`. Is more strict about boolean types.

**Logical operators:**
- **JavaScript**: Uses `&&` (AND), `||` (OR), and `!` (NOT).
- **Python**: Uses English keywords `and`, `or`, and `not`.

#### **Individual Reflections:**

**Larie (If-else statements):**
While implementing if-else statements in both languages, I found that the biggest difference wasn't just syntax but how each language evaluates conditions. JavaScript's loose typing means almost anything can be a condition, while Python is more explicit. The JavaScript ternary operator (`? :`) versus Python's conditional expression (`if-else`) also shows how languages can approach the same concept with different syntax priorities.

**Agatha (Loops):**
Working on the loops made me realized that Python and JavaScript both use loops, but they handle them differently. In Python, for loops are usually used to go through a list or a range while in JavaScript, the for loop needs initialization, condition, and an increment. JavaScript also has a do-while loop, which Python doesn’t have. Python uses indentation to define the loop body, while JavaScript uses curly braces. Both languages support while, break, and continue in similar ways.

---

*This activity demonstrates our understanding of fundamental programming language concepts through comparative analysis and practical examples.*
