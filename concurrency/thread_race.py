import threading
import time
import random
import os
import sys


# Global variables to track race results and positions
race_results = []
racer_positions = {}
position_lock = threading.Lock()
result_lock = threading.Lock()
race_finished = False
TRACK_LENGTH = 50


def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')


def draw_race_track():
    """Draw the current state of the race track."""
    with position_lock:
        print("\n" + "="*60)
        print("🏁 LIVE THREAD RACE 🏁")
        print("="*60)
        
        for racer_name, progress in racer_positions.items():
            # Create progress bar
            filled = int((progress / 100) * TRACK_LENGTH)
            empty = TRACK_LENGTH - filled
            
            # Choose racer emoji based on name
            if "Lightning" in racer_name:
                emoji = "⚡"
            elif "Speed" in racer_name:
                emoji = "💨"
            elif "Turbo" in racer_name:
                emoji = "🚀"
            elif "Flash" in racer_name:
                emoji = "⭐"
            elif "Quick" in racer_name:
                emoji = "💫"
            else:
                emoji = "🏃"
            
            # Create track visualization
            track = "║" + "█" * filled + emoji + "░" * (empty-1) + "║🏆"
            percentage = f"{progress:5.1f}%"
            
            print(f"{racer_name:15} {track} {percentage}")
        
        print("="*60)


def racer_thread(racer_name, racer_id):
    """
    Simulate a racer thread competing in a race with visual progress.
    Each racer progresses at different speeds with visual updates.
    """
    global race_results, race_finished, racer_positions
    
    # Initialize racer position
    with position_lock:
        racer_positions[racer_name] = 0.0
    
    # Racing simulation with incremental progress
    total_race_time = random.uniform(3, 8)  # Longer race time for better visualization
    steps = 20  # Number of progress updates
    step_time = total_race_time / steps
    
    for step in range(steps + 1):
        if race_finished:
            break
            
        # Update progress
        progress = (step / steps) * 100
        with position_lock:
            racer_positions[racer_name] = progress
        
        # Add some randomness to make it more realistic
        actual_step_time = step_time * random.uniform(0.7, 1.3)
        time.sleep(actual_step_time)
        
        # Check if finished
        if progress >= 100:
            break
    
    # Thread-safe way to record results
    with result_lock:
        if not race_finished and racer_positions[racer_name] >= 100:
            position = len(race_results) + 1
            race_results.append({
                'name': racer_name,
                'id': racer_id,
                'time': total_race_time,
                'position': position
            })
            
            # Victory message
            print(f"\n🎉 {racer_name} CROSSES THE FINISH LINE! Position: {position} 🎉")


def countdown():
    """Animated countdown before starting the race."""
    clear_screen()
    print("\n" + "🏁" * 20)
    print("     THREAD RACE CHAMPIONSHIP")
    print("🏁" * 20)
    
    for i in range(3, 0, -1):
        print(f"\n{'':20} STARTING IN {i}... ")
        time.sleep(1)
    
    print(f"\n{'':25} GO! 🚀")
    time.sleep(0.5)


def live_race_monitor():
    """Monitor and display the race progress in real-time."""
    global race_finished, racer_positions
    
    while not race_finished:
        clear_screen()
        draw_race_track()
        time.sleep(0.3)  # Update every 300ms
        
        # Check if all racers finished
        with position_lock:
            all_finished = all(pos >= 100 for pos in racer_positions.values()) if racer_positions else False
        
        if all_finished:
            break


def display_results():
    """Display the final race results with celebration."""
    clear_screen()
    
    print("\n" + "🎊" * 25)
    print("�" + " " * 8 + "FINAL RACE RESULTS" + " " * 8 + "�")
    print("🎊" * 25)
    
    if race_results:
        for i, result in enumerate(race_results):
            if result['position'] == 1:
                medal = "🥇"
                banner = "🎉 WINNER! 🎉"
            elif result['position'] == 2:
                medal = "🥈"
                banner = "Great job!"
            elif result['position'] == 3:
                medal = "🥉"
                banner = "Well done!"
            else:
                medal = "🏃"
                banner = "Good effort!"
                
            print(f"\n{medal} Position {result['position']}: {result['name']}")
            print(f"   Time: {result['time']:.2f}s - {banner}")
    else:
        print("No racers finished!")
    
    print("\n" + "🎊" * 25)


