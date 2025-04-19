import shutil
import json
import os
from uuid import uuid4
import cv2
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from utils.pose import detect_pose_landmarks


router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_ext = os.path.splitext(file.filename)[1]
    new_filename = f"{uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)


    frame = cv2.imread(file_path)
    if frame is None:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image/video frame")
    
    pose_data = detect_pose_landmarks(frame)

    return JSONResponse(content=pose_data)
    