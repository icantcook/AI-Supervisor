import React, { useEffect, useState } from 'react';
import { LiveKitRoom, RoomAudioRenderer, ControlBar, MediaDeviceSelect } from '@livekit/components-react';
import '@livekit/components-styles';


function LiveKitWindow() {
    const [token, setToken] = useState(null);
    const identity = 'user_' + Math.floor(Math.random() * 1000);
    const roomName = 'my-room';
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    // const serverUrl = 'wss://ai-supervisor-6r7louaq.livekit.cloud/';
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDYzNjc4ODAsImlzcyI6IkFQSURQYktTNVRYOXJlaCIsIm5iZiI6MTc0NjM2MDY4MCwic3ViIjoicXVpY2tzdGFydCB1c2VyIHVtOWZiciIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJxdWlja3N0YXJ0IHJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.NbP6sSjOADz77MJsQqOUIJlq2z0P0CI_rs80Vg4XbLc';

    useEffect(() => {
        // Fetch the token from your backend
        fetch(`http://127.0.0.1:5000/getToken?identity=${identity}&room=${roomName}`)
            .then((res) => res.text())
            .then((data) => setToken(data))
            .catch((err) => console.error('Error fetching token:', err));
    }, []);

    if (!token) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', height: '100%', backgroundColor: '#fff' }}>
            <h4>LiveKit Call Window</h4>
            <LiveKitRoom
                serverUrl={serverUrl}
                token={token}
                connect={true}
                video={false}
                audio={true}
                style={{ height: '5vh' }}
            >
                {/* <MediaDeviceSelect kind="audioinput" /> */}

                <RoomAudioRenderer />
                <ControlBar />
            </LiveKitRoom>
        </div>
    );

}
export default LiveKitWindow;
