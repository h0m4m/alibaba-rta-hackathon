import pandas as pd
from sklearn.cluster import KMeans

data2 = pd.read_csv('Traffic_Incidents.csv')

# Convert 'acci_time' to datetime to extract the hour
data2['acci_time'] = pd.to_datetime(data2['acci_time'], format='%d/%m/%Y %H:%M:%S')
data2['hour'] = data2['acci_time'].dt.hour

clustered_data_list = []

for hour in data2['hour'].unique():
    hourly_data = data2[data2['hour'] == hour]
    X = hourly_data[['acci_x', 'acci_y']]

    # Apply KMeans clustering for each hour
    kmeans = KMeans(n_clusters=150, random_state=42)
    kmeans.fit(X)
    
    # Assign the cluster labels back to the hourly data
    hourly_data['cluster'] = kmeans.labels_
    
    # Group the clusters by their center points (mean location)
    clustered_hourly_data = hourly_data.groupby('cluster').agg({
        'acci_x': 'mean',
        'acci_y': 'mean',
        'hour': 'first'  # Include hour to identify the time of the clusters
    }).reset_index()
    
    # Append the results to the list
    clustered_data_list.append(clustered_hourly_data)

# Combine the clustered data for all hours into a single DataFrame
final_clustered_data = pd.concat(clustered_data_list)

# Save the result to a new CSV file
final_clustered_data.to_csv('accidents_hotspots.csv', index=False)

# Print the first few rows to verify
print(final_clustered_data.head())
