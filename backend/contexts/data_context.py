from db.firebase import FirebaseContextManager
from typing import Any, Dict
import threading
from pathlib import Path
import json
import time

class DataContext:
    """Main context manager that aggregates data sources."""
    def __init__(self):
        self._sources_lock = threading.RLock()
        self.firebase = FirebaseContextManager()
        # Add other data sources here (e.g., database, API clients)

    def get_value(self, path: str = "", source: str = "firebase") -> Any:
        """Universal accessor with source routing."""
        print(f"Routing get_value('{path}') to source '{source}'", flush=True)
        with self._sources_lock:
            if source == "firebase":
                return self.firebase.get_value(path)
            raise ValueError(f"Unknown data source: {source}")

    def get_knowledge_base_context(self, paths: list[str]) -> str:
        entries = []
        for path in paths:
            value = self.get_value(path)
            if isinstance(value, dict):
                # flatten dict entries
                entries.extend(f"{k} - {v}" for k, v in value.items())
            elif value is not None:
                entries.append(f"{path.rsplit('/',1)[-1]} - {value}")
        return ". ".join(entries) + "." if entries else ""
    
    def create_help_request(self, question: str, customer_contact: str = "9999999999") -> str:
        """Thread-safe method to create help requests in Firebase"""

        # Request payload
        request_data = {
            "customerContact": customer_contact,
            "question": question,
            "status": "pending",
            "createdAt": int(time.time()),
            "timeoutAt": int(time.time()) + 86400,
            "answer": None,
            "supervisorId": None
        }
        additional_updates={
                "helpRequests/status/{request_id}": "Pending"
            }
        return self.firebase.push_value("helpRequests/requests", request_data,additional_updates)
        

    def close(self) -> None:
        """Clean up all resources."""
        print("Closing DataContext…", flush=True)
        with self._sources_lock:
            self.firebase.close()

@staticmethod
def get_instruction_set():
    current_dir = Path(__file__).parent
    key_path = current_dir / 'instructions.txt'

    with open(str(key_path), "r", encoding="utf-8") as file:
        content = file.read()

    strings_by_line = content.splitlines()
    combined_string = '. '.join(strings_by_line)
    if not combined_string.endswith('.'):
        combined_string += '.'

    return combined_string