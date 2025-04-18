import cv2
import mediapipe as mp

mp_pose = mp.solutions.pose
pose_model = mp_pose.Pose(static_image_mode=False)
mp_drawing = mp.solutions.drawing_utils

def detect_pose_landmarks(frame: cv2.Mat):
    """Runs MediaPipe Pose on a single frame."""
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose_model.process(rgb)

    if not results.pose_landmarks:
        return None

    landmarks = results.pose_landmarks.landmark

    # Convert to a simpler format (dict of landmark name → (x, y))
    simplified = {
        name.name: (landmarks[i].x, landmarks[i].y)
        for i, name in enumerate(mp_pose.PoseLandmark)
    }

    return simplified
