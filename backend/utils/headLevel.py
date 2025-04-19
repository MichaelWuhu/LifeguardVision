def update_and_check_head_level(pose_data):
    if pose_data and "NOSE" in pose_data:
        x, y = pose_data["NOSE"][:2]
        # print(f"x value: {x}, y value: {y}")
        if 0 <= x <= 1 and 0 <= y <= 1:
            return True
    return False