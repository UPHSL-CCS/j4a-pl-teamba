/*
JavaScript Typing System Examples
=================================

This file demonstrates JavaScript's typing system characteristics:
- Dynamic typing: Types are determined at runtime
- Weak typing: Extensive implicit type coercion/conversion
- Type coercion rules: How JavaScript converts between types
- Comparison with strong typing languages
*/

// ===== DYNAMIC TYPING =====
console.log("=== DYNAMIC TYPING ===");

// Variables can hold different types during execution
let dynamicVar = 42;                    // Number
console.log(`dynamicVar as number: ${dynamicVar}, type: ${typeof dynamicVar}`);

dynamicVar = "Now I'm a string";        // String
console.log(`dynamicVar as string: ${dynamicVar}, type: ${typeof dynamicVar}`);

dynamicVar = [1, 2, 3];                // Array (object)
console.log(`dynamicVar as array: ${dynamicVar}, type: ${typeof dynamicVar}`);

dynamicVar = { key: "value" };          // Object
console.log(`dynamicVar as object: ${JSON.stringify(dynamicVar)}, type: ${typeof dynamicVar}`);

dynamicVar = true;                      // Boolean
console.log(`dynamicVar as boolean: ${dynamicVar}, type: ${typeof dynamicVar}`);

// ===== WEAK TYPING (IMPLICIT COERCION) =====
console.log("\n=== WEAK TYPING (IMPLICIT COERCION) ===");

// JavaScript performs automatic type conversions
console.log("Automatic type conversions:");

// String + Number = String concatenation
console.log(`"5" + 3 = "${5 + 3}" (string concatenation)`);
console.log(`"Hello" + 42 = "${"Hello" + 42}"`);

// String - Number = Numeric subtraction
console.log(`"5" - 3 = ${"5" - 3} (numeric subtraction)`);
console.log(`"10" * "2" = ${"10" * "2"} (numeric multiplication)`);
console.log(`"15" / "3" = ${"15" / "3"} (numeric division)`);

// Boolean arithmetic
console.log(`true + 1 = ${true + 1} (boolean to number)`);
console.log(`false * 5 = ${false * 5} (boolean to number)`);
console.log(`"5" - true = ${"5" - true} (both to numbers)`);

// Null and undefined coercion
console.log(`null + 1 = ${null + 1} (null becomes 0)`);
console.log(`undefined + 1 = ${undefined + 1} (undefined becomes NaN)`);

// ===== TYPE COERCION RULES =====
console.log("\n=== TYPE COERCION RULES ===");

console.log("String coercion (+ operator with string):");
console.log(`5 + "3" = ${5 + "3"}`);
console.log(`true + " value" = ${true + " value"}`);
console.log(`null + " value" = ${null + " value"}`);
console.log(`undefined + " value" = ${undefined + " value"}`);

console.log("\nNumeric coercion (arithmetic operators):");
console.log(`"5" - "3" = ${"5" - "3"}`);
console.log(`"5" * "3" = ${"5" * "3"}`);
console.log(`"hello" - 3 = ${"hello" - 3} (NaN)`);
console.log(`true - false = ${true - false}`);

console.log("\nBoolean coercion (logical contexts):");
console.log(`Boolean("") = ${Boolean("")} (empty string is falsy)`);
console.log(`Boolean("hello") = ${Boolean("hello")} (non-empty string is truthy)`);
console.log(`Boolean(0) = ${Boolean(0)} (zero is falsy)`);
console.log(`Boolean(42) = ${Boolean(42)} (non-zero number is truthy)`);
console.log(`Boolean([]) = ${Boolean([])} (empty array is truthy!)`);
console.log(`Boolean({}) = ${Boolean({})} (empty object is truthy)`);

// ===== EQUALITY AND COMPARISON =====
console.log("\n=== EQUALITY AND COMPARISON ===");

console.log("Loose equality (==) with type coercion:");
console.log(`5 == "5": ${5 == "5"} (number vs string)`);
console.log(`true == 1: ${true == 1} (boolean vs number)`);
console.log(`false == 0: ${false == 0} (boolean vs number)`);
console.log(`null == undefined: ${null == undefined} (special case)`);
console.log(`"" == 0: ${"" == 0} (empty string vs number)`);

console.log("\nStrict equality (===) without coercion:");
console.log(`5 === "5": ${5 === "5"} (different types)`);
console.log(`true === 1: ${true === 1} (different types)`);
console.log(`null === undefined: ${null === undefined} (different types)`);

