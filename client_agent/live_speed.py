
import time
import math
from collections import deque
from pynput import keyboard, mouse

key_times = deque()
mouse_data = deque()
last_position = None
last_activity = time.monotonic()
lock = __import__("threading").Lock()


def on_key(key):
    global last_activity
    now = time.monotonic()

    with lock:
        key_times.append(now)
        last_activity = now


def on_move(x, y):
    global last_position, last_activity

    now = time.monotonic()

    with lock:
        if last_position is not None:
            old_x, old_y, old_time = last_position
            distance = math.hypot(x - old_x, y - old_y)
            elapsed = now - old_time

            if elapsed > 0 and distance > 0:
                mouse_data.append((now, distance, elapsed))

        last_position = (x, y, now)
        last_activity = now


print("Live Keyboard and Mouse Speed Monitor")
print("Type or move your mouse to see results.")
print("Press Ctrl+C in terminal to stop.\n")

with keyboard.Listener(on_press=on_key) as kl:
    with mouse.Listener(on_move=on_move) as ml:
        try:
            while True:
                time.sleep(1)
                now = time.monotonic()

                with lock:
                    while key_times and now - key_times[0] > 5:
                        key_times.popleft()

                    while mouse_data and now - mouse_data[0][0] > 5:
                        mouse_data.popleft()

                    typing_speed = len(key_times) / 5 * 60

                    distance = sum(item[1] for item in mouse_data)
                    elapsed = sum(item[2] for item in mouse_data)
                    mouse_speed = distance / elapsed if elapsed else 0

                    idle_time = now - last_activity

                print(
                    f"\rTyping: {typing_speed:5.1f} key presses/min | "
                    f"Mouse: {mouse_speed:7.1f} pixels/sec | "
                    f"Idle: {idle_time:5.1f} sec   ",
                    end="",
                    flush=True
                )

        except KeyboardInterrupt:
            print("\nMonitoring stopped.")
        finally:
            kl.stop()
            ml.stop()
