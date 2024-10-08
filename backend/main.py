from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Database setu
DATABASE_URL = "postgresql://alibabapost:Alibabapost123@polardb-endpoint.rwlb.rds.aliyuncs.com:5432/alibabapost123"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

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

# SQLAlchemy Models
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(String, nullable=False)  # 'driver' or 'customer'

class AccidentHotspot(Base):
    __tablename__ = 'accident_hotspots'
    id = Column(Integer, primary_key=True, index=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    intensity = Column(Integer, nullable=False)
    description = Column(String)

class BusyPoint(Base):
    __tablename__ = 'busy_points'
    id = Column(Integer, primary_key=True, index=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    weekday = Column(String, nullable=False)
    time_interval = Column(String, nullable=False)
    max_drivers = Column(Integer, nullable=False)
    current_drivers = Column(Integer, nullable=False)
    assigned_drivers = Column(String)  # Comma-separated driver IDs


class UserLogin(BaseModel):
    username: str
    password: str


# Create tables in the database
Base.metadata.create_all(bind=engine)

# Pydantic Models
class UserCreate(BaseModel):
    username: str
    password: str
    first_name: str = None
    last_name: str = None
    role: str  # 'driver' or 'customer'

class AccidentHotspotCreate(BaseModel):
    lat: float
    lng: float
    intensity: int
    description: str

class BusyPointCreate(BaseModel):
    lat: float
    lng: float
    weekday: str
    time_interval: str
    max_drivers: int
    current_drivers: int = 0
    assigned_drivers: List[str] = []

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API Endpoints
@app.post("/signup")
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    new_user = User(
        username=user.username,
        password=user.password,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Signup successful"}

@app.post("/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    # Query the database for the user with given username and password
    db_user = db.query(User).filter(User.username == user.username, User.password == user.password).first()
    
    # If user does not exist, raise an HTTP exception
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    # If the user is found, return success with user details
    return {
        "message": "Login successful",
        "first_name": db_user.first_name,
        "last_name": db_user.last_name,
        "role": db_user.role
    }

@app.get("/api/accident-hotspots", response_model=List[AccidentHotspotCreate])
async def get_accident_hotspots(db: Session = Depends(get_db)):
    return db.query(AccidentHotspot).all()

@app.get("/api/busy-points", response_model=List[BusyPointCreate])
async def get_busy_points(db: Session = Depends(get_db)):
    # Get current weekday and time
    now = datetime.now()
    current_weekday = now.strftime("%A")
    current_time = now.strftime("%H:%M")

    # Filter busy points based on current weekday and time interval
    relevant_points = []
    for point in db.query(BusyPoint).all():
        if point.weekday == current_weekday:
            start_time, end_time = point.time_interval.split("-")
            if start_time <= current_time <= end_time and point.current_drivers < point.max_drivers:
                relevant_points.append(point)

    return relevant_points

@app.post("/api/update-busy-point")
async def update_busy_point(request: BusyPointCreate, db: Session = Depends(get_db)):
    busy_point = db.query(BusyPoint).filter(BusyPoint.lat == request.lat, BusyPoint.lng == request.lng).first()
    if not busy_point:
        return {"message": "Busy point not found"}
    
    if request.driver_id not in busy_point.assigned_drivers.split(","):
        if busy_point.current_drivers < busy_point.max_drivers:
            busy_point.current_drivers += 1
            assigned_drivers = busy_point.assigned_drivers.split(",") if busy_point.assigned_drivers else []
            assigned_drivers.append(request.driver_id)
            busy_point.assigned_drivers = ",".join(assigned_drivers)
            db.commit()
            db.refresh(busy_point)
            return {"message": "Driver assigned successfully"}
        else:
            return {"message": "Max drivers reached for this point"}
    else:
        return {"message": "Driver has already been assigned to this point"}