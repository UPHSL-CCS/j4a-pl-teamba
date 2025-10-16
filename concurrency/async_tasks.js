/**
 * JavaScript Concurrency Example using Async/Await
 * Author: Larie Amimiorg
 * 
 * This program demonstrates concurrent execution using JavaScript's 
 * async/await pattern with Promises and setTimeout.
 * 
 * Two tasks run in parallel:
 * 1. Data processing simulation
 * 2. File upload simulation
 */

// Simulate a data processing task
async function processData(dataId) {
    console.log(`🔄 Starting data processing: ${dataId}`);
    
    // Simulate processing time using Promise with setTimeout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`✅ Completed data processing: ${dataId}`);
    return `Processed data from ${dataId}`;
}

// Simulate a file upload task
async function uploadFile(fileName) {
    console.log(`⬆️  Starting file upload: ${fileName}`);
    
    // Simulate upload time using Promise with setTimeout
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`✅ Completed file upload: ${fileName}`);
    return `Uploaded ${fileName}`;
}

// Main function to run tasks concurrently
async function runConcurrentTasks() {
    console.log("=== Starting Concurrent Tasks ===\n");
    
    const startTime = Date.now();
    
    // Run multiple tasks concurrently using Promise.all()
    const tasks = [
        processData("Dataset-1"),
        processData("Dataset-2"),
        uploadFile("document.pdf"),
        uploadFile("image.png")
    ];
    
    // Wait for all tasks to complete
    const results = await Promise.all(tasks);
    
    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log("\n=== All Tasks Completed ===");
    console.log(`Total execution time: ${totalTime} seconds`);
    console.log("\nResults:");
    results.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result}`);
    });
}

// Execute the concurrent tasks
runConcurrentTasks().catch(error => {
    console.error("Error occurred:", error);
});