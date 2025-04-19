import shutil
import json
import os
from uuid import uuid4
import cv2
from fastapi import APIRouter, HTTPException, UploadFile, File
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
    
    return {"filename": new_filename}
    
