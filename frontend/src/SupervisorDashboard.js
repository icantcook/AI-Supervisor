import React, { useState } from 'react';

const SupervisorDashboard = () => {
    const [requests, setRequests] = useState({
        pending: [
            { id: 1, question: "What's the refund policy?", timestamp: new Date() },
            { id: 2, question: "How to reset password?", timestamp: new Date() }
        ],
        resolved: [
            {
                id: 3,
                question: "Where's my order history?",
                answer: "Check 'My Account' section",
                timestamp: new Date()
            }
        ]
    });

    const [knowledgeBase, setKnowledgeBase] = useState([
        { question: "Return policy", answer: "30-day return period" },
        { question: "Contact support", answer: "Email support@company.com" }
    ]);

    const [newAnswer, setNewAnswer] = useState('');
    const [activeRequest, setActiveRequest] = useState(null);

    const handleAnswerSubmit = (requestId, answer) => {
        const request = requests.pending.find(r => r.id === requestId);
        const updatedPending = requests.pending.filter(r => r.id !== requestId);
        const updatedResolved = [...requests.resolved, { ...request, answer }];

        setRequests({
            pending: updatedPending,
            resolved: updatedResolved
        });

        setKnowledgeBase([...knowledgeBase, {
            question: request.question,
            answer: answer
        }]);

        console.log(`Texting caller: ${answer}`);
        setNewAnswer('');
        setActiveRequest(null);
    };

    const handleStartCall = () => {
        console.log("Starting new call...");
        // Add actual call initiation logic here
    };
    return (
        <div style={{
            display: 'flex',
            height: 'calc(100vh - 80px)',
            padding: '20px',
            gap: '20px',
            backgroundColor: '#f5f5f5'
        }}>
            {/* Left Panel */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                {/* Unresolved Queries */}
                <div style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '20px',
                    overflowY: 'auto'
                }}>
                    <h3 style={{ marginTop: 0 }}>Unresolved Queries</h3>
                    {requests.pending.map(request => (
                        <div key={request.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '15px',
                            marginBottom: '10px',
                            border: '1px solid #eee',
                            borderRadius: '4px'
                        }}>
                            <span style={{ flex: 1, fontWeight: 'bold' }}> {request.question}</span>
                            <input
                                type="text"
                                value={activeRequest === request.id ? newAnswer : ''}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                placeholder="Type answer..."
                                style={{
                                    flex: 2,
                                    padding: '8px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            />
                            <button
                                onClick={() => handleAnswerSubmit(request.id, newAnswer)}
                                style={{
                                    flex: 1,
                                    maxWidth: '120px',
                                    padding: '8px 15px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Submit
                            </button>
                        </div>
                    ))}
                </div>

                {/* Resolved Queries */}
                <div style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '20px',
                    overflowY: 'auto'
                }}>
                    <h3 style={{ marginTop: 0 }}>Resolved Queries</h3>
                    {requests.resolved.map(request => (
                        <div key={request.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '15px',
                            marginBottom: '10px',
                            border: '1px solid #eee',
                            borderRadius: '4px',
                            backgroundColor: '#f8f8f8'
                        }}>
                            <span style={{ flex: 1, fontWeight: 'bold' }}> {request.question}</span>
                            <span style={{ flex: 1, color: '#666' }}>{request.answer}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div style={{
                width: '30%',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                {/* Start Call Section (unchanged) */}
                <div style={{
                    height: '25%',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={handleStartCall}
                        style={{
                            padding: '15px 30px',
                            fontSize: '1.1em',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            ':hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    >
                        📞 Start Call
                    </button>
                </div>

                {/* Knowledge Base */}
                <div style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '20px',
                    overflowY: 'auto'
                }}>
                    <h3 style={{ marginTop: 0 }}>Knowledge Base</h3>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        {knowledgeBase.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '15px',
                                border: '1px solid #eee',
                                borderRadius: '4px',
                                backgroundColor: '#fff'
                            }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
                                        <strong style={{ minWidth: '120px' }}>{item.question}</strong>
                                        <span>{item.answer}</span>
                                        <button
                                            onClick={() => console.log("Handle variant")}//handleAnswerSubmit(request.id, newAnswer)}
                                            style={{
                                                flex: 1,
                                                maxWidth: '120px',
                                                padding: '8px 15px',
                                                backgroundColor: '#4CAF50',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Add query variant
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SupervisorDashboard;