# import math

# Global state trackers
still_count = 0
active_count = 0
is_alert_active = False

# Keypoints to monitor
TRACKED_KEYPOINTS = [
    "NOSE", "LEFT_SHOULDER", "RIGHT_SHOULDER",
    "LEFT_ELBOW", "RIGHT_ELBOW",
    "LEFT_WRIST", "RIGHT_WRIST",
    "LEFT_HIP", "RIGHT_HIP"
]

# Last frame’s keypoints (for comparison)
last_pose = None

def compute_axis_displacement(p1, p2):
    dx = abs(p1[0] - p2[0])
    dy = abs(p1[1] - p2[1])
    return dx, dy

def update_and_check_stillness(current_landmarks, threshold_x=0.02, threshold_y=0.05,
                                still_required=40, active_required=3):
    global still_count, active_count, is_alert_active, last_pose

    if last_pose is None:
        last_pose = current_landmarks
        return False  # not enough data yet

    # Compute average dx and dy across tracked keypoints
    total_dx = 0
    total_dy = 0
    count = 0

    for key in TRACKED_KEYPOINTS:
        if key in current_landmarks and key in last_pose:
            dx, dy = compute_axis_displacement(current_landmarks[key], last_pose[key])
            total_dx += dx
            total_dy += dy
            count += 1

    avg_dx = total_dx / count if count > 0 else 0
    avg_dy = total_dy / count if count > 0 else 0

    print(f"🧭 Avg dx: {avg_dx:.4f}, dy: {avg_dy:.4f}")

    is_still_now = avg_dx < threshold_x and avg_dy < threshold_y

    # Update state streak counters
    if is_still_now:
        still_count += 1
        active_count = 0
    else:
        active_count += 1
        still_count = 0

    # Update alert state
    if still_count >= still_required:
        is_alert_active = True
    elif active_count >= active_required:
        is_alert_active = False

    # Update last_pose for next frame comparison
    last_pose = current_landmarks

    print(f"🔁 STATE: {'STILL' if is_still_now else 'ACTIVE'} | ALERT: {is_alert_active} "
          f"| still_count={still_count}, active_count={active_count}")

    return is_alert_active
