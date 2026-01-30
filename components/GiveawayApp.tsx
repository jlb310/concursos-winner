"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { signIn, signOut, useSession } from "next-auth/react";
import { Search, Gift, Users, Trophy, Sparkles, ArrowRight, Instagram, LogOut, Loader2 } from "lucide-react";

export default function GiveawayApp() {
    const { data: session, status: sessionStatus } = useSession();
    const [status, setStatus] = useState<"idle" | "loading_posts" | "selecting" | "analyzing" | "ready" | "picking" | "finished">("idle");
    const [posts, setPosts] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [participants, setParticipants] = useState<any[]>([]);
    const [winner, setWinner] = useState<any>(null);
    const [alternatives, setAlternatives] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch posts when session is ready
    useEffect(() => {
        if (sessionStatus === "authenticated") {
            fetchPosts();
        }
    }, [sessionStatus]);

    const fetchPosts = async () => {
        setStatus("loading_posts");
        setError(null);
        try {
            const res = await fetch("/api/user/posts");
            const data = await res.json();

            if (data.error) {
                setError(data.error);
                setStatus("idle");
            } else {
                setPosts(data.posts || []);
                setStatus("selecting");
            }
        } catch (e) {
            setError("Error al cargar publicaciones.");
            setStatus("idle");
        }
    };

    const handleSelectPost = async (post: any) => {
        setSelectedPost(post);
        setStatus("analyzing");
        setError(null);

        try {
            const res = await fetch(`/api/media/${post.id}/comments`);
            const data = await res.json();

            if (data.error) {
                setError(data.error);
                setStatus("selecting");
                return;
            }

            if (data.comments && data.comments.length > 0) {
                setParticipants(data.comments);
                setStatus("ready");
            } else {
                setError("Este post no tiene comentarios.");
                setStatus("selecting");
            }

        } catch (e) {
            setError("Error al obtener comentarios.");
            setStatus("selecting");
        }
    };

    const pickWinner = () => {
        setStatus("picking");

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
        setStatus("selecting");
        setParticipants([]);
        setWinner(null);
        setAlternatives([]);
        setSelectedPost(null);
    };

    if (sessionStatus === "loading") {
        return <div className="flex justify-center p-20 text-white"><Loader2 className="animate-spin w-10 h-10" /></div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <AnimatePresence mode="wait">

                {/* Login Screen */}
                {sessionStatus === "unauthenticated" && (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col gap-8 bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 shadow-2xl text-center max-w-lg mx-auto"
                    >
                        <div className="mx-auto bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl shadow-lg shadow-purple-500/30">
                            <Gift className="w-12 h-12 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Sorteos Instagram Pro</h2>
                            <p className="text-gray-400">Inicia sesión para elegir un ganador de tus posts.</p>
                        </div>
                        <button
                            onClick={() => signIn("facebook")}
                            className="w-full py-4 bg-[#1877F2] text-white font-bold rounded-xl hover:bg-[#166fe5] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg"
                        >
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Continuar con Facebook
                        </button>
                    </motion.div>
                )}

                {/* Loading Posts */}
                {status === "loading_posts" && (
                    <motion.div key="loading_posts" className="text-center py-20 text-white">
                        <Loader2 className="animate-spin w-12 h-12 mx-auto mb-4 text-purple-500" />
                        <h3 className="text-xl font-bold">Cargando tus publicaciones...</h3>
                    </motion.div>
                )}

                {/* Post Selection */}
                {status === "selecting" && (
                    <motion.div
                        key="selecting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center text-white">
                            <div>
                                <h2 className="text-2xl font-bold">Selecciona una publicación</h2>
                                <p className="text-gray-400 text-sm">Mostrando tus últimos posts</p>
                            </div>
                            <button onClick={() => signOut()} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Cerrar Sessión">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {posts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleSelectPost(post)}
                                    className="cursor-pointer group relative aspect-square bg-gray-900 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all"
                                >
                                    {post.media_url ? (
                                        <img src={post.thumbnail_url || post.media_url} alt={post.caption} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                                            <Instagram className="w-8 h-8" />
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-xs text-white line-clamp-2">{post.caption || "Sin descripción"}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Analyzing */}
                {status === "analyzing" && (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 relative mx-auto mb-8">
                            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-purple-500 border-r-pink-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Obteniendo comentarios...</h3>
                        <p className="text-gray-400">Esto puede tomar unos segundos.</p>
                    </motion.div>
                )}

                {/* Ready to Pick */}
                {status === "ready" && (
                    <motion.div
                        key="ready"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl max-w-2xl mx-auto"
                    >
                        <div className="text-center mb-8">
                            <img src={selectedPost?.thumbnail_url || selectedPost?.media_url} alt="Post" className="w-20 h-20 rounded-lg mx-auto mb-4 object-cover border border-white/20" />
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4">
                                <Users className="w-4 h-4" />
                                {participants.length} Participantes Validados
                            </div>
                            <h2 className="text-2xl font-bold text-white">¡Todo listo!</h2>
                            <p className="text-gray-400">Se han cargado los comentarios reales.</p>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-8 max-h-48 overflow-y-auto p-2 custom-scrollbar">
                            {participants.map((p) => (
                                <div key={p.id} className="flex flex-col items-center gap-2">
                                    <img src={p.avatar} alt={p.username} className="w-10 h-10 rounded-full bg-white/10" />
                                    <span className="text-xs text-gray-400 truncate w-full text-center">{p.username}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={reset} className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">
                                Cancelar
                            </button>
                            <button
                                onClick={pickWinner}
                                className="flex-[2] py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Trophy className="w-5 h-5" />
                                ¡Sortear Ganador!
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Picking Animation */}
                {status === "picking" && (
                    <motion.div
                        key="picking"
                        className="text-center py-20"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                            className="text-6xl mb-8"
                        >
                            🎲
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white">Eligiendo ganador...</h3>
                    </motion.div>
                )}

                {/* Finished */}
                {status === "finished" && winner && (
                    <motion.div
                        key="finished"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6 max-w-xl mx-auto"
                    >
                        <div className="relative bg-gradient-to-b from-yellow-500/20 to-transparent p-1 rounded-3xl">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                                <Trophy className="w-4 h-4" /> GANADOR
                            </div>
                            <div className="bg-black/80 backdrop-blur-xl p-8 rounded-[22px] text-center border border-yellow-500/30">
                                <div className="relative w-32 h-32 mx-auto mb-6">
                                    <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 animate-pulse"></div>
                                    <img src={winner.avatar} alt={winner.username} className="w-full h-full rounded-full border-4 border-yellow-500 relative z-10" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">@{winner.username}</h2>
                                <p className="text-gray-400 italic">"{winner.comment}"</p>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Alternativas</h3>
                            <div className="space-y-4">
                                {alternatives.map((alt, idx) => (
                                    <div key={alt.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">{idx + 1}</div>
                                        <img src={alt.avatar} alt={alt.username} className="w-10 h-10 rounded-full" />
                                        <div className="flex-1"><p className="text-white font-medium">@{alt.username}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={reset}
                            className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                        >
                            Volver a Posts
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
