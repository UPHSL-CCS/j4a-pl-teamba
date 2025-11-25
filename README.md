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
├── if-else-statements/     # If-else statements 
├── loops/                  # Loops (for, while)
└── expressions/            # Arithmetic and logical expressions
subprograms/
├── js-subprograms/         # JavaScript subprograms and modules
│   ├── main.js             # Main program using modular functions
│   ├── palindrome.js       # Palindrome checker module
│   └── anagram.js          # Anagram checker module
└── python-subprograms/     # Python subprograms and modules
    ├── main.py             # Main program using modular functions
    ├── prime_checking.py   # Prime number checker module
    └── bank_system.py      # Bank system module
concurrency/
├── add_multiply.py         # Python threading example (add and multiply)
├── download_threads.py     # Python threading example (parallel file downloads)
├── thread_race.py          # Python threading example (thread race simulation)
└── async_tasks.js          # JavaScript async/await example (concurrent tasks)
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

6. **Concurrency Models**
   - Python threading: Running tasks in parallel using threads
   - JavaScript async/await: Concurrent execution with Promises
   - Comparison of different concurrency approaches

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

**Anthony Hernandez (Arithmetic and Logical Expressions):**
Implementing arithmetic and logical expressions revealed fascinating differences between the languages. Python's approach to operator precedence and the availability of unique operators like floor division (`//`) and chained comparisons (`1 < x < 10`) made it feel more mathematically intuitive. JavaScript's automatic type coercion in arithmetic operations was both powerful and potentially dangerous - the same expression could yield different results based on context. The most interesting discovery was how both languages handle short-circuit evaluation differently, especially with truthy/falsy values

**Al Jorome Gonzaga (Summary Reflection):**
After reviewing the different aspects of control flow discussed by my groupmates, I realized that Python and JavaScript share similar core concepts but differ significantly in implementation. From Larie’s observation, we see that if-else statements highlight how JavaScript’s loose typing allows flexible conditions, while Python enforces clarity with stricter evaluation rules. Agatha’s insight into loops shows how Python emphasizes readability with simpler iteration constructs, while JavaScript provides more variation, such as the do-while loop. Lastly, Anthony’s reflection on arithmetic and logical expressions emphasizes that Python feels more mathematically precise with operators like floor division and chained comparisons, while JavaScript’s type coercion adds both flexibility and risk. Overall, these comparisons show that while both languages achieve the same control flow goals, Python prioritizes clarity and strictness, whereas JavaScript offers flexibility but requires careful handling of types.


## 🛠️ Subprograms and Modularity

This section explores the implementation of modular code through subprograms in different programming languages. The repository contains examples of modular programming, with separate files for different functions that work together through well-defined interfaces.

### 🔍 Modularity and Abstraction Concepts

1. **Function Encapsulation**
   - Functions encapsulate specific operations (palindrome checking, anagram verification, prime number testing)
   - Each function has a clear purpose and well-defined interface

2. **Module Organization**
   - Related functions grouped in modules
   - Separation of concerns between modules

3. **Abstraction Benefits**
   - Hide implementation details behind simple interfaces
   - Allow using functionality without understanding internal workings
   - Facilitate code reuse and maintenance

4. **Cross-language Comparison**
   - JavaScript module.exports vs Python import system
   - Different approaches to function definitions and parameter passing

### 💭 Modularity Reflection

#### **Why Modular Code is Easier to Maintain and Reuse:**

Modular code significantly improves maintainability by isolating functionality into discrete components. When bugs occur or features need enhancement, developers can focus on specific modules without worrying about side effects in unrelated code. This compartmentalization also facilitates testing, as each module can be validated independently.

Reusability benefits directly from modularity—well-designed functions with clear purposes can be imported into multiple projects. The palindrome and anagram checkers, for example, could be reused in text processing applications, search engines, or educational tools without modification.

Abstraction further enhances these benefits by providing clear interfaces that hide implementation details. This allows developers to use modules without needing to understand their internal workings, leading to more efficient collaboration and development.

#### **Individual Reflections:**

