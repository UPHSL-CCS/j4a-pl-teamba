/*
JavaScript Loops Examples
========================

This file demonstrates the syntax and usage of various loop constructs in JavaScript.
*/

console.log("=== JAVASCRIPT LOOPS EXAMPLES ===\n");

// Example 1: Basic for loop
console.log("Example 1: Basic for loop (counting 1 to 5)");
for (let i = 1; i <= 5; i++) {
    console.log(`Count: ${i}`);
}

// Example 2: for...of loop (modern array iteration)
console.log("\nExample 2: For...of loop (iterating over array values)");
const teamba = ["mark", "larie", "agatha", "jorome"];
for (const member of teamba) {
    console.log(`Member: ${member}`);
}

// Example 3: Basic while loop
console.log("\nExample 3: Basic while loop (countdown from 5)");
let countdown = 5;
while (countdown > 0) {
    console.log(`Countdown: ${countdown}`);
    countdown--;
}
console.log("Time's up :P");

// Example 4: do...while loop (executes at least once)
console.log("\nExample 4: Do...while loop (executes at least once)");
let userInput = 0;
do {
    console.log(`Processing input: ${userInput}`);
    userInput++;
} while (userInput < 3);

// Example 5: Loop with break and continue (control flow)
console.log("\nExample 5: Loop with break and continue statements");
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("Processing numbers (skip 2, stop at 5):");
for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === 2) {
        console.log("Skipping 2");
        continue; // Skip this iteration
    }
    if (numbers[i] === 5) {
        console.log("Stopping at 5");
        break; // Exit the loop
    }
    console.log(`Number: ${numbers[i]}`);
}