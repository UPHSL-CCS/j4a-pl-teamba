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

*This activity demonstrates our understanding of fundamental programming language concepts through comparative analysis and practical examples.*
