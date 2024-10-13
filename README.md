# SmartMap - AI-Powered Taxi Management System for Dubai

## Table of Contents

- [Overview](#overview)
- [Demo Video](#demo-video)
- [Problems We Are Solving](#problems-we-are-solving)
- [Features](#features)
- [Value Proposition](#value-proposition)
- [Technologies Used](#technologies-used)
- [Hackathon Context](#hackathon-context)
- [Future Enhancements](#future-enhancements)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Data Retrieval](#data-retrieval)
- [Dataset Information](#dataset-information)
- [Team Members](#team-members)
- [Contribution Guidelines](#contribution-guidelines)
- [Acknowledgements](#acknowledgements)
- [License](#license)
- [Contact](#contact)

---

## Overview

SmartMap is an AI-driven navigation and taxi management system designed to enhance taxi services in Dubai. Developed during the **Alibaba Cloud and RTA Hackathon**, SmartMap leverages machine learning algorithms to identify accident hotspots and high-demand areas, thereby improving safety and efficiency in taxi operations.

Our team—**Homam Mourad**, **Mohammad Thabet**, **Mohamad Hamadeh**, and **Adeeb Mohammed**—under the supervision of **Dr. Said Elnaffar**, collaborated to create this innovative solution for smarter and safer taxi navigation in Dubai.
## Demo Video
[![SmartMap Demo Video]](https://github.com/user-attachments/assets/6cdecac6-98f6-49d8-adf5-4fc14eddb157)

## Problems We Are Solving

1. **Lack of Awareness of Accident Hotspots for Drivers**: Many taxi drivers are unaware of accident-prone areas, increasing the likelihood of accidents.

2. **Long Wait Times and Taxi Overcrowding in Certain Zones**: Inefficient dispatching and static taxi stands lead to delays in customer pick-up times and overcrowded areas with too many taxis.

## Features

- **Accident Hotspot Identification**: Utilizes KMeans clustering to detect accident-prone areas, enabling proactive safety measures.
- **Dynamic Taxi Dispatching**: Offers real-time insights into taxi stand locations and high-demand areas to optimize taxi availability and reduce idle time.
- **AI-Driven Interactive Map**: Provides taxi drivers with an interactive map that leverages real-time data and AI-driven insights for efficient navigation.
- **Customizable Map Filters**: Allows drivers to filter map markers based on their preferences (e.g., accident hotspots, busy points, taxi stands).
- **Real-Time Notifications**: Alerts drivers when they are near accident hotspots or high-demand areas.
- **Driver Focus Monitoring**: Future integration with camera systems will track driver distractions and improve safety.

## Value Proposition

### 1. Reduction in Taxi Accidents

By alerting drivers to accident hotspots, SmartMap helps prevent many accidents. This improves driver and passenger safety and reduces potential losses for taxi companies.

### 2. Decrease in Customer Pick-Up Times

SmartMap ensures that a taxi can reach a customer in **2-5 minutes** in high-demand zones, significantly increasing customer satisfaction. By optimizing taxi stand locations and utilizing real-time demand data, drivers are dispatched efficiently, minimizing wait times.

### 3. Increased Efficiency

By clustering demand areas and taxi stand usage patterns, the system dynamically adjusts stand locations and optimizes taxi routes, reducing idle time for drivers and improving service quality.

## Technologies Used

- **Frontend**:
  - **React.js**: For building a responsive and dynamic user interface.
  - **Tailwind CSS**: For styling and designing the UI components.
  - **JavaScript (ES6+)**: Core programming language for frontend logic.
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

## Future Enhancements

- **Camera Integration**: Integrating with camera systems to track driver distractions.
- **Real-Time Data Collection**: Continuously collecting real-time data to improve the AI model.
- **Mobile Application**: Developing a mobile app version for taxi drivers for easier access on the go.
- **Multi-Language Support**: Adding support for multiple languages to cater to a diverse driver population.
- **Integration with RTA Systems**: Direct integration with RTA systems for seamless data exchange and enhanced functionality.

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js**: v12.x or higher
- **npm**: v6.x or higher
- **Python**: v3.6 or higher
- **pip**: Python package installer
- **Uvicorn**: ASGI server
- **FastAPI**: Python backend framework
- **Nginx**: Web server (for deployment)

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

3. **Update the DashboardPage Component**:

   Ensure you have the latest code from the repository, which includes new features such as customizable map filters and real-time notifications.

4. **Build the Frontend Application**:

   ```bash
   npm run build
   ```

5. **Deploy the Frontend with Nginx**:

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

## Usage

1. **Access the Application**: Open your web browser and navigate to `http://smartmap.cc` or your domain.

2. **Login or Sign Up**: Use the authentication endpoints or the frontend UI to create an account or log in.

3. **Navigate the Dashboard**: After logging in, you'll be directed to the dashboard where you can:

   - View real-time notifications about nearby accident hotspots and high-demand areas.
   - Customize map filters to display or hide accident hotspots, busy points, and taxi stands.
   - Use the interactive map to plan safer and more efficient routes.

4. **Filter Map Markers**:

   - Click on the **Filter** button to open the filter modal.
   - Select or deselect the markers you wish to display on the map.
   - Apply the filters to update the map in real-time.

5. **Navigate to High-Demand Areas**:

   - If a high-demand area is nearby, you'll receive a notification.
   - Click on the **Go** button to navigate to the closest high-demand point.

*Note: Screenshots or a user guide can be added here to help users navigate the application more effectively.*

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

*Note: Due to privacy and licensing restrictions, the datasets are not included in this repository.*

## Team Members

- **Homam Mourad**
- **Mohammad Thabet**
- **Mohamad Hamadeh**
- **Adeeb Mohammed**

**Supervised by**: **Dr. Said Elnaffar**

## Contribution Guidelines

We welcome contributions to improve SmartMap. To contribute:

1. **Fork the Repository**: Click the "Fork" button at the top right of the repository page.

2. **Clone Your Fork**:

   ```bash
   git clone https://github.com/your-username/alibaba-rta-hackathon.git
   ```

3. **Create a New Branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**: Implement your feature or bug fix.

5. **Commit Your Changes**:

   ```bash
   git commit -am "Add new feature"
   ```

6. **Push to Your Fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Submit a Pull Request**: Go to the original repository and create a pull request from your fork.

## Acknowledgements

We extend our gratitude to:

- **Alibaba Cloud** and **Dubai RTA** for hosting the hackathon and providing us with this opportunity.
- **Dr. Said Elnaffar** for his guidance and supervision.
- All team members for their dedication and hard work.

## License

This project is licensed under the [MIT License](LICENSE).

---

*Note: This project was developed as a prototype during a hackathon and may require additional development for production use.*

## Contact

For any inquiries or support, please contact us at:
- **GitHub Issues**: [Create an Issue](https://github.com/h0m4m/alibaba-rta-hackathon/issues)

