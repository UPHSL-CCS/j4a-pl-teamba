/**
 * Main JavaScript File
 * Demonstrates modularity by importing and using the palindrome subprogram
 */

// Import the palindrome checker function
const isPalindrome = require('./palindrome.js');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Palindrome Checker\n");
console.log("Enter a word or phrase to check if it's a palindrome.");
console.log("Type 'Q' to stop.\n");

// Main input loop
rl.question("Enter text to check: ", function askForInput(input) {
    // Check if user wants to quit
    if (input.toLowerCase() === 'Q' || input.toLowerCase() === 'q') {
        console.log("\nExiting program...");
        rl.close();
        return;
    }
    
    // Check if input is empty
    if (input.trim() === '') {
        console.log("Please enter some text.\n");
        rl.question("Enter text to check: ", askForInput);
        return;
    }
    
    // Check palindrome and display result
    const result = isPalindrome(input);
    console.log(`"${input}" ${result ? "IS" : "is NOT"} a palindrome.\n`);
    
    // Ask for another input
    rl.question("Enter text to check: ", askForInput);
});
