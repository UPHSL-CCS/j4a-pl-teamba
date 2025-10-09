/**
 * Main JavaScript File
 * Demonstrates modularity by importing and using multiple subprograms
 * Author: Updated by Larie Amimiorg
 */

// Import the subprogram modules
const isPalindrome = require('./palindrome.js');
const isAnagram = require('./anagram.js');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to display the main menu
function displayMenu() {
    console.log("\n=== String Pattern Checker ===");
    console.log("1. Check if a string is a palindrome");
    console.log("2. Check if two strings are anagrams");
    console.log("3. Exit");
    rl.question("\nEnter your choice (1-3): ", handleMenuChoice);
}

// Function to handle menu choice
function handleMenuChoice(choice) {
    switch (choice) {
        case '1':
            checkPalindrome();
            break;
        case '2':
            checkAnagram();
            break;
        case '3':
            console.log("\nExiting program...");
            rl.close();
            break;
        default:
            console.log("Invalid choice. Please enter 1, 2, or 3.");
            displayMenu();
    }
}

// Function to check palindromes
function checkPalindrome() {
    console.log("\n--- Palindrome Checker ---");
    console.log("A palindrome reads the same backward as forward.");
    
    rl.question("Enter text to check: ", function(input) {
        // Check if input is empty
        if (input.trim() === '') {
            console.log("Please enter some text.");
            checkPalindrome();
            return;
        }
        
        // Check palindrome and display result
        try {
            const result = isPalindrome(input);
            console.log(`"${input}" ${result ? "IS" : "is NOT"} a palindrome.`);
            
            // Return to main menu
            displayMenu();
        } catch (error) {
            console.log(`Error: ${error.message}`);
            displayMenu();
        }
    });
}

// Function to check anagrams
function checkAnagram() {
    console.log("\n--- Anagram Checker ---");
    console.log("Anagrams are words/phrases with the same letters rearranged.");
    
    rl.question("Enter first string: ", function(str1) {
        if (str1.trim() === '') {
            console.log("Please enter some text.");
            checkAnagram();
            return;
        }
        
        rl.question("Enter second string: ", function(str2) {
            if (str2.trim() === '') {
                console.log("Please enter some text.");
                checkAnagram();
                return;
            }
            
            // Check anagram and display result
            try {
                const result = isAnagram(str1, str2);
                console.log(`"${str1}" and "${str2}" ${result ? "ARE" : "are NOT"} anagrams.`);
                
                // Return to main menu
                displayMenu();
            } catch (error) {
                console.log(`Error: ${error.message}`);
                displayMenu();
            }
        });
    });
}

// Start the program
console.log("Welcome to the String Pattern Checker!");
displayMenu();
