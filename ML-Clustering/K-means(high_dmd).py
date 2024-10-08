import pandas as pd
from sklearn.cluster import KMeans
from datetime import datetime

data = pd.read_csv('anonymized-taxi-data.csv')

data['StartDateTime'] = pd.to_datetime(data['StartDateTime'])

data['weekday'] = data['StartDateTime'].dt.weekday  # Monday=0, Sunday=6
data['hour'] = data['StartDateTime'].dt.hour        # Extract hour of the day

#DataFrame to store clustered results
clustered_data = pd.DataFrame()

# Number of clusters to create per hour of the day
n_clusters = 84

# Iterate over each unique hour
for hour in range(24):
    # Select the data for the current hour
    hourly_data = data[data['hour'] == hour]

    if not hourly_data.empty:
        # Select the features for clustering (latitude and longitude)
        X = hourly_data[['StartLat', 'StartLon']]

        # Initialize KMeans model for the current hour
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)

        # Fit the model to the data
        kmeans.fit(X)

        # Assign cluster labels to the rows in hourly_data
        hourly_data['cluster'] = kmeans.labels_

        # Append the clustered hourly data to the final DataFrame
        clustered_data = pd.concat([clustered_data, hourly_data])


#To group by clusters and calculate the average coordinates
grouped_data = clustered_data.groupby(['hour', 'cluster']).agg({
    'StartLat': 'mean',
    'StartLon': 'mean',
    'weekday': 'first'
}).reset_index()

# Save the grouped data to a CSV file
grouped_data.to_csv('high_demand_areas_reduced.csv', index=False)