def thread_race_demo():
    """
    Main function to demonstrate visual thread racing.
    Creates multiple threads that compete with live visual updates.
    """
    global race_results, race_finished, racer_positions
    
    # Reset global state
    race_results = []
    race_finished = False
    racer_positions = {}
    
    # Create racer threads
    racers = [
        ("Lightning Thread", 1),
        ("Speed Daemon", 2),  
        ("Turbo Process", 3),
        ("Flash Runner", 4),
        ("Quick Silver", 5)
    ]
    
    countdown()
    
    threads = []
    
    # Create all racer threads
    for racer_name, racer_id in racers:
        thread = threading.Thread(
            target=racer_thread, 
            args=(racer_name, racer_id),
            name=f"Thread-{racer_name}"
        )
        threads.append(thread)
    
    # Start the race monitor thread
    monitor_thread = threading.Thread(target=live_race_monitor)
    
    # Start all threads simultaneously
    start_time = time.time()
    monitor_thread.start()
    
    for thread in threads:
        thread.start()
    
    # Wait for all racing threads to complete
    for thread in threads:
        thread.join()
    
    # Mark race as finished and wait for monitor
    race_finished = True
    monitor_thread.join()
    
    end_time = time.time()
    total_time = end_time - start_time
    
    # Final track display
    clear_screen()
    draw_race_track()
    
    # Display results
    time.sleep(1)
    display_results()
    
    print(f"\n⏱️  Total race duration: {total_time:.2f}s")
    print(f"🧵  Number of racing threads: {len(threads)}")
    print(f"🎯  Race completed successfully!")
    
    return race_results


def quick_race_demo():
    """Run a shorter demo race with 3 racers."""
    global race_results, race_finished, racer_positions
    
    print("\n\n" + "🏃" * 20)
    print("     BONUS SPRINT RACE!")
    print("🏃" * 20)
    
    input("\nPress Enter to start the sprint race...")
    
    # Reset and run again with fewer racers
    race_results = []
    race_finished = False
    racer_positions = {}
    
    sprint_racers = [
        ("Alpha Sprint", 101),
        ("Beta Dash", 102),
        ("Gamma Flash", 103)
    ]
    
    threads = []
    for racer_name, racer_id in sprint_racers:
        thread = threading.Thread(
            target=racer_thread,
            args=(racer_name, racer_id)
        )
        threads.append(thread)
    
    # Start monitor
    monitor_thread = threading.Thread(target=live_race_monitor)
    monitor_thread.start()
    
    # Start all racing threads
    for thread in threads:
        thread.start()
    
    # Wait for completion
    for thread in threads:
        thread.join()
    
    race_finished = True
    monitor_thread.join()
    
    # Final display
    clear_screen()
    draw_race_track()
    time.sleep(1)
    display_results()


if __name__ == "__main__":
    try:
        # Run the main thread race demonstration
        print("🚀 Welcome to the Interactive Thread Race Championship! 🚀")
        print("Watch as multiple threads compete in a visual race!")
        
        input("Press Enter to begin the main race...")
        results = thread_race_demo()
        
        # Ask if user wants to run sprint race
        print("\n" + "🎮" * 15)
        choice = input("Would you like to run a sprint race? (y/n): ").lower().strip()
        
        if choice == 'y' or choice == 'yes':
            quick_race_demo()
        
        print("\n🏁 Thanks for watching the Thread Race Championship! 🏁")
        
    except KeyboardInterrupt:
        print("\n\n🛑 Race interrupted! Thanks for watching! 🛑")
    except Exception as e:
        print(f"\n❌ Race error: {e}")
    finally:
        race_finished = True