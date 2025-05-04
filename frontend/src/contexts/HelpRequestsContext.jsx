import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../firebase';

const HelpRequestsContext = createContext();

export function HelpRequestsProvider({ children }) {
    const [pending, setPending] = useState([]);
    const [resolved, setResolved] = useState([]);

    useEffect(() => {
        const requestsRef = ref(db, 'helpRequests/requests');
        const unsubscribe = onValue(requestsRef, snapshot => {
            const raw = snapshot.val() || {};
            const items = Object.entries(raw).map(([id, obj]) => ({
                id,
                question: obj.question,
                timestamp: new Date(obj.createdAt * 1000),
                answer: obj.answer || null,
                status: obj.status,
            }));
            setPending(items.filter(r => r.status === 'pending'));
            setResolved(items.filter(r => r.status === 'resolved'));
        });
        return () => off(requestsRef);
    }, []);

    return (
        <HelpRequestsContext.Provider value={{ pending, resolved }}>
            {children}
        </HelpRequestsContext.Provider>
    );
}
export const useHelpRequests = () => useContext(HelpRequestsContext);