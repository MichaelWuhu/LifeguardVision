from fastapi import APIRouter, WebSocket
import cv2
import numpy as np
from utils.pose import detect_pose_landmarks
from utils.distressDetection import detector
import base64
from utils.motion import update_and_check_stillness

router = APIRouter()

@router.websocket("/ws/stream")
async def stream_endpoint(websocket: WebSocket):
    await websocket.accept()
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
            is_drowning = is_still
            # print("Alert status:", is_drowning)
            print("NOSE", pose_data["NOSE"])

            await websocket.send_json({
                "alert": is_drowning,
                "message": "Pose detected",
                "landmarks": pose_data,
                "frame": frame_base64
            })

    except Exception as e:
        print("WebSocket error:", e)
        await websocket.close()
