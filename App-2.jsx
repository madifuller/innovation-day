import { useState, useEffect } from "react";

const ORGANIZER_PASSWORD = "launchpad2026";

const SCHEDULE = [
  { time: "9:00 – 9:30 AM", title: "Arrival, breakfast & introductions", location: "" },
  { time: "9:30 – 10:00 AM", title: "Welcome & program overview", location: "" },
  { time: "10:00 – 10:15 AM", title: "Challenge, team, & mentor reveal", location: "" },
  { time: "10:15 – 12:30 PM", title: "Work block 1", location: "Problem framing, insight development, solution ideation" },
  { time: "12:30 – 1:00 PM", title: "Working lunch", location: "" },
  { time: "1:00 – 3:00 PM", title: "Work block 2", location: "Solution development & pitch prep" },
  { time: "3:00 – 4:30 PM", title: "Final pitches to executive panel", location: "" },
  { time: "4:30 – 5:30 PM", title: "Networking reception", location: "" },
];

const TEAMS = [];

const initAnnouncements = [
  { id: 1, text: "Welcome to Innovation Day! Grab your name tag at the front desk and find your team room.", time: "9:00 AM", pinned: true }
];

const nowStr = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const STORAGE_KEY = "innovation_day_data_v2";

const C = {
  dark: "#32302F", light: "#F1F0F0", accent: "#A3B363", accentDark: "#7a8a49",
  accentLight: "#eef2e3", white: "#ffffff", border: "rgba(50,48,47,0.12)", muted: "rgba(50,48,47,0.5)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .root { font-family: 'Poppins','Avenir','Avenir Next',sans-serif; color: ${C.dark}; background: ${C.light}; min-height: 100vh; }
  input, textarea { font-family: 'Poppins','Avenir',sans-serif; font-size: 13px; color: ${C.dark}; background: ${C.white}; border: 1px solid ${C.border}; border-radius: 8px; padding: 8px 12px; width: 100%; outline: none; transition: border 0.15s; }
  input:focus, textarea:focus { border-color: ${C.accent}; }
  textarea { resize: vertical; }
  button { font-family: 'Poppins','Avenir',sans-serif; cursor: pointer; border-radius: 8px; font-size: 13px; transition: opacity 0.15s, background 0.15s; }
  .btn { background: transparent; border: 1px solid ${C.border}; color: ${C.dark}; padding: 7px 16px; }
  .btn:hover { background: rgba(50,48,47,0.06); }
  .btn-primary { background: ${C.accent}; border: none; color: ${C.white}; padding: 8px 20px; font-weight: 500; }
  .btn-primary:hover { opacity: 0.88; }
  .btn-xs { background: transparent; border: 1px solid ${C.border}; color: ${C.muted}; padding: 3px 10px; font-size: 11px; border-radius: 6px; }
  .btn-xs:hover { border-color: ${C.accent}; color: ${C.accentDark}; }
  .card { background: ${C.white}; border-radius: 14px; border: 1px solid ${C.border}; padding: 1.25rem; }
  .pill { display: inline-block; font-size: 11px; padding: 2px 9px; border-radius: 99px; background: ${C.accentLight}; color: ${C.accentDark}; font-weight: 500; }
  .tab-bar { display: flex; border-bottom: 1px solid ${C.border}; margin-bottom: 1.25rem; overflow-x: auto; }
  .tab { background: transparent; border: none; border-bottom: 2px solid transparent; padding: 8px 14px; font-size: 13px; color: ${C.muted}; cursor: pointer; white-space: nowrap; }
  .tab.active { border-bottom-color: ${C.accent}; color: ${C.dark}; font-weight: 500; }
  .muted { font-size: 11px; color: ${C.muted}; }
  .ann-row { border-left: 3px solid ${C.accent}; padding-left: 12px; margin-bottom: 14px; }
  .ann-row.plain { border-color: ${C.border}; }
  .bubble { background: ${C.light}; border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; font-size: 13px; }
  .reply-bubble { background: ${C.accentLight}; border-left: 3px solid ${C.accent}; border-radius: 10px; padding: 8px 12px; margin-top: 6px; font-size: 13px; }
  .avatar { width: 34px; height: 34px; border-radius: 50%; background: ${C.accentLight}; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: ${C.accentDark}; flex-shrink: 0; }
  .page { max-width: 700px; margin: 0 auto; padding: 1.5rem 1rem; }
  .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .logo { font-size: 20px; font-weight: 600; color: ${C.dark}; letter-spacing: -0.3px; }
  .logo span { color: ${C.accent}; }
  .sub { font-size: 13px; color: ${C.muted}; margin-top: 2px; }
  .upvote-btn { display: flex; align-items: center; gap: 5px; background: transparent; border: 1px solid ${C.border}; border-radius: 99px; padding: 4px 10px; font-size: 12px; color: ${C.muted}; transition: all 0.15s; }
  .upvote-btn:hover { border-color: ${C.accent}; color: ${C.accentDark}; }
  .upvote-btn.voted { background: ${C.accentLight}; border-color: ${C.accent}; color: ${C.accentDark}; font-weight: 500; }
  .qa-card { background: ${C.white}; border-radius: 14px; border: 1px solid ${C.border}; padding: 1rem 1.25rem; margin-bottom: 10px; }
`;

export default function App() {
  const [view, setView] = useState("landing");
  const [nameInput, setNameInput] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [announcements, setAnnouncements] = useState(initAnnouncements);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [newAnn, setNewAnn] = useState("");
  const [orgReply, setOrgReply] = useState({});
  const [candTab, setCandTab] = useState("announcements");
  const [sentConfirm, setSentConfirm] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [editingPinId, setEditingPinId] = useState(null);
  const [editPinText, setEditPinText] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { const d = JSON.parse(raw); if (d.announcements) setAnnouncements(d.announcements); if (d.messages) setMessages(d.messages); }
    } catch (e) {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ announcements, messages })); } catch (e) {}
  }, [announcements, messages, loaded]);

  const candidateTeam = TEAMS.find(t => t.members.some(m => m.toLowerCase() === candidateName.toLowerCase()));

  const handleJoin = () => { if (nameInput.trim().length < 2) return; setCandidateName(nameInput.trim()); setView("candidate"); };
  const handleOrgLogin = () => { if (passwordInput === ORGANIZER_PASSWORD) { setView("organizer"); setPasswordError(false); } else setPasswordError(true); };

  const handleSend = () => {
    if (!msgInput.trim()) return;
    setMessages(p => [...p, { id: Date.now(), from: candidateName, text: msgInput.trim(), time: nowStr(), reply: null, public: true, upvotes: [] }]);
    setMsgInput(""); setSentConfirm(true); setTimeout(() => setSentConfirm(false), 3000);
  };

  const handlePost = () => {
    if (!newAnn.trim()) return;
    setAnnouncements(p => [...p, { id: Date.now(), text: newAnn.trim(), time: nowStr(), pinned: false }]);
    setNewAnn("");
  };

  const handleReply = (id) => {
    const txt = orgReply[id]; if (!txt?.trim()) return;
    setMessages(p => p.map(m => m.id === id ? { ...m, reply: { text: txt.trim(), time: nowStr() } } : m));
    setOrgReply(p => ({ ...p, [id]: "" }));
  };

  const handleUpvote = (id) => {
    setMessages(p => p.map(m => {
      if (m.id !== id) return m;
      const already = m.upvotes.includes(candidateName);
      return { ...m, upvotes: already ? m.upvotes.filter(u => u !== candidateName) : [...m.upvotes, candidateName] };
    }));
  };

  const startEditPin = (a) => { setEditingPinId(a.id); setEditPinText(a.text); };
  const saveEditPin = () => {
    if (!editPinText.trim()) return;
    setAnnouncements(p => p.map(a => a.id === editingPinId ? { ...a, text: editPinText.trim() } : a));
    setEditingPinId(null); setEditPinText("");
  };

  const unreplied = messages.filter(m => !m.reply).length;
  const myMessages = messages.filter(m => m.from === candidateName);

  const Logo = () => <div className="logo">Accelerators<span> Innovation Day</span></div>;

  if (view === "landing") return (
    <div className="root"><style>{css}</style>
      <div className="page">
        <div style={{ textAlign: "center", marginBottom: "2.5rem", paddingTop: "1rem" }}>
          <Logo />
          <div className="sub" style={{ marginTop: 6 }}>Updates, schedule, your team, and questions — all in one place</div>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>I'm a candidate</div>
            <label className="muted" style={{ display: "block", marginBottom: 4 }}>Your name</label>
            <input value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleJoin()} placeholder="First and last name" />
            <div style={{ marginTop: 12 }}><button className="btn-primary" onClick={handleJoin}>Join →</button></div>
          </div>
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>I'm an organizer</div>
            <label className="muted" style={{ display: "block", marginBottom: 4 }}>Password</label>
            <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleOrgLogin()} placeholder="Organizer password" />
            {passwordError && <div style={{ fontSize: 12, color: "#c0392b", marginTop: 6 }}>Incorrect password</div>}
            <div style={{ marginTop: 12 }}><button className="btn" onClick={handleOrgLogin}>Sign in</button></div>

          </div>
        </div>
      </div>
    </div>
  );

  if (view === "candidate") return (
    <div className="root"><style>{css}</style>
      <div className="page">
        <div className="topbar">
          <div><Logo /><div className="sub">Hi, {candidateName}{candidateTeam ? ` · ${candidateTeam.name}` : ""}</div></div>
          <button className="btn" style={{ fontSize: 12, padding: "4px 12px" }} onClick={() => { setView("landing"); setNameInput(""); setCandidateName(""); }}>Leave</button>
        </div>
        <div className="tab-bar">
          {["announcements", "schedule", "my team", "ask", "Q&A board"].map(t => (
            <button key={t} className={`tab${candTab === t ? " active" : ""}`} onClick={() => setCandTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {candTab === "announcements" && (
          <div>
            {announcements.length === 0 && <div className="muted" style={{ textAlign: "center", padding: "2rem 0" }}>No announcements yet.</div>}
            {[...announcements].reverse().map(a => (
              <div key={a.id} className={`ann-row${a.pinned ? "" : " plain"}`}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                  {a.pinned && <span className="pill">Pinned</span>}
                  <span className="muted">{a.time}</span>
                </div>
                <div style={{ fontSize: 14 }}>{a.text}</div>
              </div>
            ))}
            {myMessages.filter(m => m.reply).map(m => (
              <div key={m.id} style={{ marginBottom: 12 }}>
                <div className="muted" style={{ marginBottom: 4 }}>Reply to your question</div>
                <div className="reply-bubble">
                  <div style={{ fontSize: 11, color: C.accentDark, marginBottom: 2 }}>Organizer replied</div>
                  <div>{m.reply.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {candTab === "schedule" && (
          <div>
            {SCHEDULE.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "flex-start" }}>
                <div style={{ minWidth: 88, fontSize: 12, fontWeight: 600, color: C.accent, paddingTop: 2 }}>{item.time}</div>
                <div style={{ flex: 1, borderLeft: `1px solid ${C.border}`, paddingLeft: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{item.title}</div>
                  {item.location && <div style={{ fontSize: 12, color: C.muted }}>{item.location}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {candTab === "my team" && (
          <div>
            {!candidateTeam ? (
              <div className="muted" style={{ textAlign: "center", padding: "2rem 0" }}>Your team info isn't set up yet. Ask an organizer!</div>
            ) : (
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{candidateTeam.name}</div>
                  {candidateTeam.room && <span className="pill">{candidateTeam.room}</span>}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Mentor: {candidateTeam.mentor}</div>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                  <div className="muted" style={{ marginBottom: 10 }}>Team members</div>
                  {candidateTeam.members.map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div className="avatar">{m.split(" ").map(w => w[0]).join("")}</div>
                      <div style={{ fontSize: 14, fontWeight: m.toLowerCase() === candidateName.toLowerCase() ? 600 : 400, color: m.toLowerCase() === candidateName.toLowerCase() ? C.accent : C.dark }}>
                        {m}{m.toLowerCase() === candidateName.toLowerCase() ? " (you)" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {candTab === "ask" && (
          <div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 14 }}>Send a question to the organizers. It will appear on the Q&A board right away and they'll reply here.</div>
            <textarea style={{ minHeight: 90 }} value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder="Type your question..." />
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
              <button className="btn-primary" onClick={handleSend}>Send</button>
              {sentConfirm && <span style={{ fontSize: 13, color: C.accent, fontWeight: 500 }}>Sent! Organizers will reply soon.</span>}
            </div>
            {myMessages.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div className="muted" style={{ marginBottom: 10 }}>Your messages</div>
                {myMessages.map(m => (
                  <div key={m.id} style={{ marginBottom: 12 }}>
                    <div className="bubble"><div className="muted" style={{ marginBottom: 4 }}>{m.time}</div>{m.text}</div>
                    {m.reply && (
                      <div className="reply-bubble" style={{ marginLeft: 16 }}>
                        <div style={{ fontSize: 11, color: C.accentDark, marginBottom: 2 }}>Organizer — {m.reply.time}</div>
                        {m.reply.text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {candTab === "Q&A board" && (
          <div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>All candidate questions, sorted by most upvoted. Upvote ones you'd like answered!</div>
            {messages.filter(m => m.public).length === 0 && <div className="muted" style={{ textAlign: "center", padding: "2rem 0" }}>No questions yet — be the first to ask!</div>}
            {messages.filter(m => m.public).sort((a, b) => b.upvotes.length - a.upvotes.length).map(m => (
              <div key={m.id} className="qa-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{m.text}</div>
                  <button className={`upvote-btn${m.upvotes.includes(candidateName) ? " voted" : ""}`} onClick={() => handleUpvote(m.id)}>▲ {m.upvotes.length}</button>
                </div>
                <div className="muted" style={{ marginBottom: 8 }}>Asked by {m.from}</div>
                {m.reply && (
                  <div className="reply-bubble">
                    <div style={{ fontSize: 11, color: C.accentDark, marginBottom: 2 }}>Organizer replied</div>
                    {m.reply.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (view === "organizer") return (
    <div className="root"><style>{css}</style>
      <div className="page">
        <div className="topbar">
          <div><Logo /><div className="sub">Organizer dashboard</div></div>
          <button className="btn" style={{ fontSize: 12, padding: "4px 12px" }} onClick={() => setView("landing")}>Sign out</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Post announcement</div>
            <textarea style={{ minHeight: 80 }} value={newAnn} onChange={e => setNewAnn(e.target.value)} placeholder="e.g. Lunch is ready — head to the main hall" />
            <div style={{ marginTop: 8 }}><button className="btn-primary" onClick={handlePost}>Post to all candidates</button></div>

            <div style={{ marginTop: 20 }}>
              <div className="muted" style={{ marginBottom: 10 }}>Posted ({announcements.length})</div>
              {[...announcements].reverse().map(a => (
                <div key={a.id} className={`ann-row${a.pinned ? "" : " plain"}`}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    {a.pinned && <span className="pill">Pinned</span>}
                    <span className="muted">{a.time}</span>
                    {a.pinned && editingPinId !== a.id && (
                      <>
                        <button className="btn-xs" onClick={() => startEditPin(a)}>Edit</button>
                        <button className="btn-xs" onClick={() => setAnnouncements(p => p.map(x => x.id === a.id ? { ...x, pinned: false } : x))}>Unpin</button>
                      </>
                    )}
                    {!a.pinned && (
                      <button className="btn-xs" onClick={() => setAnnouncements(p => p.map(x => x.id === a.id ? { ...x, pinned: true } : x))}>Pin</button>
                    )}
                  </div>
                  {editingPinId === a.id ? (
                    <div>
                      <textarea style={{ minHeight: 60, marginBottom: 6 }} value={editPinText} onChange={e => setEditPinText(e.target.value)} />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn-primary" style={{ padding: "5px 14px", fontSize: 12 }} onClick={saveEditPin}>Save</button>
                        <button className="btn" style={{ padding: "5px 14px", fontSize: 12 }} onClick={() => setEditingPinId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 13 }}>{a.text}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
              Inbox {unreplied > 0 && <span className="pill" style={{ marginLeft: 6 }}>{unreplied} new</span>}
            </div>
            {messages.length === 0 && <div className="muted">No messages yet.</div>}
            {[...messages].reverse().map(m => (
              <div key={m.id} className="card" style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{m.from}</div>
                  <span className="muted">{m.time}</span>
                </div>
                <div style={{ fontSize: 13, marginBottom: 8 }}>{m.text}</div>
                {m.reply ? (
                  <div className="reply-bubble">
                    <div style={{ fontSize: 11, color: C.accentDark, marginBottom: 2 }}>Replied — {m.reply.time}</div>
                    {m.reply.text}
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input value={orgReply[m.id] || ""} onChange={e => setOrgReply(p => ({ ...p, [m.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleReply(m.id)} placeholder="Reply..." />
                    <button className="btn-primary" style={{ whiteSpace: "nowrap" }} onClick={() => handleReply(m.id)}>Send</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