**Al Jorome Gonzaga :**
In this activity, I learned how important subprograms, modularity, and abstraction are in writing clean and efficient code. By separating the prime-checking logic into its own module and importing it into the main program, I saw how modular design makes the code more organized and easier to manage. It felt satisfying to see how a simple function like is_prime() could be reused in different programs without rewriting it. Abstraction also helped me understand that I don’t always need to know how a function works internally—as long as I know what it does and how to use it. This approach made my code look more professional and easier to maintain. Overall, the activity showed me that modular programming isn’t just about splitting code—it’s about designing it in a way that makes collaboration, debugging, and future updates much simpler.

**Agatha:**
Through this activity, I realized how valuable modularity and abstraction are in programming. By dividing the code into separate modules, like placing the palindrome checker in its own file, I found it much easier to keep the work organized and manageable. Modularity allowed me to focus on one part of the program at a time and make changes without worrying about breaking other parts. Abstraction was also helpful because I could use the palindrome function in my main program without needing to remember all the details of how it works. This experience showed me that modular code is not only easier to maintain and debug but it also makes it simple to reuse functions in other projects or share them with my teammates.

**Larie:**
Creating the anagram checker as a separate module from the palindrome function showed me how powerful modular programming can be. By designing these text-processing functions as independent modules with clear interfaces, I experienced firsthand how modularity enhances code organization and reusability. The main program could import both modules without needing to understand their internal implementations—that's the beauty of abstraction. When I updated the main.js to include both functions, I was impressed by how seamlessly they integrated despite having completely different internal logic. This approach makes maintenance much easier; I could fix or optimize the anagram checker without touching the palindrome code or the main program. It also makes testing simpler since each function can be tested in isolation. I now see why large-scale software development relies so heavily on these principles—they turn complex programs into manageable collections of well-defined components.

**Mark Anthony (Bank System Abstraction):**
Creating the bank system mini-program helped me understand abstraction in a practical way that goes beyond just theory. Building the BankAccount class with private balance attributes taught me that abstraction isn't just about hiding complexity—it's about protecting data integrity and creating user-friendly interfaces. When I made the __balance private and provided deposit(), withdraw(), and get_balance() methods, I realized this mirrors how real ATMs work: users interact with simple buttons without knowing the complex banking infrastructure behind them. The most valuable lesson was understanding that good abstraction makes complex systems accessible to users while keeping the underlying operations safe and organized. Adding detailed comments to explain each abstraction concept also reinforced my learning, showing me that effective abstraction should be both functional and explainable. This experience demonstrated that abstraction is fundamental to software engineering because it enables us to build complex systems that remain usable and maintainable.

---

## ⚡ Concurrency and Parallel Execution

This section explores concurrent programming models in different languages, demonstrating how multiple tasks can be executed simultaneously to improve program performance and responsiveness.

### 🔍 Concurrency Models Used

#### **Python Threading Model**
The Python examples (`download_threads.py`, `add_multiply.py`, and `thread_race.py`) use the `threading` module to create multiple threads that execute concurrently. Each example demonstrates different aspects of concurrent execution:
- `download_threads.py`: Simulates parallel file downloads
- `add_multiply.py`: Performs arithmetic operations concurrently  
- `thread_race.py`: Demonstrates thread racing with synchronization

**Key Components:**
- `threading.Thread`: Creates a new thread of execution
- `start()`: Begins thread execution
- `join()`: Waits for thread completion before continuing
- `threading.Lock`: Provides thread-safe access to shared resources

#### **JavaScript Async/Await Model**
The JavaScript example (`async_tasks.js`) uses async/await with Promises to handle concurrent operations. The `Promise.all()` method allows multiple asynchronous tasks to run concurrently without blocking the main thread.

**Key Components:**
- `async/await`: Syntactic sugar for working with Promises
- `Promise.all()`: Executes multiple promises concurrently
- `setTimeout`: Simulates asynchronous operations

### 💭 Concurrency Reflection

#### **Explanation of Concurrency Models:**

**Concurrency** is the ability of a program to handle multiple tasks at the same time, making programs more efficient and responsive. The two main approaches demonstrated are:

