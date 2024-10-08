import csv
from sqlalchemy.orm import Session
from main import AccidentHotspot, BusyPoint, engine

# Load accident hotspots data into the database from CSV
def import_hotspot_data(csv_file_path):
    with open(csv_file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        session = Session(bind=engine)
        for row in reader:
            hotspot = AccidentHotspot(
                acci_x=float(row['acci_x']),
                acci_y=float(row['acci_y']),
                hour=int(row['hour'])
            )
            session.add(hotspot)
        session.commit()
        session.close()

# Load busy points data into the database from CSV
def import_busy_points_data(csv_file_path):
    with open(csv_file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        session = Session(bind=engine)
        for row in reader:
            busy_point = BusyPoint(
                hour=int(row['hour']),
                start_lat=float(row['StartLat']),
                start_lon=float(row['StartLon']),
                weekday=int(row['weekday'])
            )
            session.add(busy_point)
        session.commit()
        session.close()

# Call these functions with the paths to your CSV files
import_hotspot_data('path/to/accident_hotspots.csv')
import_busy_points_data('path/to/busy_points.csv')