// ===== PROBLEMATIC COERCION EXAMPLES =====
console.log("\n=== PROBLEMATIC COERCION EXAMPLES ===");

console.log("JavaScript's quirky coercions:");
console.log(`[] + [] = "${[] + []}" (empty string)`);
console.log(`[] + {} = "${[] + {}}" (string representation)`);
console.log(`{} + [] = ${eval('({}) + []')} (depends on context)`);

console.log(`"2" + "1" = "${"2" + "1"}" (string concatenation)`);
console.log(`"2" - "1" = ${"2" - "1"} (numeric subtraction)`);

console.log(`[1, 2] + [3, 4] = "${[1, 2] + [3, 4]}" (array to string)`);

// NaN comparisons
console.log(`NaN == NaN: ${NaN == NaN} (NaN is not equal to itself)`);
console.log(`NaN === NaN: ${NaN === NaN} (even with strict equality)`);
console.log(`Number.isNaN(NaN): ${Number.isNaN(NaN)} (proper way to check)`);

// ===== TYPE CHECKING IN JAVASCRIPT =====
console.log("\n=== TYPE CHECKING IN JAVASCRIPT ===");

function checkTypes(value) {
    console.log(`Value: ${value}`);
    console.log(`  typeof: ${typeof value}`);
    console.log(`  Array.isArray(): ${Array.isArray(value)}`);
    console.log(`  instanceof Object: ${value instanceof Object}`);
    console.log(`  Object.prototype.toString.call(): ${Object.prototype.toString.call(value)}`);
}

checkTypes(42);
checkTypes("hello");
checkTypes([1, 2, 3]);
checkTypes({key: "value"});
checkTypes(null);

// ===== DEFENSIVE PROGRAMMING =====
console.log("\n=== DEFENSIVE PROGRAMMING ===");

function safeAdd(a, b) {
    // Convert to numbers explicitly to avoid string concatenation
    const numA = Number(a);
    const numB = Number(b);
    
    if (isNaN(numA) || isNaN(numB)) {
        throw new TypeError("Both arguments must be convertible to numbers");
    }
    
    return numA + numB;
}

console.log("Safe addition function:");
console.log(`safeAdd(5, 3) = ${safeAdd(5, 3)}`);
console.log(`safeAdd("5", "3") = ${safeAdd("5", "3")}`);

try {
    console.log(safeAdd("hello", "world"));
} catch (error) {
    console.log(`Error: ${error.message}`);
}

// ===== TYPESCRIPT COMPARISON =====
console.log("\n=== TYPESCRIPT COMPARISON ===");

// This is how TypeScript would prevent type errors:
console.log("TypeScript adds static typing to JavaScript:");
console.log("// TypeScript code (won't run in plain JavaScript):");
console.log("// function add(x: number, y: number): number {");
console.log("//     return x + y;");
console.log("// }");
console.log("// add(5, 3);     // OK");
console.log("// add('5', 3);   // TypeScript Error!");

// ===== COMPARISON WITH STRONG TYPING =====
console.log("\n=== COMPARISON: JavaScript (Weak) vs Python (Strong) ===");

console.log("JavaScript weak typing examples:");
console.log(`  "5" + 3 = "${"5" + 3}" (automatic coercion)`);
console.log(`  "5" - 3 = ${"5" - 3} (automatic coercion)`);
console.log(`  true + 1 = ${true + 1} (automatic coercion)`);
console.log(`  [] == false: ${[] == false} (complex coercion rules)`);

console.log("\nPython strong typing (would throw errors):");
console.log("  '5' + 3 → TypeError");
console.log("  '5' - 3 → TypeError");
console.log("  Must use: int('5') + 3 or '5' + str(3)");

// ===== BEST PRACTICES =====
console.log("\n=== BEST PRACTICES FOR WEAK TYPING ===");

console.log("1. Use strict equality (===) instead of loose equality (==)");
console.log(`   5 === "5": ${5 === "5"} (recommended)`);
console.log(`   5 == "5": ${5 == "5"} (avoid)`);

console.log("\n2. Explicit type conversion:");
const userInput = "42";
const explicitNumber = parseInt(userInput, 10);
console.log(`   parseInt("42", 10) = ${explicitNumber}`);

console.log("\n3. Type checking before operations:");
function multiplyIfNumbers(a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
        return a * b;
    }
    throw new TypeError('Both arguments must be numbers');
}

console.log(`   multiplyIfNumbers(6, 7) = ${multiplyIfNumbers(6, 7)}`);

console.log("\nJavaScript's weak typing can be powerful but requires careful handling!");