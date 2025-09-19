/*
JavaScript Examples: Syntax vs Semantic Errors
==============================================

This file demonstrates the difference between syntax errors and semantic errors
in JavaScript programming language.
*/

// ===== SYNTAX ERRORS =====
// These are caught by the JavaScript parser before execution
// They violate the grammar rules of the language

console.log("=== SYNTAX ERROR EXAMPLES ===");

// Example 1: Missing closing brace
// function test() {
//     console.log("Missing closing brace");
// // SyntaxError: Unexpected end of input

// Example 2: Invalid variable declaration
// var 123invalid = "test";  // SyntaxError: Unexpected number

// Example 3: Missing closing quote
// console.log("Missing quote);  // SyntaxError: Unterminated string literal

// Example 4: Invalid object syntax
// let obj = { key: value, };  // SyntaxError if value is undefined

console.log("Syntax errors prevent JavaScript from parsing");

// ===== SEMANTIC ERRORS =====
// These occur during runtime - syntax is correct but logic/meaning is wrong

console.log("\n=== SEMANTIC ERROR EXAMPLES ===");

// Example 1: Calling undefined function (ReferenceError)
try {
    undefinedFunction();  // This will throw ReferenceError
} catch (error) {
    console.log(`Semantic Error: ${error.name} - ${error.message}`);
}

// Example 2: Accessing property of null/undefined (TypeError)
try {
    let nullValue = null;
    console.log(nullValue.property);  // This will throw TypeError
} catch (error) {
    console.log(`Semantic Error: ${error.name} - ${error.message}`);
}

// Example 3: Using undefined variable (ReferenceError)
try {
    console.log(undefinedVariable);  // This will throw ReferenceError
} catch (error) {
    console.log(`Semantic Error: ${error.name} - ${error.message}`);
}

// Example 4: Array index out of bounds (returns undefined, not error in JS)
let myArray = [1, 2, 3];
console.log(`Array index out of bounds: ${myArray[10]}`); // Returns undefined

// Example 5: Type coercion confusion (not an error but semantic issue)
console.log("Type coercion examples (semantic issues):");
console.log(`"5" + 3 = ${"5" + 3}`);        // "53" (string concatenation)
console.log(`"5" - 3 = ${"5" - 3}`);        // 2 (numeric subtraction)
console.log(`true + 1 = ${true + 1}`);      // 2 (boolean to number)

console.log("\nSemantic errors occur during program execution");