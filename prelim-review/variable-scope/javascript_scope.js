/*
JavaScript Variable Scope Examples
==================================

This file demonstrates different types of variable scope in JavaScript:
- Global scope: Variables accessible throughout the entire program
- Function scope: Variables accessible only within a function (var)
- Block scope: Variables accessible only within a block (let, const)
- Module scope: Variables scoped to a module
*/

// ===== GLOBAL SCOPE =====
// Variables declared outside any function or block
console.log("=== GLOBAL SCOPE ===");

var globalVar = "I am global (var)";           // Global with var
let globalLet = "I am global (let)";           // Global with let
const globalConst = "I am global (const)";     // Global with const

function accessGlobal() {
    console.log(`Accessing global var: ${globalVar}`);
    console.log(`Accessing global let: ${globalLet}`);
    console.log(`Accessing global const: ${globalConst}`);
}

accessGlobal();

// ===== FUNCTION SCOPE (var) =====
console.log("\n=== FUNCTION SCOPE (var) ===");

function functionScopeDemo() {
    var functionScoped = "I am function-scoped with var";
    
    if (true) {
        var insideBlock = "var ignores block scope";  // Still function-scoped
        console.log(`Inside if block: ${functionScoped}`);
        console.log(`Inside if block: ${insideBlock}`);
    }
    
    // var variables are accessible throughout the entire function
    console.log(`Outside if block: ${insideBlock}`);  // This works with var
}

functionScopeDemo();

// Trying to access function-scoped variables outside will cause error
try {
    console.log(functionScoped);  // ReferenceError
} catch (error) {
    console.log(`Error: ${error.message}`);
}

// ===== BLOCK SCOPE (let, const) =====
console.log("\n=== BLOCK SCOPE (let, const) ===");

function blockScopeDemo() {
    let functionLevel = "I am at function level";
    
    if (true) {
        let blockScoped = "I am block-scoped with let";
        const alsoBlockScoped = "I am block-scoped with const";
        
        console.log(`Inside block - function level: ${functionLevel}`);
        console.log(`Inside block - block scoped: ${blockScoped}`);
        console.log(`Inside block - const: ${alsoBlockScoped}`);
    }
    
    // let/const variables are NOT accessible outside their block
    try {
        console.log(blockScoped);  // ReferenceError
    } catch (error) {
        console.log(`Block scope error: ${error.message}`);
    }
}

blockScopeDemo();

// ===== VARIABLE HOISTING =====
console.log("\n=== VARIABLE HOISTING ===");

function hoistingDemo() {
    console.log(`var before declaration: ${hoistedVar}`);  // undefined (hoisted)
    
    try {
        console.log(`let before declaration: ${hoistedLet}`);  // ReferenceError
    } catch (error) {
        console.log(`let hoisting error: ${error.message}`);
    }
    
    var hoistedVar = "var is hoisted and initialized with undefined";
    let hoistedLet = "let is hoisted but not initialized (temporal dead zone)";
    
    console.log(`After declarations: ${hoistedVar}`);
    console.log(`After declarations: ${hoistedLet}`);
}

hoistingDemo();

// ===== VARIABLE SHADOWING =====
console.log("\n=== VARIABLE SHADOWING ===");

let shadowMe = "I am global";

function shadowDemo() {
    let shadowMe = "I shadow the global variable";  // Shadows global
    console.log(`Inside function: ${shadowMe}`);
    
    if (true) {
        let shadowMe = "I shadow the function variable";  // Shadows function-level
        console.log(`Inside block: ${shadowMe}`);
    }
    
    console.log(`Back in function: ${shadowMe}`);  // Function-level value
}

shadowDemo();
console.log(`Back in global: ${shadowMe}`);  // Global value unchanged

// ===== CLOSURE AND SCOPE =====
console.log("\n=== CLOSURE AND SCOPE ===");

function outerFunction(outerParam) {
    let outerVariable = "I am in outer function";
    
    function innerFunction(innerParam) {
        let innerVariable = "I am in inner function";
        
        // Inner function has access to all outer scopes
        console.log(`Inner - inner param: ${innerParam}`);
        console.log(`Inner - inner variable: ${innerVariable}`);
        console.log(`Inner - outer param: ${outerParam}`);
        console.log(`Inner - outer variable: ${outerVariable}`);
        console.log(`Inner - global: ${globalVar}`);
    }
    
    return innerFunction;  // Return function that closes over outer scope
}

const closureFunction = outerFunction("outer parameter");
closureFunction("inner parameter");

// ===== IMMEDIATELY INVOKED FUNCTION EXPRESSION (IIFE) =====
console.log("\n=== IIFE AND SCOPE ===");

// IIFE creates its own scope to avoid polluting global scope
(function() {
    var iifeVariable = "I am isolated in IIFE";
    let iifeBlockScoped = "Also isolated";
    
    console.log(`Inside IIFE: ${iifeVariable}`);
    console.log(`Inside IIFE: ${iifeBlockScoped}`);
})();

// IIFE variables are not accessible outside
try {
    console.log(iifeVariable);  // ReferenceError
} catch (error) {
    console.log(`IIFE isolation: ${error.message}`);
}

// ===== THIS KEYWORD AND SCOPE =====
console.log("\n=== THIS KEYWORD AND SCOPE ===");

const obj = {
    name: "Object",
    regularMethod: function() {
        console.log(`Regular method this.name: ${this.name}`);
        
        // Nested function loses 'this' context
        function nestedFunction() {
            console.log(`Nested function this: ${this}`);  // undefined in strict mode
        }
        nestedFunction();
        
        // Arrow function preserves 'this' context
        const arrowFunction = () => {
            console.log(`Arrow function this.name: ${this.name}`);
        };
        arrowFunction();
    },
    
    arrowMethod: () => {
        // Arrow functions don't have their own 'this'
        console.log(`Arrow method this: ${this}`);  // Global object or undefined
    }
};

obj.regularMethod();
obj.arrowMethod();

// ===== BEST PRACTICES =====
console.log("\n=== SCOPE BEST PRACTICES ===");

// 1. Use const by default, let when reassignment needed, avoid var
const config = { api: "https://api.example.com" };
let counter = 0;

// 2. Keep variables in the smallest scope possible
function processData(data) {
    if (data && data.length > 0) {
        const processedData = data.map(item => item.toUpperCase());  // Block scope
        return processedData;
    }
    return [];
}

// 3. Use meaningful names and avoid global pollution
function createCalculator() {
    let result = 0;  // Encapsulated state
    
    return {
        add: (num) => result += num,
        subtract: (num) => result -= num,
        getResult: () => result,
        reset: () => result = 0
    };
}

const calculator = createCalculator();
calculator.add(10);
calculator.subtract(3);
console.log(`Calculator result: ${calculator.getResult()}`);

console.log("\nScope determines where variables can be accessed in JavaScript!");