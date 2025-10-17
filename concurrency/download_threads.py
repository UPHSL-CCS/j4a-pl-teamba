import time


def download_file(file_name):
    """Simulate downloading a file (task)."""
    print(f"⬇️ Starting download: {file_name}")
    time.sleep(2)
    print(f"✅ Finished: {file_name}")


# --- Thread setup (create thread objects) ---
def create_threads(files):
    """Create Thread objects for each file (task creation)."""
    import threading

    threads = []
    for f in files:
        t = threading.Thread(target=download_file, args=(f,))
        threads.append(t)
    return threads


def get_thread_count(files):
    """Return how many threads will be created for a list of files."""
    return len(files)


# --- Run / test (start and join threads) ---
def run_downloads(files):
    """Start all threads and wait for them to finish (testing/demo)."""
    import time as _time

    threads = create_threads(files)
    start = _time.time()
    for t in threads:
        t.start()

    for t in threads:
        t.join()
    elapsed = _time.time() - start
    # Testing/demo summary
    print(f"All downloads completed in {elapsed:.2f}s. ({get_thread_count(files)} threads)")


if __name__ == "__main__":
    # Small demo list; change to two files if you want only two tasks
    files = ["file1.mp3", "file2.mp3", "file3.mp3"]
    run_downloads(files)



    