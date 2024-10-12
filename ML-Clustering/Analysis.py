import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import haversine_distances
from math import radians

# Load the datasets
original_data = pd.read_csv('anonymized-taxi-data.csv')
clustered_data = pd.read_csv('high-demand-areas-reduced.csv')

# Function to calculate haversine distance
def haversine_distance(lat1, lon1, lat2, lon2):
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    return haversine_distances([[lat1, lon1]], [[lat2, lon2]])[0][0] * 6371  # Earth radius in km

# Process original data to calculate wait times
def process_original_data(df):
    df['StartDateTime'] = pd.to_datetime(df['StartDateTime'])
    df = df.sort_values(['anonymized_vehicle_id', 'StartDateTime'])
    
    wait_times = {}
    for _, group in df.groupby('anonymized_vehicle_id'):
        wait_time = group['StartDateTime'].diff().dt.total_seconds().sum() / 60  # Convert to minutes
        count = len(group)
        avg_wait_time = wait_time / count if count > 1 else 0
        wait_times[group['anonymized_vehicle_id'].iloc[0]] = avg_wait_time
    
    return pd.DataFrame(list(wait_times.items()), columns=['driver_id', 'avg_wait_time'])

# Process data with new solution
def process_new_data(original_df, clustered_df):
    original_df['StartDateTime'] = pd.to_datetime(original_df['StartDateTime'])
    original_df['hour'] = original_df['StartDateTime'].dt.hour
    original_df = original_df.sort_values(['anonymized_vehicle_id', 'StartDateTime'])
    
    new_wait_times = {}
    for _, group in original_df.groupby('anonymized_vehicle_id'):
        total_wait_time = 0
        count = 0
        for i in range(len(group) - 1):
            end_lat, end_lon = group.iloc[i]['EndLat'], group.iloc[i]['EndLon']
            next_hour = group.iloc[i+1]['hour']
            
            potential_starts = clustered_df[clustered_df['hour'] == next_hour]
            distances = potential_starts.apply(lambda row: haversine_distance(end_lat, end_lon, row['StartLat'], row['StartLon']), axis=1)
            
            if (distances <= 0.5).any():
                total_wait_time += 5  # 5 minutes wait time if within 0.5km radius (around 2 to 3 km distance)
            else:
                time_diff = (group.iloc[i+1]['StartDateTime'] - group.iloc[i]['StartDateTime']).total_seconds() / 60
                total_wait_time += time_diff
            
            count += 1
        
        avg_wait_time = total_wait_time / count if count > 0 else 0
        new_wait_times[group['anonymized_vehicle_id'].iloc[0]] = avg_wait_time
    
    return pd.DataFrame(list(new_wait_times.items()), columns=['driver_id', 'avg_wait_time'])


old_wait_times = process_original_data(original_data)
old_wait_times.to_csv('old-data-wt.csv', index=False)

new_wait_times = process_new_data(original_data, clustered_data)
new_wait_times.to_csv('new-data-wt.csv', index=False)

# Calculate time saved and potential taxi reduction
old_avg_wait = old_wait_times['avg_wait_time'].mean()
new_avg_wait = new_wait_times['avg_wait_time'].mean()
time_saved = old_avg_wait - new_avg_wait

total_trip_time = original_data['Distance'].sum() / 30  # Assuming average speed of 30 km/h
old_total_time = total_trip_time + old_wait_times['avg_wait_time'].sum()
new_total_time = total_trip_time + new_wait_times['avg_wait_time'].sum()

potential_reduction = (1 - new_total_time / old_total_time) * 100

print(f"Average time saved per trip: {time_saved:.2f} minutes")
print(f"Potential taxi reduction: {potential_reduction:.2f}%")