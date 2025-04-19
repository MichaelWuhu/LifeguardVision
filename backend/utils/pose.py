import cv2
import mediapipe as mp

mp_pose = mp.solutions.pose
pose_model = mp_pose.Pose(static_image_mode=False)
mp_drawing = mp.solutions.drawing_utils

def detect_pose_landmarks(frame: cv2.Mat, draw: bool = True):
    """Runs MediaPipe Pose on a single frame and optionally draws on it."""
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose_model.process(rgb)

    if not results.pose_landmarks:
        return None

    if draw:
        mp_drawing.draw_landmarks(
            frame,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
            mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2),
        )

    landmarks = results.pose_landmarks.landmark
    simplified = {
        name.name: (landmarks[i].x, landmarks[i].y)
        for i, name in enumerate(mp_pose.PoseLandmark)
    }

    return simplified
