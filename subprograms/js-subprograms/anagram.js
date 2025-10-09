/**
 * Anagram Checker Module
 * Author: Larie Amimiorg
 * 
 * This module provides a function to check if two strings are anagrams.
 * An anagram is a word or phrase formed by rearranging the letters of a different
 * word or phrase, using all the original letters exactly once.
 */

/**
 * Checks if two strings are anagrams of each other.
 * The function is case-insensitive and ignores spaces and punctuation.
 * 
 * @param {string} str1 - First string to compare
 * @param {string} str2 - Second string to compare
 * @return {boolean} True if the strings are anagrams, false otherwise
 */
function isAnagram(str1, str2) {
    // Input validation
    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
        throw new Error('Both inputs must be strings');
    }
    
    // Process strings: convert to lowercase and remove non-alphanumeric characters
    const cleanStr1 = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanStr2 = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Quick check: anagrams must have the same length
    if (cleanStr1.length !== cleanStr2.length) {
        return false;
    }
    
    // Count character frequencies in first string
    const charCount = {};
    for (let char of cleanStr1) {
        charCount[char] = (charCount[char] || 0) + 1;
    }
    
    // Verify character frequencies in second string
    for (let char of cleanStr2) {
        // If character doesn't exist or count becomes negative, not an anagram
        if (!charCount[char]) {
            return false;
        }
        charCount[char]--;
    }
    
    // If all counts are zero, strings are anagrams
    return true;
}

// Export the anagram checker function
module.exports = isAnagram;