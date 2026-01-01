"use client";
import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, Volume1 } from 'lucide-react';
import { cn } from '@/lib/utils';

const tracks = [
    { id: 'void', code: 'audioVoid', url: '/audio/void.mp3' },
    { id: 'nebula', code: 'audioNebula', url: '/audio/nebula.mp3' },
    { id: 'pulse', code: 'audioPulse', url: '/audio/pulse.mp3' },
];

interface AmbientPlayerProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: any;
}

export function AmbientPlayer({ t }: AmbientPlayerProps) {
    const [currentTrack, setCurrentTrack] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.2); // Default low volume
    const [isHovering, setIsHovering] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize state from localStorage
    useEffect(() => {
        const savedVolume = localStorage.getItem("mz-volume");
        if (savedVolume) {
            setVolume(parseFloat(savedVolume));
        }
    }, []);

    // Sync volume with audio element and localStorage
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
        localStorage.setItem("mz-volume", volume.toString());
    }, [volume]);

    useEffect(() => {
        // Handle Play/Pause logic
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play prevented (expected first time):", error);
                });
            }
        } else {
            audio.pause();
        }
    }, [isPlaying, currentTrack]);

    const togglePlayback = () => {
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        setCurrentTrack((prev) => (prev + 1) % tracks.length);
    };

    // When track changes, reload and play
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(e => console.error("Playback error", e));
        }
    }, [currentTrack]);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    return (
        <div
            className="fixed bottom-6 left-6 z-50 flex items-center gap-4 group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <audio
                ref={audioRef}
                src={tracks[currentTrack].url}
                loop
                preload="metadata"
            />

            <div className="relative flex items-center">
                <button
                    onClick={togglePlayback}
                    className="p-3 rounded-full glass-panel hover:bg-white/10 text-white/50 hover:text-white transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/5 active:scale-95 z-20"
                    title={isPlaying ? t?.mute : t?.play}
                >
                    {isPlaying ? (
                        volume > 0.5 ? <Volume2 size={18} className="text-primary" /> : <Volume1 size={18} className="text-primary" />
                    ) : (
                        <VolumeX size={18} />
                    )}
                </button>

                {/* Volume Slider - Reveal on Hover */}
                <div className={cn(
                    "absolute left-full ml-2 flex items-center bg-black/40 backdrop-blur-md rounded-full px-3 py-2 transition-all duration-300 origin-left border border-white/5",
                    (isHovering && isPlaying) ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-90 -translate-x-4 pointer-events-none"
                )}>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            </div>

            {isPlaying && (
                <div className={cn(
                    "hidden sm:flex items-center gap-3 animate-in fade-in slide-in-from-left-4 p-2 pl-4 pr-2 rounded-full glass-panel border border-white/5 transition-all duration-300",
                    isHovering ? "ml-26" : "" // Make space for the slider sliding out
                )}>
                    <div className="flex flex-col min-w-[80px]">
                        <span className="text-[8px] uppercase tracking-widest text-muted-foreground leading-none mb-1">{t?.ambientTitle}</span>
                        <span className="text-xs font-medium text-white leading-none whitespace-nowrap">{t?.[tracks[currentTrack].code]}</span>
                    </div>
                    <button
                        onClick={nextTrack}
                        className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                        title={t?.nextTrack}
                    >
                        <SkipForward size={14} />
                    </button>

                    <div className="flex items-center gap-0.5 h-3 w-8">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="w-1 bg-primary/80 rounded-full animate-pulse"
                                style={{
                                    height: '100%',
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: '0.8s',
                                    opacity: 0.3 + (volume * 0.7) // Visualize volume intensity
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
