import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface SuggestedReplyProps {
    emailBody: string;
}

export function SuggestedReply({ emailBody }: SuggestedReplyProps) {
    const [reply, setReply] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!emailBody) return;
        setReply("");
        setError("");
        setLoading(true);

        axios
            .post("http://localhost:3001/api/suggest-reply", { emailBody })
            .then((res) => {
                if (res.data?.suggestion) {
                    setReply(res.data.suggestion);
                } else {
                    setError("No suggestion returned from API.");
                }
            })
            .catch((err) => {
                let msg = "An error occurred fetching the suggested reply.";
                if (err.response?.data?.message) {
                    msg += ` (${err.response.data.message})`;
                }
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [emailBody]);

    return (
        <div
            style={{
                background: "#23272e",
                borderRadius: 12,
                marginTop: 30,
                padding: 18,
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            }}
        >
            <h3 style={{ marginBottom: 10, color: "#61dafb" }}>💡 Suggested Reply</h3>
            {loading ? (
                <p style={{ color: "#aaa" }}>Generating reply...</p>
            ) : error ? (
                <p style={{ color: "#ff4d4d", whiteSpace: "pre-wrap" }}>{error}</p>
            ) : reply ? (
                <pre
                    style={{
                        background: "#1a1b1f",
                        padding: "14px",
                        borderRadius: "8px",
                        color: "#d2ffd2",
                        fontSize: "1rem",
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap",
                        margin: 0,
                    }}
                >
                    {reply}
                </pre>
            ) : (
                <p style={{ color: "#888" }}>No reply generated.</p>
            )}
        </div>
    );
}

interface SuggestedRepliesProps {
    replies: string[];
}

export function SuggestedReplies({ replies }: SuggestedRepliesProps) {
    if (!replies || replies.length === 0) {
        return null;
    }

    return (
        <div style={{ marginTop: "20px" }}>
            <h4 style={{ color: "#ccc", marginBottom: "10px" }}>Suggested Replies:</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {replies.map((reply, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.05, backgroundColor: "#444" }}
                        style={{
                            padding: "8px 12px",
                            border: "1px solid #555",
                            borderRadius: "16px",
                            backgroundColor: "#333",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                        }}
                    >
                        {reply}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}