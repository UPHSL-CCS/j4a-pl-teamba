/*
JavaScript Arithmetic and Logical Expressions
============================================

This file demonstrates the syntax and usage of arithmetic and logical expressions in JavaScript.
Author: Antonio (Team Member)
*/

console.log("=== JAVASCRIPT ARITHMETIC AND LOGICAL EXPRESSIONS ===\n");

// =====================
// ARITHMETIC EXPRESSIONS
// =====================

console.log("--- ARITHMETIC EXPRESSIONS ---");

// Basic arithmetic operators
let a = 15;
let b = 4;

console.log(`\nBasic Arithmetic with a = ${a}, b = ${b}:`);
console.log(`Addition (a + b): ${a + b}`);
console.log(`Subtraction (a - b): ${a - b}`);
console.log(`Multiplication (a * b): ${a * b}`);
console.log(`Division (a / b): ${a / b}`);
console.log(`Modulus (a % b): ${a % b}`);
console.log(`Exponentiation (a ** b): ${a ** b}`);

// Increment and decrement operators
console.log(`\nIncrement/Decrement Operators:`);
let x = 10;
console.log(`Initial x: ${x}`);
console.log(`Pre-increment (++x): ${++x}`);
console.log(`Post-increment (x++): ${x++}`);
console.log(`After post-increment x: ${x}`);
console.log(`Pre-decrement (--x): ${--x}`);
console.log(`Post-decrement (x--): ${x--}`);
console.log(`After post-decrement x: ${x}`);

// Assignment operators
console.log(`\nAssignment Operators:`);
let num = 20;
console.log(`Initial num: ${num}`);
num += 5;  // num = num + 5
console.log(`After num += 5: ${num}`);
num -= 3;  // num = num - 3
console.log(`After num -= 3: ${num}`);
num *= 2;  // num = num * 2
console.log(`After num *= 2: ${num}`);
num /= 4;  // num = num / 4
console.log(`After num /= 4: ${num}`);
num %= 7;  // num = num % 7
console.log(`After num %= 7: ${num}`);

// Complex arithmetic expressions
console.log(`\nComplex Arithmetic Expressions:`);
let result1 = (5 + 3) * 2 - 4 / 2;
console.log(`(5 + 3) * 2 - 4 / 2 = ${result1}`);

let result2 = Math.pow(3, 2) + Math.sqrt(16) - Math.abs(-5);
console.log(`3^2 + √16 - |-5| = ${result2}`);

// =====================
// LOGICAL EXPRESSIONS
// =====================

console.log("\n--- LOGICAL EXPRESSIONS ---");

// Comparison operators
console.log(`\nComparison Operators with a = ${a}, b = ${b}:`);
console.log(`Equal (a == b): ${a == b}`);
console.log(`Strict equal (a === b): ${a === b}`);
console.log(`Not equal (a != b): ${a != b}`);
console.log(`Strict not equal (a !== b): ${a !== b}`);
console.log(`Greater than (a > b): ${a > b}`);
console.log(`Less than (a < b): ${a < b}`);
console.log(`Greater than or equal (a >= b): ${a >= b}`);
console.log(`Less than or equal (a <= b): ${a <= b}`);

// Logical operators
console.log(`\nLogical Operators:`);
let isTrue = true;
let isFalse = false;

console.log(`isTrue: ${isTrue}, isFalse: ${isFalse}`);
console.log(`Logical AND (isTrue && isFalse): ${isTrue && isFalse}`);
console.log(`Logical OR (isTrue || isFalse): ${isTrue || isFalse}`);
console.log(`Logical NOT (!isTrue): ${!isTrue}`);
console.log(`Logical NOT (!isFalse): ${!isFalse}`);

// Complex logical expressions
console.log(`\nComplex Logical Expressions:`);
let age = 25;
let hasLicense = true;
let hasInsurance = false;

console.log(`age: ${age}, hasLicense: ${hasLicense}, hasInsurance: ${hasInsurance}`);

let canDrive = age >= 18 && hasLicense;
console.log(`Can drive (age >= 18 && hasLicense): ${canDrive}`);

let canRentCar = age >= 21 && hasLicense && hasInsurance;
console.log(`Can rent car (age >= 21 && hasLicense && hasInsurance): ${canRentCar}`);

let needsDocuments = !hasLicense || !hasInsurance;
console.log(`Needs documents (!hasLicense || !hasInsurance): ${needsDocuments}`);

// =====================
// EXPRESSIONS IN CONTROL FLOW
// =====================

console.log("\n--- EXPRESSIONS IN CONTROL FLOW ---");

// Using expressions in if statements
console.log(`\nUsing expressions in if statements:`);
let score = 85;
let bonus = 10;
let finalScore = score + bonus;

if (finalScore > 90 && score >= 80) {
    console.log(`Excellent! Final score: ${finalScore}`);
} else if (finalScore >= 80 || bonus > 5) {
    console.log(`Good! Final score: ${finalScore}`);
} else {
    console.log(`Needs improvement. Final score: ${finalScore}`);
}

// Using expressions in loops
console.log(`\nUsing expressions in loops:`);
console.log("Even numbers from 2 to 10:");
for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) {
        console.log(`${i} is even`);
    }
}

// Ternary operator (conditional expression)
console.log(`\nTernary Operator (Conditional Expression):`);
let temperature = 25;
let weather = temperature > 20 ? "warm" : "cold";
console.log(`Temperature: ${temperature}°C - It's ${weather}`);

let status = age >= 18 ? (age >= 65 ? "senior" : "adult") : "minor";
console.log(`Age: ${age} - Status: ${status}`);

// Short-circuit evaluation
console.log(`\nShort-circuit Evaluation:`);
let user = { name: "John", email: null };
let displayEmail = user.email || "No email provided";
console.log(`Display email: ${displayEmail}`);

let greeting = user.name && `Hello, ${user.name}!`;
console.log(`Greeting: ${greeting}`);

console.log("\n=== END OF JAVASCRIPT EXPRESSIONS DEMO ===");