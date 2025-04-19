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

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # Extracts File Type
    file_ext = os.path.splitext(file.filename)[1]
    print(f"File Type: {file_ext}")

    # Generates Unique File Name
    new_filename = f"{uuid4()}{file_ext}"

    # Create File Path to store upload
    file_path = os.path.join(UPLOAD_DIR, new_filename)

    # Stores Upload into uploads folder
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

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
    
    if file_ext == '.mp4' or file_ext == '.mov':
            cap = cv2.VideoCapture(file_path)
            if not cap.isOpened():
                raise HTTPException(status_code=400, detail="Unable to open video file")
            
            timer = 0
            results = []
            # Process each frame
            try:
                while True:
                    ret, frame = cap.read()
                    if not ret:
                        break  # End of video
                    
                    pose_data = detect_pose_landmarks(frame, draw=True)
                    ret2, buffer = cv2.imencode(".jpg", frame)
                    if not ret2:
                        continue
                    frame_base64 = base64.b64encode(buffer).decode("utf-8")
                    
                    frame_alert = False
                    # Only update if pose data is present
                    if pose_data is not None:
                        # Replace these dummy functions with your implementations
                        is_still = update_and_check_stillness(pose_data)
                        head_below_water = update_and_check_head_level(pose_data)

                        print("is_still:", is_still)
                        print("head_below_water:", head_below_water)

                        if is_still and head_below_water:
                            timer += 1
                            print("Timer:", timer)
                            if timer >= 12:  # 12 frames threshold, update as necessary
                                frame_alert = True
                        else:
                            timer = 0
                    
                    results.append({
                        "alert": frame_alert,
                        "landmarks": pose_data,
                        "frame": frame_base64
                    })
                
                cap.release()
                return JSONResponse(
                    status_code=200, 
                    content={"message": "Video processed", 
                            "data": results})
             
            except Exception as e:
                print("WebSocket error:", e)
    
    return {"filename": new_filename}
    
