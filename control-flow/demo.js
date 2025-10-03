#!/usr/bin/env node

/*
Control Flow Demo - Live Presentation
=====================================

This script demonstrates the key differences between JavaScript and Python
control flow constructs for the class presentation.

Run with: node demo.js
*/

console.log("🚀 TEAMBA CONTROL FLOW DEMO 🚀\n");
console.log("=" .repeat(50));

// Demo 1: If-else with type differences
console.log("\n📋 DEMO 1: IF-ELSE WITH TYPE COERCION");
console.log("-".repeat(40));

function demonstrateTypeCoercion() {
    const testValue = "5";
    const number = 5;
    
    console.log(`JavaScript: Testing "${testValue}" == ${number}`);
    if (testValue == number) {
        console.log("✅ Loose equality (==): true - JavaScript coerces types!");
    }
    
    console.log(`JavaScript: Testing "${testValue}" === ${number}`);
    if (testValue === number) {
        console.log("✅ Strict equality (===): true");
    } else {
        console.log("❌ Strict equality (===): false - No type coercion!");
    }
    
    console.log("\n🐍 Python equivalent would be:");
    console.log(`"5" == 5  # Always False - no automatic coercion`);
    console.log(`int("5") == 5  # True - explicit conversion required`);
}

demonstrateTypeCoercion();

// Demo 2: Loops with different syntax
console.log("\n📋 DEMO 2: LOOP SYNTAX DIFFERENCES");
console.log("-".repeat(40));

function demonstrateLoops() {
    console.log("🟨 JavaScript for loop:");
    console.log("for (let i = 0; i < 3; i++) { ... }");
    for (let i = 0; i < 3; i++) {
        console.log(`  Iteration ${i + 1}`);
    }
    
    console.log("\n🐍 Python equivalent:");
    console.log("for i in range(3):");
    console.log("    print(f'Iteration {i + 1}')");
    
    console.log("\n🟨 JavaScript array iteration:");
    const members = ["Mark", "Larie", "Agatha", "Jorome"];
    console.log("for (const member of members) { ... }");
    for (const member of members) {
        console.log(`  TeamBa member: ${member}`);
    }
    
    console.log("\n🐍 Python equivalent:");
    console.log("for member in members:");
    console.log("    print(f'TeamBa member: {member}')");
}

demonstrateLoops();

// Demo 3: Expressions and operators
console.log("\n📋 DEMO 3: ARITHMETIC EXPRESSIONS");
console.log("-".repeat(40));

function demonstrateExpressions() {
    console.log("🟨 JavaScript arithmetic:");
    const a = 15, b = 4;
    console.log(`${a} / ${b} = ${a / b} (always float division)`);
    console.log(`${a} % ${b} = ${a % b} (modulus)`);
    
    console.log("\n🐍 Python has additional operators:");
    console.log(`${a} // ${b} = ${Math.floor(a / b)} (floor division - JS equivalent using Math.floor)`);
    console.log(`${a} ** ${b} = ${a ** b} (exponentiation - same in both)`);
    
    console.log("\n🟨 JavaScript type coercion in arithmetic:");
    console.log(`"5" + 3 = ${"5" + 3} (string concatenation)`);
    console.log(`"5" - 3 = ${"5" - 3} (numeric subtraction - coerces to number)`);
    
    console.log("\n🐍 Python would require explicit conversion:");
    console.log(`"5" + "3" = "53" (string concatenation)`);
    console.log(`int("5") + 3 = 8 (explicit conversion required)`);
}

demonstrateExpressions();

// Demo 4: Logical expressions
console.log("\n📋 DEMO 4: LOGICAL EXPRESSIONS");
console.log("-".repeat(40));

function demonstrateLogical() {
    console.log("🟨 JavaScript logical operators:");
    const isTrue = true, isFalse = false;
    console.log(`true && false = ${isTrue && isFalse}`);
    console.log(`true || false = ${isTrue || isFalse}`);
    console.log(`!true = ${!isTrue}`);
    
    console.log("\n🐍 Python uses words instead of symbols:");
    console.log(`True and False = False`);
    console.log(`True or False = True`);
    console.log(`not True = False`);
    
    console.log("\n🟨 JavaScript truthy/falsy values:");
    const values = [0, "", null, undefined, false, "hello", 1];
    values.forEach(val => {
        console.log(`Boolean(${JSON.stringify(val)}) = ${Boolean(val)}`);
    });
    
    console.log("\n🐍 Python has similar but slightly different truthy/falsy rules");
}

demonstrateLogical();

// Demo 5: Unique features
console.log("\n📋 DEMO 5: UNIQUE LANGUAGE FEATURES");
console.log("-".repeat(40));

function demonstrateUniqueFeatures() {
    console.log("🟨 JavaScript has increment operators:");
    let x = 5;
    console.log(`x = ${x}`);
    console.log(`++x = ${++x} (pre-increment)`);
    console.log(`x++ = ${x++} (post-increment, x is now ${x})`);
    
    console.log("\n🐍 Python doesn't have ++/-- operators, but has:");
    console.log("Chained comparisons: 1 < x < 10");
    console.log("List comprehensions: [x**2 for x in range(5)]");
    console.log("Multiple assignment: a, b = 1, 2");
    
    console.log("\n🟨 JavaScript has ternary operator:");
    const age = 20;
    const status = age >= 18 ? "adult" : "minor";
    console.log(`${age} >= 18 ? "adult" : "minor" = "${status}"`);
    
    console.log("\n🐍 Python has conditional expressions:");
    console.log(`"adult" if age >= 18 else "minor"`);
}

demonstrateUniqueFeatures();

console.log("\n" + "=".repeat(50));
console.log("🎯 KEY TAKEAWAYS:");
console.log("1. JavaScript: Flexible with automatic type coercion");
console.log("2. Python: Explicit and readable with strict typing");
console.log("3. Both support similar control flow concepts with different syntax");
console.log("4. Each language has unique features suited to different use cases");
console.log("\n✨ Thank you for watching TeamBa's presentation! ✨");