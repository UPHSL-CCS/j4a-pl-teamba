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

// Simulate a data processing task with error handling
async function processData(dataId) {
    console.log(`🔄 Starting data processing: ${dataId}`);
    
    try {
        // Simulate processing time using Promise with setTimeout
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(`✅ Completed data processing: ${dataId}`);
        return `Processed data from ${dataId}`;
    } catch (error) {
        console.error(`❌ Error processing ${dataId}:`, error.message);
        throw error;
    }
}

// Simulate a file upload task with error handling
async function uploadFile(fileName) {
    console.log(`⬆️  Starting file upload: ${fileName}`);
    
    try {
        // Simulate upload time using Promise with setTimeout
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log(`✅ Completed file upload: ${fileName}`);
        return `Uploaded ${fileName}`;
    } catch (error) {
        console.error(`❌ Error uploading ${fileName}:`, error.message);
        throw error;
    }
}

// Main function to run tasks concurrently with progress tracking
async function runConcurrentTasks() {
    console.log("=== Starting Concurrent Tasks ===\n");
    console.log("Running 4 tasks concurrently...");
    console.log("Note: Tasks will complete at different times based on their duration\n");
    
    const startTime = Date.now();
    
    // Run multiple tasks concurrently using Promise.all()
    const tasks = [
        processData("Dataset-1"),
        processData("Dataset-2"),
        uploadFile("document.pdf"),
        uploadFile("image.png")
    ];
    
    console.log(`Started ${tasks.length} concurrent tasks at ${new Date(startTime).toLocaleTimeString()}\n`);
    
    // Wait for all tasks to complete
    const results = await Promise.all(tasks);
    
    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log("\n=== All Tasks Completed ===");
    console.log(`Finished at: ${new Date(endTime).toLocaleTimeString()}`);
    console.log(`Total execution time: ${totalTime} seconds`);
    console.log(`Average time per task: ${(totalTime / tasks.length).toFixed(2)} seconds`);
    console.log("\n📊 Results Summary:");
    results.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result}`);
    });
    
    // Compare with sequential execution time
    const sequentialTime = (2 + 2 + 3 + 3); // Sum of all task durations
    console.log(`\n⚡ Performance Benefit:`);
    console.log(`  Sequential execution would take: ~${sequentialTime} seconds`);
    console.log(`  Concurrent execution took: ${totalTime} seconds`);
    console.log(`  Time saved: ~${(sequentialTime - parseFloat(totalTime)).toFixed(2)} seconds (${((sequentialTime - parseFloat(totalTime)) / sequentialTime * 100).toFixed(1)}% faster)`);
}

// Execute the concurrent tasks
runConcurrentTasks().catch(error => {
    console.error("Error occurred:", error);
});