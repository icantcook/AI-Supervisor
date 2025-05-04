
from firebase_admin import credentials,db,initialize_app,get_app,delete_app
from dotenv import load_dotenv
import os
from firebase_admin.db import Event
from typing import Any, Dict
import threading
from pathlib import Path

load_dotenv()

# # Initialize the app with a service account, granting admin privileges
# initialize_app(cred, {
# 'databaseURL': 'https://your-database-name.firebaseio.com'
# })

# # Set data in the Realtime Database
# ref = db.reference('users/user_id')
# ref.set({
# 'name': 'John Doe',
# 'email': 'john.doe@example.com'
# })

# # Get data from the Realtime Database
# snapshot = ref.get()
# print(f'Data: {snapshot}')



# def callback(event: Event):
#     """Handle real-time database updates"""
#     print(f"\nEvent type: {event.event_type}")
#     print(f"Path: {event.path}")
#     print(f"Data: {event.data}")
    
#     # Add your custom logic here
#     if event.path == '/':
#         print("Full data update:")
#     elif 'name' in event.path:
#         print("Name changed:")
#     elif 'email' in event.path:
#         print("Email changed:")

# # Start listening for changes
# try:
#     print("Starting real-time listener...")
#     ref.listen(callback)
# finally:
#     # Clean up Firebase connection
#     db._database.close()


class FirebaseContextManager():
    """Manages Firebase connection and context synchronization"""
    def __init__(self):
        self.context: Dict[str, Any] = {}
        self._lock = threading.Lock()
        self._listener = None
        self._initialized = False
        
        # Initialize Firebase synchronously
        self._initialize_firebase()
        self._load_initial_context()
        
    def _initialize_firebase(self) -> None:
        """Set up Firebase connection with thread safety"""
        with self._lock:
            if self._initialized:
                return
            
            try:
                get_app()
            except ValueError:
                print("Initializing Firebase...")

                current_dir = Path(__file__).parent
                key_path = current_dir / 'ai-supervisor-key.json'
                cred = credentials.Certificate(str(key_path))
                database_url = os.getenv('FIREBASE_DATABASE_URL')
                initialize_app(cred, {'databaseURL': database_url})
                self._initialized = True

    def _load_initial_context(self) -> None:
        """Load entire database state into context at startup"""
        print("Fetching initial context...")

        with self._lock:
            root_ref = db.reference('/')
            snapshot = root_ref.get()
            self.context = snapshot if snapshot else {}
            
            print("Initial context loaded:")
            print(self.context)
            # Start listening for changes after initial load
            # self._listener = root_ref.listen(self._update_context)

    # def _update_context(self, event: Event) -> None:
    #     """Handle real-time updates and maintain context"""
    #     with self._lock:
    #         keys = event.path.strip('/').split('/')
    #         current = self.context
            
    #         try:
    #             # Navigate to the target position in the context dict
    #             for key in keys[:-1]:
    #                 if key not in current:
    #                     current[key] = {}
    #                 current = current[key]
                
    #             # Update or delete the value
    #             if event.data is None:  # Handle deletions
    #                 if keys[-1] in current:
    #                     del current[keys[-1]]
    #             else:
    #                 current[keys[-1]] = event.data
    #         except KeyError:
    #             pass  # Handle potential race conditions

    def get_value(self, path: str = "") -> Any:
        """Thread-safe access to specific context values"""

        print("Getting context values")

        with self._lock:
            keys = path.strip('/').split('/') if path else []
            current = self.context
            
            for key in keys:
                if not isinstance(current, dict) or key not in current:
                    return None
                current = current[key]
            
            return current
    
    def close(self) -> None:
        """Clean up resources"""
        print("Closing Firebase connection...")
        app = get_app()
        delete_app(app)

        with self._lock:
            if self._listener:
                self._listener.close()
            self._initialized = False
            