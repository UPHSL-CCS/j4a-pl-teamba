/**
 * Palindrome Checker Function
 * Checks if a given string is a palindrome (reads the same forwards and backwards)
 * Ignores case, spaces, and special characters for more practical use
 */

function isPalindrome(str) {
    // Convert to lowercase and remove non-alphanumeric characters
    const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Compare the string with its reverse
    const reversed = normalized.split('').reverse().join('');
    return normalized === reversed;
}

// Export the function for use in other modules
module.exports = isPalindrome;