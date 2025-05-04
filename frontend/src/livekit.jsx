import React, { useEffect, useState } from 'react';
import { LiveKitRoom, RoomAudioRenderer, ControlBar, MediaDeviceSelect } from '@livekit/components-react';
import '@livekit/components-styles';


function LiveKitWindow() {
    const [token, setToken] = useState(null);
    const identity = 'user_' + Math.floor(Math.random() * 1000);
    const roomName = 'my-room';
    const serverUrl = process.env.REACT_APP_SERVER_URL;

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
    );

}
export default LiveKitWindow;
