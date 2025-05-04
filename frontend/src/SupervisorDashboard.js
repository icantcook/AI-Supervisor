import React, { useState } from 'react';
import LiveKitWindow from './livekit';
import RequestsList from './components/RequestList';
import KnowledgeBase from './components/KnowledgeBase';
import { useHelpRequests } from './contexts/HelpRequestsContext';
import { useKnowledgeBase } from './contexts/KnowledgeBaseContext';
import { ref, update, push } from 'firebase/database';
import { db } from './firebase';

export default function SupervisorDashboard() {
    const { pending, resolved } = useHelpRequests();
    const kbEntries = useKnowledgeBase();
    const [showLiveKit, setShowLiveKit] = useState(false);

    const handleAnswerSubmit = async (requestId, answer) => {
        // find the question text
        const req = pending.find(r => r.id === requestId);
        if (!req) return;

        // update the request in RTDB
        await update(ref(db, `helpRequests/requests/${requestId}`), {
            status: 'resolved',
            answer
        });

        // add to knowledge base
        const newKBRef = push(ref(db, 'helpRequests/knowledgeBase'));
        await update(newKBRef, {
            question: req.question,
            answer
        });
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 80px)', padding: '20px', gap: '20px', backgroundColor: '#f5f5f5' }}>

            {/* Left Panel */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <RequestsList title="Unresolved Queries" items={pending} onAnswerSubmit={handleAnswerSubmit} isPending />
                <RequestsList title="Resolved Queries" items={resolved} isPending={false} />
            </div>

            {/* Right Panel */}
            <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {showLiveKit && <LiveKitWindow />}
                <div style={{ height: '25%', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button onClick={() => setShowLiveKit(true)} style={{ padding: '15px 30px', fontSize: '1.1em', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', transition: 'transform 0.2s' }}>
                        📞 Start Call
                    </button>
                </div>
                <KnowledgeBase entries={kbEntries} />
            </div>
        </div>
    );
}

