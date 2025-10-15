import threading
import time

def download_file(file_name):
    print(f"⬇️ Starting download: {file_name}")
    time.sleep(2)
    print(f"✅ Finished: {file_name}")

files = ["file1.mp3", "file2.mp3", "file3.mp3"]

threads = []
for f in files:
    t = threading.Thread(target=download_file, args=(f,))
    threads.append(t)
    t.start()

for t in threads:
    t.join()