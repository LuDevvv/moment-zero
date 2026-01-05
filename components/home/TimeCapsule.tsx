import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Edit2, Trash2, AlertTriangle, X, Check, Lock } from "lucide-react";

interface TimeCapsuleProps {
    wish: string;
    setWish: (value: string) => void;
    username?: string;
    setUsername?: (value: string) => void;
    isSending: boolean;
    onSend: () => void;
    onUpdate?: () => void;
    onDelete?: () => void;
    onBack?: () => void;
    onCancel: () => void;
    placeholder: string;
    mode?: "view" | "edit";
    limitMessage?: string;
    titleText?: string;
    subtitleText?: string;
    onEdit?: () => void;
    buttonText?: string;
    cancelText?: string;
    editMomentText?: string;
    updateMomentText?: string;
    usernamePlaceholder?: string;
    confirmDeleteText?: string;
    startInEditMode?: boolean;
    onCopyLink?: (username: string) => void;
    copyLinkText?: string;
    showCopyLink?: boolean; // Only show copy link if moment is saved to database
    legalDisclaimerText?: string;
    termsText?: string;
}

export function TimeCapsule({
    wish,
    setWish,
    username,
    setUsername,
    isSending,
    onSend,
    onUpdate,
    onDelete,
    onBack,
    onCancel,
    onEdit,
    placeholder,
    mode = "edit",
    limitMessage,
    titleText = "Time Capsule",
    subtitleText,
    buttonText,
    cancelText,
    editMomentText,
    updateMomentText,
    usernamePlaceholder,
    confirmDeleteText,
    startInEditMode = false,
    onCopyLink,
    copyLinkText,
    showCopyLink = true, // Default to true for backward compatibility
    legalDisclaimerText,
    termsText
}: TimeCapsuleProps) {
    const isViewMode = mode === "view";
    const isUpdate = !isViewMode && startInEditMode && !!onUpdate;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Helper to render legal text with link
    const renderLegalText = () => {
        const text = legalDisclaimerText || "By sealing this moment, you agree to our Terms.";
        const termsLabel = termsText || "Terms";

        if (text.includes("{terms}")) {
            const parts = text.split("{terms}");
            return (
                <p className="text-[10px] text-white/30 text-center mt-4 max-w-xs mx-auto leading-tight">
                    {parts[0]}
                    <a href="/terms" className="underline cursor-pointer hover:text-white/50">{termsLabel}</a>
                    {parts[1]}
                </p>
            );
        }
        return (
            <p className="text-[10px] text-white/30 text-center mt-4 max-w-xs mx-auto leading-tight">
                {text}
            </p>
        );
    };

    return (
        <motion.div
            key="capsule"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full max-w-2xl text-center space-y-4 md:space-y-6 mb-8"
        >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display text-glow">{titleText}</h2>

            {(subtitleText || !isViewMode) && (
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-md">
                    {subtitleText}
                </p>
            )}

            <div className="relative w-full flex flex-col gap-3 md:gap-4">
                <input
                    type="text"
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-black/10 border border-primary/50 rounded-2xl py-4 px-6 md:py-6 md:px-8 text-lg sm:text-xl md:text-2xl text-white placeholder:text-white/40 focus:outline-none focus:bg-black/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-display disabled:opacity-50 text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                    autoFocus={!isViewMode}
                    readOnly={isViewMode}
                    disabled={isSending}
                    onKeyDown={(e) => !isViewMode && e.key === 'Enter' && (isUpdate ? (onUpdate && onUpdate()) : onSend())}
                />

                {!isViewMode && setUsername && (
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-xs md:text-sm font-mono">momentzero.app/</span>
                        <input
                            type="text"
                            value={username || ""}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                            placeholder={usernamePlaceholder || "username"}
                            className={`w-full bg-black/20 border border-primary/20 rounded-2xl py-3 md:py-4 pl-32 pr-4 text-sm md:text-base font-mono focus:outline-none focus:bg-black/40 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all text-white placeholder:text-white/30 ${startInEditMode ? 'opacity-60 cursor-not-allowed bg-black/30' : ''}`}
                            disabled={isSending || startInEditMode}
                            maxLength={20}
                        />
                        {startInEditMode && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" title="Username cannot be changed while updating">
                                <Lock className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                )}

                {/* Main Action Button */}
                {!isViewMode && (
                    <motion.button
                        layout
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startInEditMode && onUpdate ? onUpdate : onSend}
                        disabled={isSending || !wish || (setUsername && !username)}
                        className={`w-full py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg tracking-widest backdrop-blur-md shadow-[0_0_20px_-10px_var(--color-primary)] flex items-center justify-center gap-2 md:gap-3 transition-all bg-primary/20 hover:bg-primary/30 border border-primary/30 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isSending ? (
                            <span>{buttonText ? buttonText.split('...')[0] + '...' : 'Updating...'}</span>
                        ) : (
                            <>
                                <span>{startInEditMode ? (updateMomentText || "Update Moment") : (buttonText || "Seal Intention")}</span>
                                <Send className="w-4 h-4 md:w-5 md:h-5" />
                            </>
                        )}
                    </motion.button>
                )}

                {/* Legal / Terms - Implicit Auth/Cookie Consent */}
                {!isViewMode && renderLegalText()}

                {limitMessage && <p className="text-xs text-white/30 tracking-wide mt-2">{limitMessage}</p>}

                {/* View Mode Actions (Icons) */}
                {isViewMode && (
                    <div className="flex flex-col items-center gap-6 mt-6 w-full">
                        {/* Primary Share Button */}
                        {username && showCopyLink && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (onCopyLink) {
                                        onCopyLink(username);
                                    } else {
                                        // Fallback
                                        const url = `${window.location.origin}/en/u/${username}`;
                                        navigator.clipboard.writeText(url);
                                    }
                                }}
                                className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-white/90 transition-all flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                {copyLinkText || "Copy Link"}
                            </motion.button>
                        )}

                        <div className="flex justify-center gap-4">
                            <AnimatePresence mode="wait">
                                {!showDeleteConfirm ? (
                                    <motion.div
                                        key="actions"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex gap-4 items-center"
                                    >
                                        {onEdit && (
                                            <button
                                                onClick={onEdit}
                                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer group border border-white/5 hover:border-white/20"
                                                title={editMomentText || "Edit"}
                                            >
                                                <Edit2 size={16} />
                                                <span className="text-sm font-medium uppercase tracking-wide opacity-80 group-hover:opacity-100">
                                                    {editMomentText || "Edit"}
                                                </span>
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className="p-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400/70 hover:text-red-400 transition-all cursor-pointer border border-red-500/10 hover:border-red-500/30"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="confirm"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        className="flex items-center gap-3 bg-red-950/40 border border-red-500/30 rounded-full p-1.5 pr-5 backdrop-blur-md"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                                            <AlertTriangle size={14} />
                                        </div>
                                        <span className="text-xs font-medium text-red-200 uppercase tracking-widest whitespace-nowrap">{confirmDeleteText || "Sure?"}</span>
                                        <div className="flex gap-1 ml-1">
                                            <button
                                                onClick={onDelete}
                                                className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-200 transition-colors cursor-pointer"
                                                title="Confirm Delete"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                                                title="Cancel"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={onBack || onCancel}
                className="text-sm uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity cursor-pointer mt-8 px-4 py-2"
                disabled={isSending}
            >
                {cancelText || "Back"}
            </button>
        </motion.div >
    );
}
