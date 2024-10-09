import csv
from sqlalchemy.orm import Session
from main import TaxiStand, engine  # Assuming the TaxiStand model is in the main.py file

# Load taxi stands data into the database from CSV
def import_taxi_stands_data(csv_file_path):
    with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        session = Session(bind=engine)
        for row in reader:
            taxi_stand = TaxiStand(
                location_name=row['location_name'],
                location_longitude=float(row['location_longitude']),
                location_latitude=float(row['location_latitude'])
            )
            session.add(taxi_stand)
        session.commit()
        session.close()

# Call this function with the path to your CSV file
import_taxi_stands_data('C:/Users/mhdho/Desktop/alibaba-rta-hackathon/ML-Clustering/Taxi_Stand_Locations.csv')
