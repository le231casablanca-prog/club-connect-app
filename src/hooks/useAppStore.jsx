import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const AppContext = createContext();

export function AppProvider({ children }) {
    const [members, setMembers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Fetch
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        console.log("useAppStore: fetchAllData started");
        setLoading(true);

        // Timeout de sécurité pour ne pas rester bloqué sur le spinner
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout de connexion au serveur Supabase")), 10000)
        );

        try {
            console.log("useAppStore: Lancement des requêtes Supabase...");
            const results = await Promise.race([
                Promise.all([
                    supabase.from('members').select('*').order('created_at', { ascending: false }),
                    supabase.from('transactions').select('*').order('created_at', { ascending: false }),
                    supabase.from('exercises').select('*').order('created_at', { ascending: false }),
                    supabase.from('sessions').select('*').order('created_at', { ascending: false }),
                    supabase.from('programs').select('*').order('created_at', { ascending: false })
                ]),
                timeoutPromise
            ]);

            const [
                { data: membersData, error: mErr },
                { data: txData, error: tErr },
                { data: exData, error: eErr },
                { data: sessData, error: sErr },
                { data: progData, error: pErr }
            ] = results;

            if (mErr || tErr || eErr || sErr || pErr) {
                console.error("useAppStore: Une ou plusieurs requêtes ont échoué", { mErr, tErr, eErr, sErr, pErr });
            }

            setMembers(membersData || []);
            setTransactions(txData || []);
            setExercises(exData || []);
            setSessions(sessData || []);
            setPrograms(progData || []);
            console.log("useAppStore: Données chargées avec succès");
        } catch (error) {
            console.error("useAppStore: Erreur lors du chargement initial:", error);
        } finally {
            console.log("useAppStore: Fin du chargement (loading = false)");
            setLoading(false);
        }
    };


    // Helpers
    const activeMembersCount = members.filter(m => m.status === 'actif').length;
    const currentMonthRevenue = transactions
        .filter(t => t.status === 'payé')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // --- ACTIONS MEMBRES ---
    const addMember = async (newMember) => {
        // Optimistic UI
        const tempId = Date.now();
        setMembers(prev => [{ ...newMember, id: tempId }, ...prev]);

        const { data, error } = await supabase.from('members').insert([newMember]).select();
        if (error) {
            console.error("Erreur addMember:", error);
            // Revert on error
            setMembers(prev => prev.filter(m => m.id !== tempId));
        } else if (data) {
            // Replace temp id with real db id
            setMembers(prev => prev.map(m => m.id === tempId ? data[0] : m));
        }
    };

    const deleteMember = async (id) => {
        // Optimistic UI
        const previousMembers = [...members];
        setMembers(prev => prev.filter(m => m.id !== id));

        const { error } = await supabase.from('members').delete().eq('id', id);
        if (error) {
            console.error("Erreur deleteMember:", error);
            setMembers(previousMembers); // Revert
        }
    };

    // --- ACTIONS TRANSACTIONS ---
    const addTransaction = async (transaction) => {
        const tempId = Date.now();
        setTransactions(prev => [{ ...transaction, id: tempId }, ...prev]);

        const { data, error } = await supabase.from('transactions').insert([transaction]).select();
        if (error) {
            console.error("Erreur addTransaction:", error);
            setTransactions(prev => prev.filter(t => t.id !== tempId));
        } else if (data) {
            setTransactions(prev => prev.map(t => t.id === tempId ? data[0] : t));
        }
    };

    // --- ACTIONS PROGRAMMES / SEANCES ---
    const addProgram = async (program) => {
        const tempId = Date.now();
        setPrograms(prev => [{ ...program, id: tempId }, ...prev]);

        const { data, error } = await supabase.from('programs').insert([program]).select();
        if (error) {
            console.error("Erreur addProgram:", error);
            setPrograms(prev => prev.filter(p => p.id !== tempId));
        } else if (data) {
            setPrograms(prev => prev.map(p => p.id === tempId ? data[0] : p));
        }
    };

    const addSession = async (session) => {
        const tempId = Date.now();
        setSessions(prev => [{ ...session, id: tempId }, ...prev]);

        const { data, error } = await supabase.from('sessions').insert([session]).select();
        if (error) {
            console.error("Erreur addSession:", error);
            setSessions(prev => prev.filter(s => s.id !== tempId));
        } else if (data) {
            setSessions(prev => prev.map(s => s.id === tempId ? data[0] : s));
        }
    };

    const assignProgramToMember = async (programId, memberId) => {
        const program = programs.find(p => p.id === programId);
        if (!program || program.assigned_to?.includes(memberId)) return;

        const newAssignedTo = [...(program.assigned_to || []), memberId];

        // Optimistic
        setPrograms(prev => prev.map(p => p.id === programId ? { ...p, assigned_to: newAssignedTo } : p));

        const { error } = await supabase.from('programs').update({ assigned_to: newAssignedTo }).eq('id', programId);
        if (error) {
            console.error("Erreur assignProgramToMember:", error);
            // Revert
            setPrograms(prev => prev.map(p => p.id === programId ? { ...p, assigned_to: program.assigned_to } : p));
        }
    };

    const store = {
        members,
        setMembers,
        addMember,
        deleteMember,
        activeMembersCount,
        transactions,
        setTransactions,
        addTransaction,
        exercises,
        setExercises, // Fallback interne
        sessions,
        setSessions,
        addSession,
        programs,
        setPrograms,
        addProgram,
        assignProgramToMember,
        currentMonthRevenue,
        loading
    };

    return (
        <AppContext.Provider value={store}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppStore = () => useContext(AppContext);

