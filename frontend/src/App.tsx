import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, Bot, CheckCircle2, ChevronDown, CircleHelp, GraduationCap, Menu, MessageCircle, Plane, Search, Send, ShieldCheck, Sparkles, X } from "lucide-react";
import api from "./api";
import type { Enquiry, EnquiryStatus, UserType } from "./types";

type ChatMessage = { from: "bot" | "user"; text: string };
type EnquiryForm = { name: string; email: string; phone: string; userType: UserType; interest: string; message: string };
const initialForm: EnquiryForm = { name: "", email: "", phone: "", userType: "Student", interest: "Drone Training", message: "" };
const suggestions = ["What services does DroneTV provide?", "What training courses are available?", "How can I register?", "I want to speak with someone."];

function botReply(question: string) {
  const q = question.toLowerCase();
  if (q.includes("service")) return "DroneTV focuses on drone-related media, services, learning and industry information. Tell us what you need and our team can follow up with the right details.";
  if (q.includes("course") || q.includes("training") || q.includes("student")) return "Thanks for your interest in drone training. Course availability, eligibility and schedules can vary. Submit an enquiry with your area of interest and the team can share current details.";
  if (q.includes("contact") || q.includes("speak") || q.includes("someone") || q.includes("register")) return "You can send your contact details through the enquiry form below. Please include your preferred service or course, and the team can get back to you.";
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) return "Hello! I'm the DroneTV Support Assistant. I can help with services, training and registration enquiries.";
  if (q.includes("price") || q.includes("fee") || q.includes("cost")) return "Fees can depend on the specific service or programme. Submit an enquiry and ask for current pricing and availability.";
  return "I may not have the exact answer to that yet. Please choose one of the suggested topics or submit an enquiry so the DroneTV team can help.";
}

