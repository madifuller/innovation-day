const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client/dist")));

// In-memory store
let state = {
  announcements: [
    { id: uuidv4(), text: "Welcome to Innovation Day! Grab your name tag at the front desk and find your team room.", time: "9:00 AM", pinned: true }
  ],
  messages: []
};

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Get all state
app.get("/api/state", (req, res) => res.json(state));

// Post announcement
app.post("/api/announcements", (req, res) => {
  const ann = { id: uuidv4(), text: req.body.text, time: now(), pinned: false };
  state.announcements.push(ann);
  res.json(ann);
});

// Update announcement (edit text, pin/unpin)
app.patch("/api/announcements/:id", (req, res) => {
  state.announcements = state.announcements.map(a =>
    a.id === req.params.id ? { ...a, ...req.body } : a
  );
  res.json({ ok: true });
});

// Post message
app.post("/api/messages", (req, res) => {
  const msg = { id: uuidv4(), from: req.body.from, text: req.body.text, time: now(), reply: null, public: true, upvotes: [] };
  state.messages.push(msg);
  res.json(msg);
});

// Reply to message
app.patch("/api/messages/:id/reply", (req, res) => {
  state.messages = state.messages.map(m =>
    m.id === req.params.id ? { ...m, reply: { text: req.body.text, time: now() } } : m
  );
  res.json({ ok: true });
});

// Upvote message
app.patch("/api/messages/:id/upvote", (req, res) => {
  const name = req.body.name;
  state.messages = state.messages.map(m => {
    if (m.id !== req.params.id) return m;
    const already = m.upvotes.includes(name);
    return { ...m, upvotes: already ? m.upvotes.filter(u => u !== name) : [...m.upvotes, name] };
  });
  res.json({ ok: true });
});

// Fallback to React app
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "client/dist/index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Running on port ${PORT}`));
