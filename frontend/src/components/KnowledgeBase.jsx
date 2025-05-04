import React from 'react';

export default function KnowledgeBase({ entries }) {
    return (
        <section style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '20px', flex: 1, overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>Knowledge Base ({entries.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {entries.map((item, index) => (
                    <div key={item.id || index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#fff' }}>
                        <div style={{ width: '24px', height: '24px', backgroundColor: '#2196F3', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{index + 1}</div>
                        <div style={{ flex: 1 }}>
                            <strong style={{ minWidth: '120px' }}>{item.question}</strong>
                            <span style={{ marginLeft: '10px' }}>{item.answer}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}