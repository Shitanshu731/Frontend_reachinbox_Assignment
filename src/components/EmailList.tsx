import React, { useState, useEffect, JSX } from "react";
// import axios from "axios"; // No longer needed
import { Email } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { SuggestedReply } from "./suggestedReply";
import emailData from "./emails.json"; // Import the JSON file directly

export function EmailList(): JSX.Element {
  const [allEmails, setAllEmails] = useState<Email[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Set initial loading to false
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Process the imported data instead of fetching
    try {
      const formattedEmails = emailData.map((email: any) => ({
        ...email,
        id: `${email.account}-${email.id}`,
        date: new Date(email.date),
      }));
      setAllEmails(formattedEmails);
      setFilteredEmails(formattedEmails);
    } catch (err) {
      setError("Failed to process emails.json.");
      console.error(err);
    }
  }, []); // Run only once on mount

  useEffect(() => {
    const lowercasedSearch = search.toLowerCase();
    const results = allEmails.filter(
      (email) =>
        email.subject.toLowerCase().includes(lowercasedSearch) ||
        email.from.toLowerCase().includes(lowercasedSearch) ||
        email.body.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredEmails(results);
  }, [search, allEmails]);

  const selectedEmail = filteredEmails.find((email) => email.id === selectedId);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ position: "relative" }}
    >
      <motion.input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search emails..."
        style={{
          width: "calc(100% - 28px)",
          padding: "14px",
          marginBottom: "28px",
          fontSize: "1rem",
          borderRadius: "10px",
          border: "1px solid #333",
          backgroundColor: "#222",
          color: "white",
        }}
        whileFocus={{
          scale: 1.02,
          borderColor: "#007BFF",
          boxShadow: "0 0 8px #007BFF",
        }}
      />

      <AnimatePresence>
        {loading && (
          <motion.p key="loading" exit={{ opacity: 0 }}>
            Loading emails...
          </motion.p>
        )}
        {error && (
          <motion.p
            key="error"
            style={{ color: "#ff4d4d" }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {!loading && !error && (
        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredEmails.length > 0 ? (
            filteredEmails.map((email) => (
              <motion.div
                key={email.id}
                layoutId={String(email.id)}
                onClick={() => setSelectedId(String(email.id))}
                whileHover={{ scale: 1.05, y: -5 }}
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  color: "white",
                  backgroundColor: "#1e1e1e",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <motion.h3 layout="position" style={{ margin: "0 0 8px 0" }}>
                  {email.subject}
                </motion.h3>
                <motion.h5
                  layout="position"
                  style={{ margin: 0, fontWeight: "normal", color: "#aaa" }}
                >
                  {email.from}
                </motion.h5>
              </motion.div>
            ))
          ) : (
            <p>No emails found.</p>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedId && selectedEmail && (
          <motion.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            <motion.div
              onClick={() => setSelectedId(null)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              layoutId={selectedId}
              style={{
                width: "clamp(300px, 80vw, 700px)",
                height: "80vh",
                overflowY: "auto",
                padding: "40px",
                borderRadius: "20px",
                backgroundColor: "#2a2a2a",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                zIndex: 101,
                position: "relative",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.h2 layout="position" style={{ marginTop: 0 }}>
                {selectedEmail.subject}
              </motion.h2>
              <motion.h4
                layout="position"
                style={{ fontWeight: "normal", color: "#ccc" }}
              >
                From: {selectedEmail.from}
              </motion.h4>
              <motion.p style={{ color: "#bbb" }}>
                Date: {selectedEmail.date.toLocaleString()}
              </motion.p>
              <motion.p style={{ color: "#bbb" }}>
                Category: {selectedEmail.aiCategory}
              </motion.p>
              <motion.div
                style={{
                  height: "1px",
                  backgroundColor: "#444",
                  margin: "20px 0",
                }}
              />
              <motion.p style={{ color: "#ddd", lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {selectedEmail.body || "Email body content not available..."}
              </motion.p>
              {/* @ts-ignore */}
              <SuggestedReply replies={selectedEmail.suggestedReplies || []} />
              <motion.button
                onClick={() => setSelectedId(null)}
                whileHover={{ scale: 1.1, backgroundColor: "#0056b3" }}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
