# SmartMap - AI-Powered Taxi Management System for Dubai

## Overview

SmartMap is an AI-driven navigation and taxi management system designed to enhance taxi services in Dubai. Developed during the **Alibaba Cloud and RTA Hackathon**, SmartMap leverages machine learning algorithms to identify accident hotspots and high-demand areas, thereby improving safety and efficiency in taxi operations.

Our team—**Mohammad Thabet**, **Mohamad Hamadeh**, **Adeeb Mohammed**, and **Homam Mourad**—under the supervision of **Dr. Said Elnaffar**, collaborated to create this innovative solution for smarter and safer taxi navigation in Dubai.

## Features

- **Accident Hotspot Identification**: Utilizes KMeans clustering to detect accident-prone areas, enabling proactive safety measures.
- **Dynamic Taxi Dispatching**: Offers real-time insights into taxi stand locations and high-demand areas to optimize taxi availability and reduce idle time.
- **AI-Driven Interactive Map**: Provides taxi drivers with an interactive map that leverages real-time data and AI-driven insights for efficient navigation.
- **Comprehensive Data Analytics**: Processes large datasets, including anonymized taxi data and traffic incidents, to inform smarter decision-making.

## Technologies Used

- **Frontend**:
  - **React.js**: For building a responsive and dynamic user interface.
  - **Tailwind CSS**: For styling and designing the UI components.
  - **JavaScript**: Core programming language for frontend logic.
  - **Axios**: For handling API requests and integration.

- **Backend**:
  - **FastAPI**: High-performance web framework for building RESTful APIs with Python.
  - **Uvicorn**: ASGI server for running FastAPI applications.

- **Machine Learning**:
  - **Python Libraries**: Including NumPy, Pandas, and Scikit-learn for data processing and machine learning.
  - **KMeans Clustering**: Algorithm used for identifying patterns in accident hotspots and high-demand areas.

- **Infrastructure**:
  - **Nginx**: Web server for serving the frontend application.
  - **Alibaba Cloud Services**: Hosting and deployment of the application.

## Hackathon Context

This project was developed during the **Alibaba Cloud and RTA Hackathon** in collaboration with Dubai's Roads and Transport Authority (RTA). SmartMap addresses critical challenges in taxi services, aiming to reduce accidents, enhance taxi dispatching efficiency, and maximize taxi occupancy rates in Dubai.

## Team Members

- **Mohammad Thabet**
- **Mohamad Hamadeh**
- **Adeeb Mohammed**
- **Homam Mourad**

**Supervised by**: **Dr. Said Elnaffar**

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js**: v20.18.0 or higher
- **npm**: v6.x or higher
- **Python**: v3.x
- **pip**: Python package installer
- **Uvicorn**: ASGI server
- **FastAPI**: Python backend framework
- **Nginx**: Web server (for deployment)

## Installation

### Backend Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/h0m4m/alibaba-rta-hackathon.git
   cd alibaba-rta-hackathon/backend
   ```

2. **Create a Virtual Environment** (Optional but recommended):

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Backend Server**:

   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to the Frontend Directory**:

   ```bash
   cd ../frontend/alibabarta-frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Build the Frontend Application**:

   ```bash
   npm run build
   ```

4. **Deploy the Frontend with Nginx**:

   - **Copy Build Files to Nginx Directory**:

     ```bash
     sudo cp -r build/* /var/www/html/
     ```

   - **Restart Nginx**:

     ```bash
     sudo systemctl restart nginx
     ```

## Running the Application

- **Backend API**: Accessible at `http://<server-ip>:8000`
- **Frontend Application**: Accessible at `http://smartmap.cc` or `http://<your-domain>`

## API Endpoints

### Authentication

- **POST** `/login`: Authenticate a user.

  **Request Body**:

  ```json
  {
    "username": "user1",
    "password": "password1"
  }
  ```

- **POST** `/signup`: Register a new user.

  **Request Body**:

  ```json
  {
    "username": "newuser",
    "password": "newpassword",
    "email": "user@example.com"
  }
  ```

### Data Retrieval

- **GET** `/accident-hotspots`: Retrieve accident hotspot data.
- **GET** `/high-demand-areas`: Retrieve areas with high taxi demand.
- **GET** `/taxi-stands`: Retrieve taxi stand locations.
- **GET** `/traffic-incidents`: Retrieve recent traffic incidents.

### Example API Request

```bash
curl -X POST http://<server-ip>:8000/login \
-H "Content-Type: application/json" \
-d '{"username": "user1", "password": "password1"}'
```

## Dataset Information

The following datasets were used in this project:

- **Accident Hotspots**: `accidents_hotspots.csv`
- **Anonymized Taxi Data**: `anonymized-taxi-data.csv`
- **High-Demand Areas**: `high_demand_areas_reduced.csv`
- **Taxi Stand Locations**: `Taxi_Stand_Locations.csv`
- **Traffic Incidents**: `Traffic_Incidents.csv`

## Contribution Guidelines

We welcome contributions to improve SmartMap. If you wish to contribute, please fork the repository and submit a pull request with your changes.

## Acknowledgements

We extend our gratitude to:

- **Alibaba Cloud** and **Dubai RTA** for hosting the hackathon and providing us with this opportunity.
- **Dr. Said Elnaffar** for his guidance and supervision.
- All team members for their dedication and hard work.

## License

This project is licensed under the [MIT License](LICENSE).

---

*Note: This project was developed as a prototype during a hackathon and may require additional development for production use.*
```
