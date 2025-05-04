# server.py
import os
from livekit import api
from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  
load_dotenv()

@app.route('/getToken')
def getToken():
  token = api.AccessToken(os.getenv('LIVEKIT_API_KEY'), os.getenv('LIVEKIT_API_SECRET')) \
    .with_identity("identity") \
    .with_name("my name") \
    .with_grants(api.VideoGrants(
        room_join=True,
        room="my-room",
    ))
  return token.to_jwt()


#TODO : implement an endpoint to dispatch agent. Currently handled through CLI cmd : lk dispatch create --agent-name agent_name --room my-room 

if __name__ == "__main__":
    app.run(debug=True)