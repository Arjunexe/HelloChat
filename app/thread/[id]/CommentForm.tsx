"use client";

import { useState } from "react";
import Link from "next/link";
import { addComment } from "../action";

interface CommentFormProps {
    threadId: string;
    isLoggedIn?: boolean;
}

export default function CommentForm({ threadId, isLoggedIn = false }: CommentFormProps) {
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Show login prompt for guests
    if (!isLoggedIn) {
        return (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <p className="text-neutral-400 mb-3">Want to join the conversation?</p>
                <Link
                    href="/login"
                    className="inline-block bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    Login to Comment
                </Link>
            </div>
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!text.trim()) return;

        setIsSubmitting(true);
        setError("");

        try {
            const result = await addComment({ threadId, text: text.trim() });

            if (result.error) {
                setError(result.error);
            } else {
                setText("");
                // The page will revalidate automatically due to revalidatePath
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-neutral-800/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-600 outline-none placeholder:text-neutral-500 border border-white/10 transition-all"
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !text.trim()}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all transform active:scale-95"
                >
                    {isSubmitting ? "..." : "Post"}
                </button>
            </div>
        </form>
    );
}
