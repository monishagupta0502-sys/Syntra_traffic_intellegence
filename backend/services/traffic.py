from typing import List, Dict, Any

ROADS_DATA = [
    {
        "id": "R-101",
        "name": "PVNR Elevated Expressway (Mehdipatnam - Aramghar)",
        "category": "highway",
        "coordinates": [[17.3948, 78.4412], [17.3812, 78.4425], [17.3620, 78.4438], [17.3385, 78.4452]],
        "speedLimit": 80,
        "freeFlowSpeed": 75,
        "currentSpeed": 62,
        "vehicleCount": 220,
        "flow": 2100,
        "density": 29,
        "queueLength": 85,
        "waitingTime": 22,
        "travelTime": 6.8,
        "congestionLevel": "normal",
        "lanes": 4,
        "capacity": 3600,
        "lengthMeters": 7200,
        "connectedRoadIds": ["R-106", "R-111"]
    },
    {
        "id": "R-102",
        "name": "Cyber Towers & Hitec City Arterial (Mindspace - Madhapur)",
        "category": "arterial",
        "coordinates": [[17.4425, 78.3775], [17.4502, 78.3808], [17.4485, 78.3915], [17.4420, 78.4025], [17.4325, 78.4085]],
        "speedLimit": 50,
        "freeFlowSpeed": 48,
        "currentSpeed": 19,
        "vehicleCount": 380,
        "flow": 2450,
        "density": 64,
        "queueLength": 520,
        "waitingTime": 145,
        "travelTime": 12.4,
        "congestionLevel": "severe",
        "lanes": 4,
        "capacity": 3200,
        "lengthMeters": 3400,
        "connectedRoadIds": ["R-103", "R-104", "R-107", "R-109"],
        "incidentStatus": "Peak Tech Commute Surge"
    },
    {
        "id": "R-103",
        "name": "Gachibowli - Financial District Spine (ORR Radial)",
        "category": "highway",
        "coordinates": [[17.4402, 78.3485], [17.4335, 78.3625], [17.4255, 78.3750], [17.4180, 78.3845]],
        "speedLimit": 100,
        "freeFlowSpeed": 95,
        "currentSpeed": 74,
        "vehicleCount": 310,
        "flow": 2800,
        "density": 32,
        "queueLength": 120,
        "waitingTime": 25,
        "travelTime": 4.8,
        "congestionLevel": "normal",
        "lanes": 6,
        "capacity": 5400,
        "lengthMeters": 4600,
        "connectedRoadIds": ["R-102", "R-109", "R-114"]
    },
    {
        "id": "R-104",
        "name": "Jubilee Hills Checkpost & Road No. 36 Arterial",
        "category": "arterial",
        "coordinates": [[17.4345, 78.3885], [17.4312, 78.4020], [17.4285, 78.4140], [17.4260, 78.4235]],
        "speedLimit": 50,
        "freeFlowSpeed": 46,
        "currentSpeed": 22,
        "vehicleCount": 260,
        "flow": 1820,
        "density": 54,
        "queueLength": 410,
        "waitingTime": 110,
        "travelTime": 9.8,
        "congestionLevel": "heavy",
        "lanes": 3,
        "capacity": 2200,
        "lengthMeters": 3100,
        "connectedRoadIds": ["R-102", "R-106", "R-107"],
        "incidentStatus": "Checkpost Bottleneck"
    },
    {
        "id": "R-107",
        "name": "Durgam Cheruvu Cable Bridge & Mindspace Link",
        "category": "connector",
        "coordinates": [[17.4385, 78.3830], [17.4340, 78.3910], [17.4290, 78.4005]],
        "speedLimit": 45,
        "freeFlowSpeed": 45,
        "currentSpeed": 17,
        "vehicleCount": 195,
        "flow": 1420,
        "density": 68,
        "queueLength": 390,
        "waitingTime": 120,
        "travelTime": 7.6,
        "congestionLevel": "severe",
        "lanes": 2,
        "capacity": 1400,
        "lengthMeters": 1750,
        "connectedRoadIds": ["R-102", "R-104"],
        "incidentStatus": "Lane Obstruction"
    }
]

class TrafficService:
    def get_network(self) -> List[Dict[str, Any]]:
        return ROADS_DATA

    def get_current_traffic(self) -> Dict[str, Any]:
        return {
            "roads": ROADS_DATA,
            "mean_velocity_kmh": 34.2,
            "total_active_vehicles": 1942,
            "network_delay_min": 4.6
        }

    def get_bottlenecks(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "BTN-HYD-01",
                "roadId": "R-102",
                "roadName": "Cyber Towers & Hitec City Arterial",
                "location": [17.4502, 78.3808],
                "severity": "critical",
                "queueLengthM": 520,
                "delayMinutes": 12.4,
                "speedRatio": 0.39,
                "reason": "Heavy tech commuter converge at Cyber Towers signal junction with capacity saturation."
            },
            {
                "id": "BTN-HYD-02",
                "roadId": "R-107",
                "roadName": "Durgam Cheruvu Cable Bridge & Mindspace Link",
                "location": [17.4340, 78.3910],
                "severity": "critical",
                "queueLengthM": 390,
                "delayMinutes": 7.6,
                "speedRatio": 0.37,
                "reason": "Active collision incident reducing corridor capacity by 50%."
            }
        ]

traffic_service = TrafficService()
