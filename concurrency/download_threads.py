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


    