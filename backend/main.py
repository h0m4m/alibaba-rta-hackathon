from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Adding CORS middleware to allow requests from React frontend
origins = [
    "http://localhost:3000",  # Frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Accident Hotspot model
class AccidentHotspot(BaseModel):
    lat: float
    lng: float
    intensity: int
    description: str

# Mock data simulating accident hotspots
mock_hotspots = [
    # One hotspot near the user's location
    {"lat": 25.319000, "lng": 55.375000, "intensity": 6, "description": "High accident risk, close to your location."},

    # Two hotspots far from the user's location
    {"lat": 25.3573, "lng": 55.4033, "intensity": 5, "description": "Moderate accident risk, located further away."},
    {"lat": 25.3625, "lng": 55.4307, "intensity": 4, "description": "Occasional accidents in residential zone, located far away."},
]

@app.get("/api/accident-hotspots", response_model=List[AccidentHotspot])
async def get_accident_hotspots():
    return mock_hotspots

# User authentication endpoints
class User(BaseModel):
    username: str
    password: str
    first_name: str = None
    last_name: str = None

fake_user_db = {}

@app.post("/signup")
async def signup(user: User):
    if user.username in fake_user_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    fake_user_db[user.username] = {
        "password": user.password,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }
    return {"message": "Signup successful"}

@app.post("/login")
async def login(user: User):
    if user.username not in fake_user_db or fake_user_db[user.username]["password"] != user.password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {
        "message": "Login successful",
        "first_name": fake_user_db[user.username]["first_name"],
        "last_name": fake_user_db[user.username]["last_name"]
    }
