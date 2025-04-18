from fastapi import FastAPI
from routes.ws import router as ws_router
from routes.video import router as video_router

app = FastAPI()
app.include_router(ws_router)
app.include_router(video_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Hello world`!"}