1. **Thread-based Concurrency (Python)**: Multiple threads share the same memory space and can run simultaneously on multi-core processors. Python's Global Interpreter Lock (GIL) means threads are better for I/O-bound tasks rather than CPU-intensive operations.

2. **Asynchronous Concurrency (JavaScript)**: Uses an event loop and non-blocking I/O to handle multiple operations concurrently within a single thread. This model is ideal for I/O-bound tasks like network requests or file operations.

#### **Thread Race Demonstrations**

**Visual Thread Race (`thread_race.py`)**
An interactive, visual thread racing program that showcases advanced threading concepts:
- **Live Progress Tracking**: Real-time visual progress bars showing each thread's advancement
- **Dynamic Display**: Screen clearing and continuous updates every 300ms for smooth animation
- **Thread Synchronization**: Multiple locks (`position_lock`, `result_lock`) for safe shared resource access
- **Interactive Experience**: User input controls and animated countdowns
- **Visual Elements**: Different emojis for each racer (⚡💨🚀⭐💫) and progress visualization

**Simple Thread Race (`simple_thread_race.py`)**  
A streamlined version focusing on core threading concepts:
- **Basic Concurrency**: Multiple threads executing simultaneously with minimal overhead
- **Clean Output**: Simple text-based race results without complex animations
- **Educational Focus**: Clear demonstration of thread creation, starting, and joining
- **Quick Testing**: Faster execution for understanding basic threading principles

**Common Race Features:**
- Multiple threads compete to complete tasks first
- Random completion times simulate real-world variability  
- Thread-safe result recording and winner determination
- Demonstrates race conditions and thread management patterns

#### **Challenges Faced When Implementing Concurrency:**

**Common Challenges:**
- **Race Conditions**: When multiple threads access shared data simultaneously, leading to unpredictable results (solved in thread_race.py using locks)
- **Deadlocks**: Threads waiting for each other to release resources, causing the program to freeze
- **Synchronization**: Coordinating threads to ensure data consistency (demonstrated in thread race with result_lock)
- **Debugging Complexity**: Concurrent programs are harder to debug due to non-deterministic execution order
- **Resource Contention**: Threads competing for the same resources can cause performance bottlenecks
- **Data Integrity**: Ensuring shared data remains consistent when accessed by multiple threads simultaneously

#### **Individual Reflections:**

**Larie (JavaScript Async/Await):**
Implementing concurrent tasks using JavaScript's async/await was both enlightening and challenging. The concept itself is straightforward—using Promises to handle asynchronous operations—but understanding when tasks truly run concurrently versus sequentially took practice. I learned that Promise.all() is key to achieving true concurrency; without it, awaiting promises one after another makes them sequential. The biggest challenge was debugging timing issues and understanding the event loop's role in managing concurrent operations. What fascinated me most was how JavaScript achieves concurrency with a single thread through non-blocking I/O, unlike Python's multi-threading approach. This experience taught me that concurrency isn't just about running things simultaneously—it's about efficiently managing resources and understanding the trade-offs between different concurrency models. The async/await syntax makes asynchronous code look synchronous, which is elegant but can hide the underlying complexity of concurrent execution.

**Agatha (Python Threading):**
In this program, I used Python’s threading module to demonstrate concurrency by running two arithmetic operations, addition and multiplication, simultaneously on separate threads. The threads share the same memory space which allows both tasks to overlap in execution time and improve efficiency for time-based operations. The main challenge I encountered was understanding the difference between concurrency and parallelism as I initially got confused between multiprocessing, asyncio and threading. Through this, I learned that threading represents concurrency where tasks make progress together rather than running in separate processors.

**Al Jorome (Python Threading)** 
Creating the Bee Colony Simulation helped me deeply understand how concurrency works in real-world programming. By using Python’s threading module, I learned how multiple tasks can run at the same time without waiting for one another — just like bees in a hive working together toward a common goal. Each bee thread performed its own task independently, yet they all contributed to a shared resource, the nectar. This experience taught me the importance of synchronization, such as using locks to prevent conflicts when threads access shared data. Overall, this project showed me how concurrency makes programs more efficient, dynamic, and realistic — transforming simple code into something that feels alive and active. 🐝🍯

