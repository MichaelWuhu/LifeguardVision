import shutil
import json
import os
import base64
from uuid import uuid4
import cv2
import numpy as np
from fastapi import APIRouter, HTTPException, UploadFile, File
from utils.pose import detect_pose_landmarks
from utils.headLevel import update_and_check_head_level
from utils.motion import update_and_check_stillness
from fastapi.responses import JSONResponse
from utils.pose import detect_pose_landmarks
import time
import asyncio
from utils.ws_manager import manager

timer = 0
router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def process_and_send_frame(frame, timer_value=0):
    """Process a video frame and send it via WebSocket to all connected clients."""
    
    pose_data = detect_pose_landmarks(frame, draw=True)
    _, buffer = cv2.imencode('.jpg', frame)
    frame_base64 = base64.b64encode(buffer).decode('utf-8')
    
    is_drowning = False
    new_timer = timer_value  # Initialize with current timer value
    
    if pose_data is not None:
        is_still = update_and_check_stillness(pose_data)
        head_below_water = update_and_check_head_level(pose_data)
        
        print("is_still:", is_still)
        print("head_below_water:", head_below_water)
        
        if is_still and head_below_water:
            new_timer += 1
            print("Timer:", new_timer)
            if new_timer >= 12:  # 3 seconds (at 4fps)
                is_drowning = True
        else:
            new_timer = 0
            is_drowning = False
    
    message = {
        "alert": is_drowning,
        "message": "Pose detected",
        "landmarks": pose_data,
        "frame": frame_base64
    }

    # print({
    #     "alert": is_drowning,
    #     "message": "Pose detected",
    # })

    await manager.broadcast(message)
    return message, new_timer  # Return updated timer value

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # Extracts File Type
    file_ext = os.path.splitext(file.filename)[1]
    print(f"File Type: {file_ext}")

    filename = f"video"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    ###########################
    # Process .jpg, .png ######
    ###########################
    if file_ext == '.jpg' or file_ext == '.png':
        frame = cv2.imread(file_path)
        if frame is None:
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid image/video frame")
        
        pose_data = detect_pose_landmarks(frame)
        print(f"Pose Data: \n{pose_data}")

        return JSONResponse(
            status_code=200,
            content={"message": "Drowning!!!"}
        )
    
    ###########################
    # Process .mp4, .mov ######
    ###########################
    if file_ext == '.mp4' or file_ext == '.mov':
        cap = cv2.VideoCapture(file_path)
        if not cap.isOpened():
            raise HTTPException(status_code=400, detail="Unable to open video file")

        # Get video FPS to calculate correct frame timing
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_interval = 1.0 / fps  # Time between frames at normal speed
        target_interval = 0.25  # Your WebSocket update interval (4 updates per second)

        # Calculate how many frames to skip to match target interval
        frames_to_skip = int(target_interval / frame_interval)
        if frames_to_skip < 1:
            frames_to_skip = 1

        counter = 0
        frames_processed = 0

        current_timer = 0  # Initialize a local timer variable

        while True:
            start_time = time.time()
            
            # Skip frames to match desired rate
            for _ in range(frames_to_skip):
                ret, frame = cap.read()
                counter += 1
                
                if not ret:
                    print(f"End of video reached after {counter} frames, processed {frames_processed} frames")
                    cap.release()
                    return {"message": "Video processing complete", "frames_processed": frames_processed}
            
            # Process only the last frame from the batch
            frames_processed += 1
            # print(counter, " -- ", frames_processed)
            
            # Process the frame and get the result along with new timer value
            result, current_timer = await process_and_send_frame(frame, current_timer)
            
            # No need to check result["alert"] or update timer separately,
            # since the function already handles that and returns the updated timer
            
            # Calculate how long processing took and sleep for the remainder of the target interval
            processing_time = time.time() - start_time
            sleep_time = max(0, target_interval - processing_time)
            time.sleep(sleep_time)
    
    return {"status": 200}
