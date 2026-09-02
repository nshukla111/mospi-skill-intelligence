from typing import List, Dict, Any

class NSSTATPACAdapter:
    def __init__(self, calendar_url: str = 'https://nssta.gov.in/tpac/calendar/2026'):
        self.url = calendar_url
        
    def fetch_training_calendar(self) -> List[Dict[str, Any]]:
        return [
            {'academy': 'NSSTA Greater Noida', 'status': 'connected', 'programmes_active': 5}
        ]
        
    def submit_nomination(self, employee_id: int, programme_id: int) -> Dict[str, Any]:
        return {
            'status': 'nominated',
            'employee_id': employee_id,
            'programme_id': programme_id,
            'message': 'Official nomination submitted to MoSPI Training Division & NSSTA Academic Advisory Council.'
        }
