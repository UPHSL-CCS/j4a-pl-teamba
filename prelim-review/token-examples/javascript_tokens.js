/*
JavaScript Token Examples
=========================

This file demonstrates different types of tokens in JavaScript:
- Keywords: Reserved words with special meaning
- Identifiers: Names for variables, functions, objects, etc.
- Literals: Fixed values in the source code
*/

// ===== KEYWORDS =====
// Reserved words that have special meaning in JavaScript
console.log("=== JAVASCRIPT KEYWORDS ===");

// Variable declaration keywords
var oldStyle = "var keyword";           // 'var' keyword (function-scoped)
let blockScoped = "let keyword";        // 'let' keyword (block-scoped)
const constant = "const keyword";       // 'const' keyword (immutable binding)

// Control flow keywords
if (true) {                             // 'if' keyword
    console.log("if statement");
} else if (false) {                     // 'else' keyword
    console.log("else if");
} else {                                // 'else' keyword
    console.log("else statement");
}

for (let i = 0; i < 3; i++) {           // 'for' keyword
    if (i === 2) {                      // 'if' keyword
        break;                          // 'break' keyword
    }
    continue;                           // 'continue' keyword (never reached)
}

while (false) {                         // 'while' keyword
    // Never executed
}

switch (1) {                            // 'switch' keyword
    case 1:                             // 'case' keyword
        console.log("case 1");
        break;
    default:                            // 'default' keyword
        console.log("default case");
}

// Function keywords
function regularFunction() {            // 'function' keyword
    return "regular function";          // 'return' keyword
}

const arrowFunction = () => {           // Arrow function (=&gt; operator)
    return "arrow function";
};

// Class keywords (ES6+)
class MyClass {                         // 'class' keyword
    constructor(value) {                // 'constructor' keyword
        this.value = value;             // 'this' keyword
    }
    
    static staticMethod() {             // 'static' keyword
        return "static method";
    }
}

// Exception handling keywords
try {                                   // 'try' keyword
    throw new Error("Test error");      // 'throw', 'new' keywords
} catch (error) {                       // 'catch' keyword
    console.log("Caught:", error.message);
} finally {                             // 'finally' keyword
    console.log("Finally block");
}

// Boolean keywords
let isTrue = true;                      // 'true' keyword
let isFalse = false;                    // 'false' keyword
let nothing = null;                     // 'null' keyword
let notDefined = undefined;             // 'undefined' keyword

console.log("JavaScript has many keywords including async, await, yield, etc.");

// ===== IDENTIFIERS =====
// Names used to identify variables, functions, objects, etc.
console.log("\n=== JAVASCRIPT IDENTIFIERS ===");

// Valid identifiers
let camelCaseVariable = 100;            // Camel case (JavaScript convention)
let _privateVariable = "hidden";        // Leading underscore
let $jqueryStyle = "dollar sign";       // Dollar sign allowed
let variable2 = "numbers allowed";      // Numbers allowed (not at start)
let PascalCaseClass = "class name";     // Pascal case for constructors
let π = 3.14159;                        // Unicode allowed

// Invalid identifiers (commented to avoid syntax errors):
// let 2variable = "invalid";           // Cannot start with number
// let my-variable = "invalid";         // Hyphen not allowed  
// let class = "invalid";               // Cannot use keywords
// let my variable = "invalid";         // Spaces not allowed

console.log(`Camel case variable: ${camelCaseVariable}`);
console.log(`Private variable: ${_privateVariable}`);
console.log(`jQuery style: ${$jqueryStyle}`);
console.log(`Unicode identifier π: ${π}`);

// ===== LITERALS =====
// Fixed values that appear directly in the source code
console.log("\n=== JAVASCRIPT LITERALS ===");

// Numeric literals
let integerLiteral = 42;                // Integer
let floatLiteral = 3.14159;             // Float
let binaryLiteral = 0b1010;             // Binary (decimal 10)
let octalLiteral = 0o12;                // Octal (decimal 10)
let hexLiteral = 0xA;                   // Hexadecimal (decimal 10)
let scientificLiteral = 1.23e-4;        // Scientific notation
let bigIntLiteral = 123n;               // BigInt literal

console.log(`Integer: ${integerLiteral}`);
console.log(`Float: ${floatLiteral}`);
console.log(`Binary 0b1010: ${binaryLiteral}`);
console.log(`Octal 0o12: ${octalLiteral}`);
console.log(`Hex 0xA: ${hexLiteral}`);
console.log(`Scientific 1.23e-4: ${scientificLiteral}`);
console.log(`BigInt: ${bigIntLiteral}`);

// String literals
let singleQuote = 'Hello';              // Single quotes
let doubleQuote = "World";              // Double quotes
let templateLiteral = `Hello ${camelCaseVariable}`;  // Template literal
let multilineString = `Multi-line
string literal`;                        // Multi-line template literal

console.log(`Single quote: ${singleQuote}`);
console.log(`Double quote: ${doubleQuote}`);
console.log(`Template literal: ${templateLiteral}`);

// Boolean literals
let boolTrue = true;                    // Boolean true
let boolFalse = false;                  // Boolean false

// Special literals
let nullValue = null;                   // null literal
let undefinedValue = undefined;         // undefined literal

// Object and Array literals
let arrayLiteral = [1, 2, 3, "mixed", true];           // Array literal
let objectLiteral = {                                   // Object literal
    key: "value",
    number: 42,
    nested: { inner: "object" }
};

console.log(`Array: ${JSON.stringify(arrayLiteral)}`);
console.log(`Object: ${JSON.stringify(objectLiteral)}`);

// Regular expression literal
let regexLiteral = /pattern/gi;         // RegExp literal
console.log(`Regex: ${regexLiteral}`);