function App() {
  const [page, setPage] = useState<"home" | "admin">("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ from: "bot", text: "Hi there! 👋 I'm the DroneTV Support Assistant. What can I help you with today?" }]);
  const [chatInput, setChatInput] = useState("");
  const [form, setForm] = useState<EnquiryForm>(initialForm);
  const [formState, setFormState] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [adminPassword, setAdminPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("adminToken")));
  const [loginError, setLoginError] = useState("");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [adminError, setAdminError] = useState("");

  const filtered = useMemo(() => enquiries.filter((e) => {
    const needle = search.toLowerCase();
    const matchesText = [e.name, e.email, e.phone, e.interest].some((v) => v.toLowerCase().includes(needle));
    return matchesText && (userFilter === "All" || e.userType === userFilter) && (statusFilter === "All" || e.status === statusFilter);
  }), [enquiries, search, userFilter, statusFilter]);

  async function loadEnquiries() {
    try {
      const response = await api.get<Enquiry[]>("/enquiries");
      setEnquiries(response.data);
      setAdminError("");
    } catch {
      setAdminError("Could not load enquiries. Check the backend and your admin session.");
    }
  }
  useEffect(() => { if (page === "admin" && loggedIn) void loadEnquiries(); }, [page, loggedIn]);

  function sendChat(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((old) => [...old, { from: "user", text: trimmed }, { from: "bot", text: botReply(trimmed) }]);
    setChatInput("");
  }

  async function submitEnquiry(event: FormEvent) {
    event.preventDefault();
    setFormState(null);
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (form.name.trim().length < 2) return setFormState({ kind: "error", text: "Please enter your full name." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setFormState({ kind: "error", text: "Please enter a valid email address." });
    if (phoneDigits.length < 10 || phoneDigits.length > 15) return setFormState({ kind: "error", text: "Please enter a valid phone number (10–15 digits)." });
    if (form.message.trim().length < 5) return setFormState({ kind: "error", text: "Please add a short message (at least 5 characters)." });
    setBusy(true);
    try {
      await api.post("/enquiries", { ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), message: form.message.trim() });
      setForm(initialForm);
      setFormState({ kind: "success", text: "Thanks! Your enquiry was submitted successfully." });
    } catch (error: any) {
      setFormState({ kind: "error", text: error?.response?.data?.message || "We couldn't submit your enquiry. Please check that the server is running and try again." });
    } finally { setBusy(false); }
  }

  async function login(event: FormEvent) {
    event.preventDefault(); setLoginError("");
    try {
      const { data } = await api.post("/auth/login", { email: adminEmail, password: adminPassword });
      localStorage.setItem("adminToken", data.token);
      setLoggedIn(true); setAdminPassword("");
    } catch (error: any) { setLoginError(error?.response?.data?.message || "Login failed. Check your credentials and backend configuration."); }
  }
  function logout() {
    localStorage.removeItem("adminToken"); setLoggedIn(false); setEnquiries([]); setPage("home");
  }
  async function updateStatus(id: string, status: EnquiryStatus) {
    try {
      const { data } = await api.patch<Enquiry>(`/enquiries/${id}`, { status });
      setEnquiries((old) => old.map((e) => e._id === id ? data : e));
      if (selected?._id === id) setSelected(data);
    } catch { setAdminError("Status update failed. Please try again."); }
  }
  async function deleteEnquiry(id: string) {
    if (!window.confirm("Delete this enquiry permanently?")) return;
    try {
      await api.delete(`/enquiries/${id}`);
      setEnquiries((old) => old.filter((e) => e._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch { setAdminError("Delete failed. Please try again."); }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => setPage("home")} aria-label="DroneTV home"><span className="brand-mark"><Plane size={21}/></span><span>Drone<span className="brand-accent">TV</span><small>FLY BEYOND</small></span></a>
        <button className="mobile-menu" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
        <nav className={mobileMenu ? "nav-links nav-open" : "nav-links"}>
          <a href="#services" onClick={() => setMobileMenu(false)}>Services</a><a href="#training" onClick={() => setMobileMenu(false)}>Training</a><a href="#contact" onClick={() => setMobileMenu(false)}>Contact</a>
          <button className="nav-admin" onClick={() => { setPage("admin"); setMobileMenu(false); }}>Admin portal <ArrowRight size={15}/></button>
        </nav>
      </header>

      {page === "home" ? <>
        <main id="home">
          <section className="hero">
            <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
            <div className="hero-copy"><div className="eyebrow"><Sparkles size={14}/> DRONE TECHNOLOGY · LEARNING · SUPPORT</div><h1>Explore the sky.<br/><span>Unlock new heights.</span></h1><p className="hero-description">Your next step in drone technology starts here. Explore services, discover learning opportunities, and get connected with the right support.</p><div className="hero-actions"><a className="button-primary" href="#services">Explore services <ArrowRight size={17}/></a><button className="button-secondary" onClick={() => setChatOpen(true)}><MessageCircle size={17}/> Ask our assistant</button></div><div className="trust-line"><span><ShieldCheck size={16}/> Helpful human follow-up</span><span><CheckCircle2 size={16}/> Enquiry tracking</span></div></div>
            <div className="hero-visual"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="drone-card"><div className="drone-top"><span className="live-dot"/> SKY / 01 <span>FIELD NOTES</span></div><div className="drone-art"><Plane size={106} strokeWidth={1.1}/><div className="drone-cross cross-one"/><div className="drone-cross cross-two"/></div><div className="drone-data"><div><small>HORIZON</small><strong>OPEN</strong></div><div><small>YOUR NEXT MOVE</small><strong>START HERE ↗</strong></div></div></div><div className="floating-chip chip-top"><span className="chip-icon"><GraduationCap size={18}/></span><span><b>Learn & grow</b><small>Training pathways</small></span></div><div className="floating-chip chip-bottom"><span className="chip-icon teal"><Bot size={18}/></span><span><b>Need a hand?</b><small>Ask the assistant</small></span></div></div>
            <div className="hero-index"><span>01 / 03</span><span className="index-line"/><span>TAKE THE NEXT STEP</span></div>
          </section>
          <section className="stats-strip"><div><strong>01</strong><span>Discover drone services</span></div><div><strong>02</strong><span>Explore learning paths</span></div><div><strong>03</strong><span>Connect with our team</span></div></section>
          <section className="section services-section" id="services"><div className="section-heading"><div><span className="section-kicker">WHAT WE DO</span><h2>Make your next move<br/>a confident one.</h2></div><p>From exploring drone technology to finding a learning path, start with a question. Our support assistant helps direct your enquiry.</p></div><div className="service-grid"><article className="service-card service-dark"><div className="card-icon"><Plane/></div><span className="card-number">01 / SERVICES</span><h3>Drone solutions</h3><p>Tell us about your drone-related needs and we’ll help route your enquiry to the right team.</p><button onClick={() => { setForm({...initialForm, userType:"Customer", interest:"Drone Services"}); document.querySelector("#contact")?.scrollIntoView({behavior:"smooth"}); }}>Discuss a service <ArrowRight size={16}/></button></article><article className="service-card"><div className="card-icon card-icon-light"><GraduationCap/></div><span className="card-number">02 / LEARNING</span><h3>Training & courses</h3><p>Ask about available training, course details, eligibility and upcoming opportunities.</p><button onClick={() => { setForm({...initialForm, userType:"Student", interest:"Drone Training"}); document.querySelector("#contact")?.scrollIntoView({behavior:"smooth"}); }}>Explore training <ArrowRight size={16}/></button></article><article className="service-card"><div className="card-icon card-icon-light"><CircleHelp/></div><span className="card-number">03 / SUPPORT</span><h3>Personal guidance</h3><p>Not sure where to begin? Share your question and request a follow-up from the team.</p><button onClick={() => setChatOpen(true)}>Talk to the assistant <ArrowRight size={16}/></button></article></div></section>
          <section className="training-band" id="training"><div className="training-icon"><GraduationCap size={28}/></div><div><span className="section-kicker">YOUR LEARNING JOURNEY</span><h2>Curiosity is a great place to start.</h2><p>Ask us about course availability, registration, eligibility and training options.</p></div><button className="button-primary" onClick={() => { setForm({...initialForm, userType:"Student", interest:"Drone Training"}); document.querySelector("#contact")?.scrollIntoView({behavior:"smooth"}); }}>Enquire about courses <ArrowRight size={17}/></button></section>
          <section className="section contact-section" id="contact"><div className="contact-intro"><span className="section-kicker">LET'S CONNECT</span><h2>Tell us what<br/>you’re looking for.</h2><p>Complete the form and the team can follow up with relevant information. Fields marked with * are required.</p><div className="contact-note"><MessageCircle size={19}/><span><b>Prefer a quick question?</b><small>Open the support assistant for instant predefined answers.</small></span></div><button className="text-button" onClick={() => setChatOpen(true)}>Open support assistant <ArrowRight size={16}/></button></div>
            <form className="enquiry-form" onSubmit={submitEnquiry} noValidate><div className="form-heading"><div><span className="section-kicker">ENQUIRY FORM</span><h3>How can we help?</h3></div><span className="required-note">* Required</span></div><div className="form-row"><label>Full name *<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" autoComplete="name" required/></label><label>Email address *<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" autoComplete="email" required/></label></div><div className="form-row"><label>Phone number *<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 98765 43210" autoComplete="tel" required/></label><label>I am a *<select value={form.userType} onChange={e=>setForm({...form,userType:e.target.value as UserType})}><option>Student</option><option>Customer</option><option>Other</option></select></label></div><label>Service or course of interest *<select value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})}><option>Drone Training</option><option>Drone Services</option><option>Drone Technology</option><option>Registration Support</option><option>Other / Not sure</option></select></label><label>Your message *<textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us a little about what you need..." rows={4} required/></label>{formState && <div role="status" className={`form-alert ${formState.kind}`}>{formState.kind==="success" && <CheckCircle2 size={17}/>} {formState.text}</div>}<button className="button-primary submit-button" disabled={busy}>{busy ? "Submitting..." : "Submit enquiry"} <Send size={16}/></button><p className="privacy-note"><ShieldCheck size={14}/> Your information is used to respond to your enquiry.</p></form>
          </section>
        </main>
        <footer className="footer"><a className="brand footer-brand" href="#home"><span className="brand-mark"><Plane size={19}/></span><span>Drone<span className="brand-accent">TV</span><small>FLY BEYOND</small></span></a><span>Support that helps you take the next step.</span><span>© {new Date().getFullYear()} DroneTV · Demo project</span></footer>
      </> : <main className="admin-page"><div className="admin-heading"><div><span className="section-kicker">WORKSPACE / ADMIN</span><h1>Enquiry dashboard</h1><p>Manage incoming student and customer enquiries.</p></div><button className="button-secondary" onClick={() => setPage("home")}>← Back to site</button></div>
        {!loggedIn ? <form className="login-card" onSubmit={login}><div className="login-symbol"><ShieldCheck size={25}/></div><h2>Admin sign in</h2><p>Use the admin credentials configured in your backend environment.</p><label>Email address<input type="email" value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} required autoComplete="username"/></label><label>Password<input type="password" value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} required autoComplete="current-password"/></label>{loginError && <div role="alert" className="form-alert error">{loginError}</div>}<button className="button-primary submit-button">Sign in <ArrowRight size={16}/></button><small className="demo-warning">For local development only. Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env.</small></form> :
        <><div className="admin-toolbar"><div className="search-field"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, phone..."/></div><select value={userFilter} onChange={e=>setUserFilter(e.target.value)}><option>All</option><option>Student</option><option>Customer</option><option>Other</option></select><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All</option><option>New</option><option>Contacted</option><option>In Progress</option><option>Closed</option></select><button className="button-secondary" onClick={() => void loadEnquiries()}>Refresh</button><button className="button-secondary" onClick={logout}>Sign out</button></div>{adminError && <div role="alert" className="form-alert error">{adminError}</div>}<div className="metric-grid"><div className="metric-card"><span>Total enquiries</span><strong>{enquiries.length}</strong></div><div className="metric-card"><span>New enquiries</span><strong>{enquiries.filter(e=>e.status==="New").length}</strong></div><div className="metric-card"><span>Students</span><strong>{enquiries.filter(e=>e.userType==="Student").length}</strong></div><div className="metric-card"><span>In progress</span><strong>{enquiries.filter(e=>e.status==="In Progress").length}</strong></div></div><div className="table-wrap"><table><thead><tr><th>Contact</th><th>User type</th><th>Interest</th><th>Received</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filtered.map(e=><tr key={e._id}><td><b>{e.name}</b><small>{e.email}</small><small>{e.phone}</small></td><td>{e.userType}</td><td>{e.interest}</td><td>{new Date(e.createdAt).toLocaleDateString()}</td><td><select aria-label={`Status for ${e.name}`} className={`status-select status-${e.status.toLowerCase().replace(" ","-")}`} value={e.status} onChange={ev=>void updateStatus(e._id,ev.target.value as EnquiryStatus)}><option>New</option><option>Contacted</option><option>In Progress</option><option>Closed</option></select></td><td><div className="table-actions"><button onClick={()=>setSelected(e)}>View</button><button className="delete-link" onClick={()=>void deleteEnquiry(e._id)}>Delete</button></div></td></tr>)}{filtered.length===0 && <tr><td colSpan={6} className="empty-state">No enquiries match these filters.</td></tr>}</tbody></table></div><p className="results-count">Showing {filtered.length} of {enquiries.length} enquiries</p></>}
      </main>}
      {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="detail-modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><span className="section-kicker">ENQUIRY DETAILS</span><h2>{selected.name}</h2></div><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close details"><X/></button></div><dl className="detail-list"><dt>Email</dt><dd>{selected.email}</dd><dt>Phone</dt><dd>{selected.phone}</dd><dt>User type</dt><dd>{selected.userType}</dd><dt>Interest</dt><dd>{selected.interest}</dd><dt>Status</dt><dd>{selected.status}</dd><dt>Message</dt><dd>{selected.message}</dd><dt>Received</dt><dd>{new Date(selected.createdAt).toLocaleString()}</dd></dl></section></div>}
      {page === "home" && <><button className="chat-launcher" onClick={() => setChatOpen(!chatOpen)} aria-label={chatOpen ? "Close support chat" : "Open support chat"}>{chatOpen ? <X size={23}/> : <MessageCircle size={23}/>}<span className="launcher-dot"/></button>{chatOpen && <aside className="chat-panel" aria-label="DroneTV support chatbot"><div className="chat-header"><div className="chat-avatar"><Bot size={21}/></div><div><b>DroneTV Assistant</b><small><span className="online-dot"/> Usually replies instantly</small></div><button onClick={() => setChatOpen(false)} aria-label="Close chatbot"><X size={19}/></button></div><div className="chat-messages" aria-live="polite">{messages.map((m,i)=><div key={i} className={`chat-message ${m.from}`}>{m.from==="bot" && <span className="mini-bot"><Bot size={14}/></span>}<p>{m.text}</p></div>)}</div><div className="suggestion-area"><small>QUICK QUESTIONS</small><div className="suggestion-list">{suggestions.map(s=><button key={s} onClick={() => sendChat(s)}>{s}<ChevronDown size={13}/></button>)}</div></div><form className="chat-input" onSubmit={e=>{e.preventDefault();sendChat(chatInput);}}><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Ask a question..." aria-label="Chat message"/><button aria-label="Send message" disabled={!chatInput.trim()}><Send size={17}/></button></form><div className="chat-footer"><button onClick={() => setMessages([{from:"bot",text:"Conversation reset. Hi! What can I help you with today?"}])}>↻ Reset conversation</button><button onClick={() => {setChatOpen(false);document.querySelector("#contact")?.scrollIntoView({behavior:"smooth"});}}>Submit an enquiry ↗</button></div></aside>}</>}
    </div>
  );
}
export default App;