**Mark Anthony Hernandez (Thread Race Implementation):**
Implementing the visual thread race program was an exciting challenge that deepened my understanding of concurrent programming and thread synchronization. Creating the live progress tracking system taught me how to manage shared resources safely using multiple locks - the `position_lock` for updating racer positions and `result_lock` for recording final results. The most fascinating aspect was seeing how threads can run unpredictably; each race produces different winners despite using the same code, which perfectly demonstrates the non-deterministic nature of concurrent execution. Building the real-time visualization with progress bars updating every 300ms showed me how threading can be used for interactive applications, not just background processing. The biggest challenge was preventing race conditions when multiple threads tried to update the display simultaneously, which I solved using proper synchronization techniques. This project made me realize that effective concurrency programming isn't just about making threads run in parallel - it's about carefully orchestrating their interactions to create predictable, safe, and engaging user experiences. The visual feedback also made abstract threading concepts much more tangible and easier to understand.

---

## 🏥 BarangayCare: Full-Stack Healthcare Application

### Overview

BarangayCare is a comprehensive mobile healthcare application designed for barangay communities in the Philippines. This full-stack project demonstrates the practical application of programming language concepts learned throughout the course in a real-world healthcare management system.

### 📱 Application Features

The application enables patients to:
- **Register and authenticate** using Firebase authentication
- **Book doctor consultations** with real-time availability checking
- **Request medicines** from the barangay health center
- **Submit pre-screening forms** before consultations
- **Manage appointments** (view, cancel, track history)

### 🏗️ Technical Architecture

**Frontend:**
- **Framework**: Flutter (Dart)
- **State Management**: Provider pattern
- **Authentication**: Firebase Auth
- **Platforms**: Android, iOS, Web

**Backend:**
- **Framework**: Hono.js (Node.js)
- **Database**: MongoDB (NoSQL)
- **Authentication**: Firebase Admin SDK
- **API Design**: RESTful architecture

### 💡 Programming Concepts Applied

This project demonstrates the comprehensive application of course concepts:

#### 1. **Control Flow & Expressions**
- Complex conditional logic for appointment booking validation
- Nested if-else statements for medicine prescription checking
- Boolean expressions combining availability AND conflict checks
- Guard clauses for early return patterns

#### 2. **Subprograms & Modularity**
- **Backend Services**: Reusable functions (`checkAvailability`, `bookAppointment`, `requestMedicine`)
- **Flutter Services**: Separated API logic from UI components
- **Middleware Architecture**: Centralized authentication logic
- **Module Organization**: Clear separation of concerns across files

#### 3. **Concurrency & Parallel Execution**
- **Atomic Database Updates**: MongoDB `$inc` operator prevents race conditions
- **Double Booking Prevention**: Database-level uniqueness constraints
- **Stock Management**: Concurrent medicine requests handled safely
- **Multi-user Support**: Safe operations across simultaneous users

#### 4. **Data Abstraction**
- **API Layer**: Hides database complexity from frontend
- **Service Classes**: Abstract business logic from routes
- **Provider Pattern**: State management abstraction in Flutter
- **DTOs**: Data Transfer Objects for API contracts

#### 5. **Error Handling**
- Try-catch blocks for network and database errors
- Input validation and sanitization
- User-friendly error messages
- Graceful degradation strategies

### 🗂️ Project Structure

```
BarangayCare/
├── frontend/              # Flutter mobile application
│   ├── lib/
│   │   ├── config/       # Firebase & app configuration
│   │   ├── models/       # Data models
│   │   ├── providers/    # State management
│   │   ├── screens/      # UI screens
│   │   └── services/     # API services
│   ├── assets/           # Images and icons
│   └── test/             # Unit tests
│
├── backend/              # Hono.js API server
│   ├── src/
│   │   ├── config/      # Database & Firebase setup
│   │   ├── routes/      # API endpoint definitions
│   │   ├── services/    # Business logic layer
│   │   └── middleware/  # Authentication middleware
│   └── scripts/         # Database seeding scripts
│
└── Documentation files
```

### 🔧 Technical Implementation Highlights

