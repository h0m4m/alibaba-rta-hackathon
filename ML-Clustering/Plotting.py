import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
# Load the datasets
old_wait_times = pd.read_csv('ML-Clustering\\old-data-wt.csv')
new_wait_times = pd.read_csv('ML-Clustering\\new-data-wt.csv')

original_data = pd.read_csv('ML-Clustering\\anonymized-taxi-data.csv')

'''
# This section takes care of outliers:
# Old wait time dataset:
# Printing rows before discarding outliers
print(f'\nNumber of rows before discarding outliers = {old_wait_times.shape[0]}')

numeric_columns = old_wait_times.select_dtypes(include=[np.number]).columns

# Identify the first quartile (Q1) and third quartile (Q3) for numeric columns
Q1 = old_wait_times[numeric_columns].quantile(0.25)
Q3 = old_wait_times[numeric_columns].quantile(0.75)

# Calculate the IQR for each numeric column
IQR = Q3 - Q1

# Set a threshold for considering a data point as an outlier (you can adjust this)
threshold = 1.5

# Create a boolean mask indicating outliers for numeric columns
outliers_mask_numeric = (
    (old_wait_times[numeric_columns] < (Q1 - threshold * IQR))
)
# Combine the outlier mask for numeric columns with a mask for non-numeric columns
outliers_mask = outliers_mask_numeric.any(axis=1)

# Remove rows containing outliers
old_wait_times= old_wait_times[~outliers_mask]

# Printing rows after discarding outliers
print(f'Number of rows after discarding outliers = {old_wait_times.shape[0]}')





# New wait time dataset:
# Printing rows before discarding outliers
print(f'\nNumber of rows before discarding outliers = {new_wait_times.shape[0]}')

numeric_columns = new_wait_times.select_dtypes(include=[np.number]).columns

# Identify the first quartile (Q1) and third quartile (Q3) for numeric columns
Q1 = new_wait_times[numeric_columns].quantile(0.25)
Q3 = new_wait_times[numeric_columns].quantile(0.75)

# Calculate the IQR for each numeric column
IQR = Q3 - Q1

# Set a threshold for considering a data point as an outlier (you can adjust this)
threshold = 0.5

# Create a boolean mask indicating outliers for numeric columns
outliers_mask_numeric = (
    (new_wait_times[numeric_columns] > (Q3 + threshold * IQR))
)
# Combine the outlier mask for numeric columns with a mask for non-numeric columns
outliers_mask = outliers_mask_numeric.any(axis=1)

# Remove rows containing outliers
new_wait_times= new_wait_times[~outliers_mask]

# Printing rows after discarding outliers
print(f'Number of rows after discarding outliers = {new_wait_times.shape[0]}')


'''







# Calculate time saved and potential taxi reduction
old_avg_wait = old_wait_times['avg_wait_time'].mean()
new_avg_wait = new_wait_times['avg_wait_time'].mean()
time_saved = old_avg_wait - new_avg_wait

total_trip_time = original_data['Distance'].sum() / 30  # Assuming average speed of 30 km/h
old_total_time = total_trip_time + old_wait_times['avg_wait_time'].sum()
new_total_time = total_trip_time + new_wait_times['avg_wait_time'].sum()

potential_reduction = (1 - new_total_time / old_total_time) * 100


print(f"Average wait time for old data: {old_avg_wait:.2f} minutes")
print(f"Average wait time for new data: {new_avg_wait:.2f} minutes")
print(f"Average time saved in between trips: {time_saved:.2f} minutes")
print(f"Potential taxi reduction: {potential_reduction:.2f}%")


# Plot wait times for old data
plt.figure(figsize=(10, 6))
plt.scatter(old_wait_times.index, old_wait_times['avg_wait_time'], color='red', label='Old Data Wait Time', alpha=0.6)

# Plot wait times for new data
plt.scatter(new_wait_times.index, new_wait_times['avg_wait_time'], color='green', label='New Data Wait Time', alpha=0.6)

# Limit y-axis to 100 minutes
plt.ylim(0, 170)
#plt.xlim(0, 3500)
# Enhance the plot
plt.title('Wait Time Comparison: Old vs New Data (Capped at 100 mins)', fontsize=14)
plt.xlabel('Driver Index', fontsize=12)
plt.ylabel('Average Wait Time (minutes)', fontsize=12)
plt.legend()
plt.tight_layout()

# Show the plot
plt.show()