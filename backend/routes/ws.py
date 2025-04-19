from fastapi import APIRouter, WebSocket
import cv2
import numpy as np
from utils.pose import detect_pose_landmarks
from utils.headLevel import update_and_check_head_level
from utils.motion import update_and_check_stillness
from utils.ws_manager import manager
import base64

router = APIRouter()
timer = 0

@router.websocket("/ws/stream")
async def stream_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    print("WebSocket connection accepted")

    try:
        while True:
            binary_data = await websocket.receive_bytes()
            np_arr = np.frombuffer(binary_data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                await websocket.send_json({"error": "Invalid frame"})
                continue

            pose_data = detect_pose_landmarks(frame, draw=True)
            _, buffer = cv2.imencode(".jpg", frame)
            frame_base64 = base64.b64encode(buffer).decode("utf-8")
            if pose_data is None:
                await websocket.send_json({"alert": False, "message": "No person detected"})
                continue
            
            is_still = update_and_check_stillness(pose_data)
            head_below_water = update_and_check_head_level(pose_data)

            print("is_still:", is_still)
            print("head_below_water:", head_below_water)

            if is_still and head_below_water:
                timer += 1
                print("Timer:", timer)
                if timer >= 12: # 3 seconds (change later to 240)
                    is_drowning = True
            else:
                timer = 0
                is_drowning = False

            await websocket.send_json({
                "alert": is_drowning,
                "message": "Pose detected",
                "landmarks": pose_data,
                "frame": frame_base64
            })

    except Exception as e:
        print("WebSocket error:", e)
        manager.disconnect(websocket)

