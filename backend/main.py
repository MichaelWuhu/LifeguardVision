from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.ws import router as ws_router
from routes.video import router as video_router

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ws_router)
app.include_router(video_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Hello world`!"}
