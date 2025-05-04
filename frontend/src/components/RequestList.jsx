import React, { useState } from 'react';

export default function RequestsList({ title, items, onAnswerSubmit, isPending }) {
    const [answers, setAnswers] = useState({});

    return (
        <section style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '20px', flex: 1, overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>{title} ({items.length})</h3>
            {items.map(r => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', marginBottom: '10px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: isPending ? '#fff' : '#f8f8f8' }}>
                    <span style={{ flex: 1, fontWeight: 'bold' }}>{r.question}</span>
                    {isPending ? (
                        <>
                            <input
                                type="text"
                                value={answers[r.id] || ''}
                                onChange={e => setAnswers({ ...answers, [r.id]: e.target.value })}
                                placeholder="Type answer..."
                                style={{ flex: 2, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                            <button
                                onClick={() => {
                                    onAnswerSubmit(r.id, answers[r.id] || '');
                                    setAnswers(prev => ({ ...prev, [r.id]: '' }));
                                }}
                                style={{ flex: 1, maxWidth: '120px', padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >Submit</button>
                        </>
                    ) : (
                        <span style={{ flex: 1, color: '#666' }}>{r.answer}</span>
                    )}
                </div>
            ))}
        </section>
    );
}

