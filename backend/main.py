from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

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

# Updated mock data with accident hotspots in Sharjah, UAE
mock_hotspots = [
    {"lat": 25.319000, "lng": 55.375000, "intensity": 6, "description": "High accident risk, close to your location."},
    {"lat": 25.3573, "lng": 55.4033, "intensity": 5, "description": "Moderate accident risk, located further away."},
    {"lat": 25.3625, "lng": 55.4307, "intensity": 4, "description": "Occasional accidents in residential zone, located far away."},
]

# Busy Point model
class BusyPoint(BaseModel):
    lat: float
    lng: float
    weekday: str
    time_interval: str
    max_drivers: int
    current_drivers: int
    assigned_drivers: List[str]  # Track assigned drivers by their unique IDs

# Request model for updating busy points
class BusyPointUpdateRequest(BaseModel):
    lat: float
    lng: float
    driver_id: str  # Unique identifier for the driver (e.g., username)

# Mock data for busy points for taxi dispatch (added `assigned_drivers` field)
mock_busy_points = [
    # Busy point near your location on Monday between 8 PM and 10 PM
    {"lat": 25.318250, "lng": 55.374100, "weekday": "Monday", "time_interval": "20:00-22:00", "max_drivers": 3, "current_drivers": 0, "assigned_drivers": []},
    
    # Another point on Monday but at a different time
    {"lat": 25.3500, "lng": 55.4000, "weekday": "Monday", "time_interval": "12:00-14:00", "max_drivers": 2, "current_drivers": 0, "assigned_drivers": []},

    # A point for Tuesday for variety
    {"lat": 25.3300, "lng": 55.4100, "weekday": "Tuesday", "time_interval": "17:00-19:00", "max_drivers": 4, "current_drivers": 0, "assigned_drivers": []},
]

@app.get("/api/accident-hotspots", response_model=List[AccidentHotspot])
async def get_accident_hotspots():
    return mock_hotspots

@app.get("/api/busy-points", response_model=List[BusyPoint])
async def get_busy_points():
    # Get current weekday and time
    now = datetime.now()
    current_weekday = now.strftime("%A")
    current_time = now.strftime("%H:%M")

    # Filter busy points based on current weekday and time interval
    relevant_points = []
    for point in mock_busy_points:
        if point["weekday"] == current_weekday:
            start_time, end_time = point["time_interval"].split("-")
            if start_time <= current_time <= end_time and point["current_drivers"] < point["max_drivers"]:
                relevant_points.append(point)

    return relevant_points

@app.post("/api/update-busy-point")
async def update_busy_point(request: BusyPointUpdateRequest):
    # Update current drivers count for a busy point when a driver approaches
    for point in mock_busy_points:
        if point["lat"] == request.lat and point["lng"] == request.lng:
            if request.driver_id not in point["assigned_drivers"]:
                if point["current_drivers"] < point["max_drivers"]:
                    point["current_drivers"] += 1
                    point["assigned_drivers"].append(request.driver_id)
                    return {"message": "Driver assigned successfully"}
                else:
                    return {"message": "Max drivers reached for this point"}
            else:
                return {"message": "Driver has already been assigned to this point"}

    return {"message": "Busy point not found"}

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
