from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Database setup
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
    __tablename__ = "accident_hotspots"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # Unique identifier
    acci_x = Column(Float, nullable=False)  # Latitude
    acci_y = Column(Float, nullable=False)  # Longitude
    hour = Column(Integer, nullable=False)  # Hour (0-23)

class BusyPoint(Base):
    __tablename__ = 'busy_points'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    hour = Column(Integer, nullable=False)  # Hour (0-23)
    start_lat = Column(Float, nullable=False)  # Latitude
    start_lon = Column(Float, nullable=False)  # Longitude
    weekday = Column(Integer, nullable=False)  # Weekday (1-7, where 1 = Sunday)

class TaxiStand(Base):
    __tablename__ = "taxi_stands"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    location_name = Column(String, nullable=False)
    location_longitude = Column(Float, nullable=False)
    location_latitude = Column(Float, nullable=False)

# Create tables in the database
Base.metadata.create_all(bind=engine)

# Pydantic Models
class UserCreate(BaseModel):
    username: str
    password: str
    first_name: str = None
    last_name: str = None
    role: str  # 'driver' or 'customer'

class UserLogin(BaseModel):
    username: str
    password: str

class AccidentHotspotCreate(BaseModel):
    acci_x: float
    acci_y: float
    hour: int

class BusyPointCreate(BaseModel):
    hour: int
    start_lat: float
    start_lon: float
    weekday: int

class TaxiStandCreate(BaseModel):
    location_name: str
    location_longitude: float
    location_latitude: float

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
    current_hour = datetime.now().hour  # Get the current hour (0-23)
    return db.query(AccidentHotspot).filter(AccidentHotspot.hour == current_hour).all()

@app.get("/api/busy-points", response_model=List[BusyPointCreate])
async def get_busy_points(db: Session = Depends(get_db)):
    now = datetime.now()
    current_weekday = now.isoweekday()  # Weekdays are 1-7 (Monday to Sunday)
    current_hour = now.hour  # Get the current hour (0-23)

    # Fetch busy points matching the current weekday and hour
    return db.query(BusyPoint).filter(BusyPoint.weekday == 1, BusyPoint.hour == current_hour).all()

@app.get("/api/taxi-stands", response_model=List[TaxiStandCreate])
async def get_taxi_stands(db: Session = Depends(get_db)):
    # Return all taxi stands
    return db.query(TaxiStand).all()

@app.post("/api/taxi-stands")
async def add_taxi_stand(stand: TaxiStandCreate, db: Session = Depends(get_db)):
    new_stand = TaxiStand(
        location_name=stand.location_name,
        location_longitude=stand.location_longitude,
        location_latitude=stand.location_latitude
    )
    db.add(new_stand)
    db.commit()
    db.refresh(new_stand)
    return {"message": "Taxi Stand added successfully"}

