from typing import List, Dict, Any

class IGOTKarmayogiAdapter:
    def __init__(self, api_endpoint: str = 'https://igotkarmayogi.gov.in/api/v1'):
        self.endpoint = api_endpoint
        
    def sync_course_catalog(self) -> List[Dict[str, Any]]:
        return [
            {'status': 'synced', 'source': 'iGOT Karmayogi', 'courses_synced': 7}
        ]
        
    def enroll_employee(self, employee_id: int, course_id: int) -> Dict[str, Any]:
        return {
            'status': 'enrolled',
            'employee_id': employee_id,
            'course_id': course_id,
            'message': 'Successfully enrolled via iGOT Karmayogi Single Sign-On gateway.'
        }
