from fastapi import APIRouter, WebSocket
import cv2
import numpy as np
from utils.pose import detect_pose_landmarks

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

            pose_data = detect_pose_landmarks(frame)
            if pose_data is None:
                await websocket.send_json({"alert": False, "message": "No person detected"})
                continue
            
            await websocket.send_json({
                "alert": False,
                "message": "Pose detected",
                "landmarks": pose_data
            })

    except Exception as e:
        print("WebSocket error:", e)
        await websocket.close()
