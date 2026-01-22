"use client";

import { useState } from "react";

interface ShareButtonProps {
    threadId: string;
    title: string;
}

export default function ShareButton({ threadId, title }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = `${window.location.origin}/thread/${threadId}`;

        // Try native share API first (mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Check out this thread on All-Chat: ${title}`,
                    url: url,
                });
                return;
            } catch (err) {
                // User cancelled or share failed, fall through to copy
            }
        }

        // Fallback to clipboard copy
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all text-sm"
        >
            {copied ? (
                <>
                    <CheckIcon className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Link Copied!</span>
                </>
            ) : (
                <>
                    <ShareIcon className="w-4 h-4" />
                    <span>Share</span>
                </>
            )}
        </button>
    );
}

function ShareIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
    );
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
