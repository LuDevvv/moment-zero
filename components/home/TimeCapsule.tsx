
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Edit2, Trash2, AlertTriangle, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeCapsuleProps {
    wish: string;
    setWish: (value: string) => void;
    username?: string;
    setUsername?: (value: string) => void;
    isSending: boolean;
    onSend: () => void;
    onUpdate?: () => void;
    onDelete?: () => void;
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
    startInEditMode = false
}: TimeCapsuleProps) {
    const isViewMode = mode === "view";
    // If we are in edit mode, are we creating (default) or updating?
    // We assume if onUpdate is provided, we might be updating.
    // Actually, explicit prop is better.
    const isUpdate = !isViewMode && startInEditMode && !!onUpdate;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <motion.div
            key="capsule"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full max-w-2xl text-center space-y-6"
        >
            <h2 className="text-4xl sm:text-5xl font-display text-glow">{titleText}</h2>

            {(subtitleText || !isViewMode) && (
                <p className="text-muted-foreground text-lg max-w-md">
                    {subtitleText}
                </p>
            )}

            <div className="relative w-full flex flex-col gap-4">
                <input
                    type="text"
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-xl sm:text-2xl placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-display disabled:opacity-50 text-center"
                    autoFocus={!isViewMode}
                    readOnly={isViewMode}
                    disabled={isSending}
                    onKeyDown={(e) => !isViewMode && e.key === 'Enter' && (isUpdate ? (onUpdate && onUpdate()) : onSend())}
                />

                {!isViewMode && setUsername && !isUpdate && (
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono opacity-50">momentzero.app/</span>
                        <input
                            type="text"
                            value={username || ""}
                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                            placeholder={usernamePlaceholder || "username"}
                            className="w-full bg-black/20 border border-white/5 rounded-xl p-4 pl-36 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                            disabled={isSending}
                        />
                    </div>
                )}

                {!isViewMode ? (
                    <>
                        <div className="flex gap-3 justify-center w-full">
                            <button
                                onClick={isUpdate ? onUpdate : onSend}
                                disabled={isSending || !wish.trim() || (!isUpdate && setUsername && !username)}
                                className="w-full py-4 bg-primary/20 hover:bg-primary/40 rounded-xl flex items-center justify-center gap-2 transition-all group disabled:opacity-50 disabled:cursor-not-allowed font-medium tracking-wide uppercase text-sm cursor-pointer border border-primary/20"
                            >
                                {isSending ? (
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>{isUpdate ? (updateMomentText || "Update") : (buttonText || "Seal & Generate Link")}</span>
                                        <Send className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                        {limitMessage && <p className="text-xs text-white/30 tracking-wide mt-2">{limitMessage}</p>}
                    </>
                ) : (
                    // View Mode Actions (Icons)
                    (onEdit || onDelete) && (
                        <div className="flex justify-center gap-4 mt-4">
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
                    )
                )}
            </div>

            <button
                onClick={onCancel}
                className="text-sm uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity cursor-pointer mt-4"
                disabled={isSending}
            >
                {cancelText}
            </button>
        </motion.div>
    );
}
