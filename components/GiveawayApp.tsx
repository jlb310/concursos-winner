"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Search, Gift, Users, Trophy, Sparkles, ArrowRight } from "lucide-react";

// Mock data generator
const generateMockParticipants = (count: number) => {
    const users = [
        "sofia_gomez", "mateo_rodriguez", "valentina_perez", "santiago_lopez",
        "camila_martinez", "nicolas_gonzalez", "isabella_fernandez", "lucas_torres",
        "mariana_ramirez", "benjamin_diaz", "victoria_morales", "joaquin_castro",
        "emilia_herrera", "agustin_jimenez", "catalina_silva", "felipe_rojas",
        "antonella_vargas", "tomas_munoz", "martina_ortiz", "gabriel_ruiz",
        "florencia_soto", "daniel_medina", "josefina_navarro", "bruno_guerrero",
        "renata_cardenas", "vicente_cortes", "maite_araya", "matias_sepulveda",
        "trinidad_espinoza", "diego_fuentes", "javiera_lara", "sebastian_mora",
        "constanza_valenzuela", "cristobal_carvajal", "antonia_pizarro", "maximiliano_campos",
        "francisca_olivares", "julian_tapia", "ignacia_bustos", "alonso_salinas",
        "amanda_pacheco", "martin_rivera", "fernanda_alvarado", "simon_paredes",
        "elena_miranda", "pedro_vera", "laura_maldonado", "andres_rios",
        "paula_toledo", "javier_palma"
    ];

    return Array.from({ length: count }, (_, i) => ({
        id: i,
        username: users[i % users.length] + (Math.floor(i / users.length) > 0 ? `_${i}` : ""),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        comment: "Participando! 🔥",
    }));
};

export default function GiveawayApp() {
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "ready" | "picking" | "finished">("idle");
    const [participants, setParticipants] = useState<any[]>([]);
    const [winner, setWinner] = useState<any>(null);
    const [alternatives, setAlternatives] = useState<any[]>([]);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const handleAnalyze = () => {
        if (!url) return;
        setStatus("loading");
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                clearInterval(interval);
                setParticipants(generateMockParticipants(Math.floor(Math.random() * 50) + 20)); // 20-70 participants
                setStatus("ready");
            }
            setLoadingProgress(Math.min(progress, 100));
        }, 200);
    };

    const pickWinner = () => {
        setStatus("picking");

        // Simulate shuffling effect
        setTimeout(() => {
            const shuffled = [...participants].sort(() => 0.5 - Math.random());
            const selectedWinner = shuffled[0];
            const selectedAlternatives = shuffled.slice(1, 4);

            setWinner(selectedWinner);
            setAlternatives(selectedAlternatives);
            setStatus("finished");
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FFA500', '#FF4500']
            });
        }, 3000);
    };

    const reset = () => {
        setStatus("idle");
        setUrl("");
        setParticipants([]);
        setWinner(null);
        setAlternatives([]);
        setLoadingProgress(0);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <AnimatePresence mode="wait">
                {status === "idle" && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col gap-6 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
                    >
                        <div className="text-center space-y-2">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                                <Gift className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Sorteos Instagram</h2>
                            <p className="text-gray-400">Pega la URL de tu post para comenzar</p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
                                <div className="relative flex items-center bg-black rounded-xl p-1">
                                    <Search className="w-5 h-5 text-gray-400 ml-3" />
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://www.instagram.com/p/..."
                                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 py-3 px-4 outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={!url}
                                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                Analizar Comentarios
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            * Esta es una versión demo. Simula la obtención de datos.
                        </p>
                    </motion.div>
                )}

                {status === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 relative mx-auto mb-8">
                            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                            <div
                                className="absolute inset-0 border-4 border-t-purple-500 border-r-pink-500 border-b-transparent border-l-transparent rounded-full animate-spin"
                            ></div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Analizando Post...</h3>
                        <p className="text-gray-400 mb-4">{Math.round(loadingProgress)}% completado</p>
                        <div className="w-64 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                style={{ width: `${loadingProgress}%` }}
                            />
                        </div>
                    </motion.div>
                )}

                {status === "ready" && (
                    <motion.div
                        key="ready"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
                    >
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
                                <Users className="w-4 h-4" />
                                {participants.length} Participantes encontrados
                            </div>
                            <h2 className="text-2xl font-bold text-white">¡Todo listo!</h2>
                            <p className="text-gray-400">Hemos cargado los comentarios exitosamente.</p>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-8 max-h-48 overflow-y-auto p-2 custom-scrollbar">
                            {participants.map((p) => (
                                <div key={p.id} className="flex flex-col items-center gap-2">
                                    <img src={p.avatar} alt={p.username} className="w-10 h-10 rounded-full bg-white/10" />
                                    <span className="text-xs text-gray-400 truncate w-full text-center">{p.username}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={pickWinner}
                            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Trophy className="w-5 h-5" />
                            ¡Sortear Ganador!
                        </button>
                    </motion.div>
                )}

                {status === "picking" && (
                    <motion.div
                        key="picking"
                        className="text-center py-20"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="text-6xl mb-8"
                        >
                            🎲
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white">Eligiendo ganador...</h3>
                    </motion.div>
                )}

                {status === "finished" && winner && (
                    <motion.div
                        key="finished"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        {/* Winner Card */}
                        <div className="relative bg-gradient-to-b from-yellow-500/20 to-transparent p-1 rounded-3xl">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                                <Trophy className="w-4 h-4" /> GANADOR
                            </div>
                            <div className="bg-black/80 backdrop-blur-xl p-8 rounded-[22px] text-center border border-yellow-500/30">
                                <div className="relative w-32 h-32 mx-auto mb-6">
                                    <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 animate-pulse"></div>
                                    <img
                                        src={winner.avatar}
                                        alt={winner.username}
                                        className="w-full h-full rounded-full border-4 border-yellow-500 relative z-10"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black p-2 rounded-full z-20">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">@{winner.username}</h2>
                                <p className="text-gray-400 italic">"{winner.comment}"</p>
                            </div>
                        </div>

                        {/* Alternatives */}
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Alternativas</h3>
                            <div className="space-y-4">
                                {alternatives.map((alt, idx) => (
                                    <div key={alt.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">
                                            {idx + 1}
                                        </div>
                                        <img src={alt.avatar} alt={alt.username} className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <p className="text-white font-medium">@{alt.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={reset}
                            className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                        >
                            Nuevo Sorteo
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
