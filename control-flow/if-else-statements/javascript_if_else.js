/*
JavaScript If-Else Statement Examples
====================================

This file demonstrates the syntax and usage of if-else statements in JavaScript.
Author: Larie Amimiorg
*/

console.log("=== JAVASCRIPT IF-ELSE EXAMPLES ===\n");

// Example 1: Basic if-else
let num = 7;
console.log(`Example 1: Testing if ${num} is even or odd`);
if (num % 2 === 0) {
    console.log(`${num} is even`);
} else {
    console.log(`${num} is odd`);
}

// Example 2: if-else if-else chain
let grade = 85;
console.log(`\nExample 2: Grading a score of ${grade}`);
if (grade >= 90) {
    console.log("Grade: A");
} else if (grade >= 80) {
    console.log("Grade: B");
} else if (grade >= 70) {
    console.log("Grade: C");
} else if (grade >= 60) {
    console.log("Grade: D");
} else {
    console.log("Grade: F");
}

// Example 3: Nested if-else
let hour = 14;
let isWeekend = true;
console.log(`\nExample 3: Determining activity for hour ${hour} on ${isWeekend ? "weekend" : "weekday"}`);
if (isWeekend) {
    if (hour < 12) {
        console.log("Sleep in");
    } else {
        console.log("Go outside");
    }
} else {
    if (hour < 9) {
        console.log("Get ready for work");
    } else if (hour < 17) {
        console.log("At work");
    } else {
        console.log("Relax at home");
    }
}

// Example 4: Ternary operator (shorthand if-else)
let age = 20;
let canVote = age >= 18 ? "Yes" : "No";
console.log(`\nExample 4: Can a person aged ${age} vote? ${canVote}`);

// Example 5: Truthy and falsy values
let username = "";
console.log("\nExample 5: Testing truthy and falsy values");
if (username) {
    console.log("Username is provided");
} else {
    console.log("Username is empty");
}

// Example 6: Logical operators in conditions
let hasPermission = true;
let isAdmin = false;
console.log("\nExample 6: Testing combined conditions");
if (hasPermission && isAdmin) {
    console.log("Full access granted");
} else if (hasPermission || isAdmin) {
    console.log("Partial access granted");
} else {
    console.log("Access denied");
}

// Output a conclusion
console.log("\nJavaScript if-else statements are fundamental for controlling program flow and making decisions in code.");