**Backend Architecture:**
- **RESTful API Design**: Clean endpoint structure with proper HTTP methods
- **Middleware Chain**: Authentication → Validation → Business Logic → Response
- **Service Layer Pattern**: Separation of route handlers and business logic
- **MongoDB Integration**: NoSQL database with indexed queries for performance

**Frontend Architecture:**
- **Material Design**: Consistent UI following Material Design principles
- **Provider Pattern**: Reactive state management across the app
- **Service Abstraction**: HTTP requests centralized in service classes
- **Error Boundaries**: Graceful error handling with user-friendly messages

**Security Features:**
- Firebase JWT token validation on all protected endpoints
- Input sanitization to prevent injection attacks
- Password hashing and secure authentication
- CORS configuration for API access control

**Database Design:**
- **patients**: User profiles with Firebase UID mapping
- **doctors**: Doctor information with schedule arrays
- **appointments**: Booking records with status tracking
- **medicine_inventory**: Stock management with reorder levels
- **medicine_requests**: Request history and fulfillment tracking

### 🚀 Key Technical Features

1. **Firebase Integration**
   - Email/password authentication
   - Token-based API security
   - Real-time auth state management

2. **Database Design**
   - NoSQL schema with relationships
   - Optimized queries for performance
   - Atomic operations for data integrity

3. **API Architecture**
   - RESTful endpoint design
   - JWT token validation
   - Proper HTTP status codes
   - Request/response validation

4. **Flutter UI/UX**
   - Material Design components
   - Responsive layouts
   - Loading states and error handling
   - Form validation

### 📊 Phase 2 Enhancements (In Development)

The team is currently developing advanced features:

- **🚨 Emergency Hotlines** (Jorome): Quick access to emergency contacts
- **🤖 AI Chatbot Assistant** (Anthony): Health advice and navigation help
- **💊 Prescription Upload** (Larie): Image upload and approval workflow
- **📈 Health Analytics** (Agatha): Personal health tracking and insights

### 📖 Documentation

Comprehensive documentation available in the BarangayCare folder:
- [Complete System Documentation](./BarangayCare/README.md)
- [Local Setup Guide](./BarangayCare/LOCAL_SETUP.md)
- [Backend API Documentation](./BarangayCare/backend/README.md)
- [Frontend Documentation](./BarangayCare/frontend/README.md)
- [Team Task Assignments](./BarangayCare/TEAM_TASK_ASSIGNMENTS.md)
- [New Features Enhancement Plan](./BarangayCare/NEW_FEATURES_ENHANCEMENT.md)
- [Features Roadmap](./BarangayCare/FEATURES_ROADMAP.md)

### 🎯 Learning Outcomes

Through developing BarangayCare, the team demonstrated:
- **Full-stack development** skills across mobile and web technologies
- **Practical application** of programming language concepts
- **Team collaboration** using Git and project management tools
- **Real-world problem solving** for healthcare accessibility
- **Software engineering best practices** in production-quality code

---

## 📚 Documentation Repository

The `docs/` folder contains comprehensive project documentation that consolidates all learning activities and technical implementations from the Programming Languages course.

### 📄 Available Documentation

**FINAL_PROJECT_DOCUMENTATION_PL-TeamBA.pdf**
- Complete compilation of all programming language concepts explored
- Detailed analysis of each activity with code examples
- Team reflections and individual learning outcomes
- Technical specifications and architecture diagrams
- Comprehensive coverage of:
  - Token analysis and syntax/semantic errors
  - Variable scope and typing systems
  - Control flow structures (if-else, loops, expressions)
  - Subprograms, modularity, and abstraction
  - Concurrency models and parallel execution
  - BarangayCare application development

### 🎓 Documentation Purpose

This documentation serves multiple purposes:
1. **Academic Record**: Formal documentation of course activities and learning
2. **Technical Reference**: Detailed specifications for future development
3. **Portfolio Material**: Demonstrates programming concepts mastery
4. **Knowledge Transfer**: Enables future students to learn from implementations
5. **Project Archive**: Preserves complete project history and decisions

---

*This repository demonstrates our comprehensive understanding of programming language concepts through theoretical exploration, practical examples, and real-world application development.*
