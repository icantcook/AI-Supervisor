import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../firebase';

const KnowledgeBaseContext = createContext();

export function KnowledgeBaseProvider({ children }) {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const kbRef = ref(db, 'helpRequests/knowledgeBase');
        const unsubscribe = onValue(kbRef, snapshot => {
            const raw = snapshot.val() || {};
            const arr = Object.entries(raw).map(([id, obj]) => ({
                id,
                question: obj.question,
                answer: obj.answer
            }));
            setEntries(arr);
        });
        return () => off(kbRef);
    }, []);

    return (
        <KnowledgeBaseContext.Provider value={entries}>
            {children}
        </KnowledgeBaseContext.Provider>
    );
}
export const useKnowledgeBase = () => useContext(KnowledgeBaseContext);