import { useState } from "react";
import {
  LayoutDashboard, BookOpen, CalendarDays, FolderOpen, ClipboardCheck,
  ArrowUpRight, Search, Bell, Plus, ChevronRight, Clock3,
  CheckCircle2, AlertTriangle, Users, FileText, Lightbulb,
  TrendingUp, X, Menu, Download, Filter, CircleHelp
} from "lucide-react";
import "./App.css";

const initialEvents = [
  {
    id: 1, name: "HACKOWASP 2026", category: "Hackathon",
    date: "Oct 12, 2026", status: "Completed", team: "Core Team",
    budget: "₹18,500", rating: 92,
    summary: "A successful 24-hour hackathon with strong participation.",
    good: "Early sponsor outreach and clear task ownership.",
    bad: "Registration desk was understaffed during peak hours.",
    improve: "Assign two additional volunteers to registration."
  },
  {
    id: 2, name: "Society Fair 2026", category: "Outreach",
    date: "Aug 18, 2026", status: "Completed", team: "Media Team",
    budget: "₹4,200", rating: 85,
    summary: "Introduced the society to incoming students.",
    good: "Interactive demos attracted freshers.",
    bad: "Promotional material was printed too late.",
    improve: "Finalize designs and printing at least a week early."
  },
  {
    id: 3, name: "PromptWars", category: "Competition",
    date: "Nov 22, 2026", status: "Planning", team: "Events Team",
    budget: "₹12,000", rating: 0,
    summary: "Upcoming AI prompt engineering competition.",
    good: "Early planning and clear event objectives.",
    bad: "Venue confirmation is still pending.",
    improve: "Confirm venue before opening registrations."
  },
  {
    id: 4, name: "Induction 2026", category: "Induction",
    date: "Sep 05, 2026", status: "Completed", team: "Organizing Team",
    budget: "₹2,800", rating: 88,
    summary: "Welcomed new members through interactive activities.",
    good: "Small group activities encouraged participation.",
    bad: "The event ran over the planned schedule.",
    improve: "Keep buffer time between activities."
  }
];

const initialLessons = [
  { id: 1, title: "Start sponsor outreach early", category: "Sponsorship", event: "HACKOWASP 2026", impact: "High", author: "Previous Core Team", date: "Oct 15, 2026" },
  { id: 2, title: "Always have backup volunteers", category: "Team Management", event: "Society Fair 2026", impact: "High", author: "Media Team", date: "Aug 20, 2026" },
  { id: 3, title: "Print promotional material in advance", category: "Marketing", event: "Society Fair 2026", impact: "Medium", author: "Media Team", date: "Aug 20, 2026" },
  { id: 4, title: "Keep buffer time in event schedules", category: "Planning", event: "Induction 2026", impact: "Medium", author: "Organizing Team", date: "Sep 08, 2026" },
];

const initialTasks = [
  { id: 1, title: "Transfer sponsor contact list", owner: "Previous Marketing POC", due: "Nov 12", done: true },
  { id: 2, title: "Upload event budget templates", owner: "Previous Treasurer", due: "Nov 13", done: true },
  { id: 3, title: "Document event vendor contacts", owner: "Previous Events POC", due: "Nov 15", done: false },
  { id: 4, title: "Review previous event retrospectives", owner: "Incoming Core Team", due: "Nov 18", done: false },
  { id: 5, title: "Complete role-wise handover", owner: "Society President", due: "Nov 20", done: false },
];

const templates = [
  { name: "Event Budget Template", type: "Spreadsheet", updated: "Oct 15, 2026", icon: "💰" },
  { name: "Event Planning Checklist", type: "Checklist", updated: "Oct 12, 2026", icon: "📋" },
  { name: "Sponsorship Outreach Template", type: "Document", updated: "Sep 28, 2026", icon: "🤝" },
  { name: "Event Post-Mortem Template", type: "Document", updated: "Sep 20, 2026", icon: "📝" },
  { name: "Society Fair Planning Guide", type: "Guide", updated: "Aug 18, 2026", icon: "🎪" },
  { name: "Volunteer Allocation Sheet", type: "Spreadsheet", updated: "Aug 10, 2026", icon: "👥" },
];

const mistakes = [
  { title: "Last-minute printing", category: "Marketing", solution: "Finalize content and send files to print at least 7 days before the event.", frequency: "4 events" },
  { title: "Insufficient volunteers at entry", category: "Operations", solution: "Create shift-based assignments and keep 2 backup volunteers available.", frequency: "3 events" },
  { title: "Unclear task ownership", category: "Team Management", solution: "Assign one owner and a deadline to every task. Track progress in a shared dashboard.", frequency: "3 events" },
  { title: "No post-event documentation", category: "Documentation", solution: "Schedule a retrospective within 48 hours and assign someone to document key takeaways.", frequency: "2 events" },
];

const navItems = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Event Archives", icon: CalendarDays },
  { name: "Lessons Learned", icon: Lightbulb },
  { name: "Templates & Resources", icon: FolderOpen },
  { name: "Common Mistakes", icon: AlertTriangle },
  { name: "Handover", icon: ClipboardCheck },
];

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [events, setEvents] = useState(initialEvents);
  const [lessons, setLessons] = useState(initialLessons);
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const completedTasks = tasks.filter((task) => task.done).length;
  const handoverProgress = Math.round((completedTasks / tasks.length) * 100);

  const filteredEvents = events.filter((event) =>
    `${event.name} ${event.category} ${event.team}`.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLessons = lessons.filter((lesson) =>
    `${lesson.title} ${lesson.category} ${lesson.event}`.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  };

  const addEvent = (event) => {
    setEvents([{ ...event, id: Date.now(), status: "Planning", rating: 0 }, ...events]);
    setShowModal(false);
    notify("New event added to your archive!");
  };

  const exportData = () => {
    const data = { events, lessons, tasks, templates, mistakes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "societymemory-backup.json";
    link.click();
    URL.revokeObjectURL(url);
    notify("Society memory backup exported!");
  };

  const renderOverview = () => (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">YOUR SOCIETY KNOWLEDGE HUB</div>
          <h1>Good to see you again <span>👋</span></h1>
          <p>Keep your society's experience alive. Learn from the past, plan better for the future.</p>
        </div>
        <button className="primary-btn" onClick={() => setShowModal(true)}><Plus size={17} /> Add event</button>
      </div>

      <div className="stats-grid">
        <StatCard icon={<CalendarDays />} label="Events documented" value={events.length} note="+2 this semester" color="purple" />
        <StatCard icon={<Lightbulb />} label="Lessons captured" value={lessons.length} note="Knowledge that stays" color="orange" />
        <StatCard icon={<FolderOpen />} label="Resources available" value={templates.length} note="Ready-to-use templates" color="blue" />
        <StatCard icon={<ClipboardCheck />} label="Handover progress" value={`${handoverProgress}%`} note={`${completedTasks}/${tasks.length} tasks completed`} color="green" />
      </div>

      <div className="content-grid">
        <section className="panel events-panel">
          <div className="panel-heading">
            <div><h2>Recent event memories</h2><p>What previous teams have documented</p></div>
            <button className="text-btn" onClick={() => setActivePage("Event Archives")}>View all <ArrowUpRight size={15}/></button>
          </div>
          <div className="event-list">
            {events.slice(0, 3).map((event) => (
              <div className="event-row" key={event.id} onClick={() => setSelectedEvent(event)}>
                <div className="event-icon">{event.category === "Hackathon" ? "⚡" : event.category === "Outreach" ? "🎪" : "🎯"}</div>
                <div className="event-info">
                  <strong>{event.name}</strong>
                  <span>{event.date} · {event.team}</span>
                </div>
                <span className={`status ${event.status === "Planning" ? "planning" : "completed"}`}>{event.status}</span>
                <ChevronRight size={17} className="muted-icon"/>
              </div>
            ))}
          </div>
        </section>

        <section className="panel handover-panel">
          <div className="panel-heading">
            <div><h2>Handover checklist</h2><p>Keep the transition smooth</p></div>
            <button className="icon-btn" onClick={() => setActivePage("Handover")}><ArrowUpRight size={17}/></button>
          </div>
          <div className="progress-info"><strong>{handoverProgress}%</strong><span>{completedTasks} of {tasks.length} completed</span></div>
          <div className="progress-track"><div style={{ width: `${handoverProgress}%` }} /></div>
          <div className="task-preview">
            {tasks.slice(0, 4).map(task => (
              <label className={`task-line ${task.done ? "done" : ""}`} key={task.id}>
                <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
                <span>{task.title}</span>
              </label>
            ))}
          </div>
          <button className="secondary-btn full-btn" onClick={() => setActivePage("Handover")}>View handover plan <ChevronRight size={16}/></button>
        </section>
      </div>

      <div className="content-grid bottom-grid">
        <section className="panel">
          <div className="panel-heading">
            <div><h2>Lessons worth remembering</h2><p>Advice from the people who were there</p></div>
            <button className="text-btn" onClick={() => setActivePage("Lessons Learned")}>See lessons <ArrowUpRight size={15}/></button>
          </div>
          {lessons.slice(0, 3).map(lesson => (
            <div className="lesson-row" key={lesson.id}>
              <div className="lesson-bulb"><Lightbulb size={17}/></div>
              <div><strong>{lesson.title}</strong><span>{lesson.event} · {lesson.category}</span></div>
              <span className={`impact ${lesson.impact.toLowerCase()}`}>{lesson.impact}</span>
            </div>
          ))}
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div><h2>Quick access</h2><p>Frequently used resources</p></div>
            <button className="text-btn" onClick={() => setActivePage("Templates & Resources")}>All resources <ArrowUpRight size={15}/></button>
          </div>
          {templates.slice(0, 4).map(template => (
            <div className="resource-row" key={template.name}>
              <div className="resource-icon">{template.icon}</div>
              <div><strong>{template.name}</strong><span>{template.type}</span></div>
              <button className="icon-btn" onClick={() => notify(`${template.name} selected (demo)`)}><Download size={16}/></button>
            </div>
          ))}
        </section>
      </div>
    </>
  );

  const renderEvents = () => (
    <>
      <PageHeader title="Event Archives" subtitle="Every event is a lesson for the next team." action={() => setShowModal(true)} />
      <div className="filter-row"><div className="search-box"><Search size={17}/><input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}/></div><button className="secondary-btn" onClick={() => setSearch("")}><Filter size={16}/> Clear filter</button></div>
      <div className="archive-grid">
        {filteredEvents.map(event => <div className="archive-card" key={event.id} onClick={() => setSelectedEvent(event)}>
          <div className="archive-card-top"><span className="category-tag">{event.category}</span><span className={`status ${event.status === "Planning" ? "planning" : "completed"}`}>{event.status}</span></div>
          <h3>{event.name}</h3><p>{event.summary}</p>
          <div className="archive-meta"><span><CalendarDays size={14}/>{event.date}</span><span><Users size={14}/>{event.team}</span></div>
          <div className="archive-footer"><span>Budget <strong>{event.budget}</strong></span><span className="text-btn">View memory <ChevronRight size={15}/></span></div>
        </div>)}
      </div>
    </>
  );

  const renderLessons = () => (
    <>
      <PageHeader title="Lessons Learned" subtitle="Small lessons today. Better events tomorrow." action={() => setShowModal("lesson")} actionLabel="Add lesson"/>
      <div className="search-box standalone"><Search size={17}/><input placeholder="Search lessons, categories, events..." value={search} onChange={e => setSearch(e.target.value)}/></div>
      <div className="lesson-cards">
        {filteredLessons.map(lesson => <div className="lesson-card" key={lesson.id}>
          <div className="lesson-card-icon"><Lightbulb size={20}/></div>
          <span className={`impact ${lesson.impact.toLowerCase()}`}>{lesson.impact} impact</span>
          <h3>{lesson.title}</h3><p>{lesson.category}</p>
          <div className="lesson-card-footer"><span>{lesson.event}</span><span>{lesson.date}</span></div>
        </div>)}
      </div>
      <section className="panel lesson-tip"><Lightbulb size={21}/><div><strong>Make every experience count</strong><p>After each event, ask: What worked? What didn't? What would we change next time? Capture the answer while it's still fresh.</p></div></section>
    </>
  );

  const renderResources = () => (
    <>
      <PageHeader title="Templates & Resources" subtitle="Don't reinvent the wheel. Use what previous teams created."/>
      <div className="resource-grid">
        {templates.map((template, i) => <div className="resource-card" key={template.name}>
          <div className="resource-card-top"><span className="resource-icon big">{template.icon}</span><button className="icon-btn" onClick={() => notify("Resource saved (demo)")}>☆</button></div>
          <h3>{template.name}</h3><p>{template.type} · Updated {template.updated}</p>
          <button className="secondary-btn full-btn" onClick={() => notify(`${template.name} opened (demo)`)}><FileText size={16}/> Open resource</button>
        </div>)}
      </div>
    </>
  );

  const renderMistakes = () => (
    <>
      <PageHeader title="Common Mistakes" subtitle="Learn from recurring problems before they happen."/>
      <div className="mistake-banner"><AlertTriangle size={22}/><div><strong>Don't let history repeat itself.</strong><p>These issues have appeared across previous events. Use the solutions as a starting point.</p></div></div>
      <div className="mistake-list">
        {mistakes.map((mistake, i) => <div className="mistake-card" key={mistake.title}>
          <div className="mistake-number">0{i + 1}</div>
          <div className="mistake-content"><span className="category-tag">{mistake.category}</span><h3>{mistake.title}</h3><p>{mistake.solution}</p><span className="frequency"><TrendingUp size={14}/>{mistake.frequency}</span></div>
          <button className="icon-btn" onClick={() => notify("Solution added to your planning notes (demo)")}><ArrowUpRight size={17}/></button>
        </div>)}
      </div>
    </>
  );

  const renderHandover = () => (
    <>
      <PageHeader title="Handover Dashboard" subtitle="Make sure knowledge, responsibilities, and contacts reach the next team."/>
      <div className="handover-summary panel">
        <div><span className="eyebrow">TRANSITION READINESS</span><h2>{handoverProgress}% <span>complete</span></h2><p>{completedTasks === tasks.length ? "Everything is ready for the next team!" : "A few things still need attention before handover."}</p></div>
        <div className="large-progress"><div style={{width:`${handoverProgress}%`}}/></div>
        <div className="handover-counts"><span><CheckCircle2 size={16}/> {completedTasks} completed</span><span><Clock3 size={16}/> {tasks.length - completedTasks} remaining</span></div>
      </div>
      <section className="panel handover-tasks">
        <div className="panel-heading"><div><h2>Handover tasks</h2><p>Check off tasks as knowledge is transferred.</p></div><button className="secondary-btn" onClick={exportData}><Download size={16}/> Export backup</button></div>
        {tasks.map(task => <div className={`handover-task ${task.done ? "task-complete" : ""}`} key={task.id}>
          <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)}/>
          <div className="handover-task-info"><strong>{task.title}</strong><span>{task.owner}</span></div>
          <span className="due-date">Due {task.due}</span>
          <span className={`status ${task.done ? "completed" : "planning"}`}>{task.done ? "Completed" : "Pending"}</span>
        </div>)}
      </section>
      <div className="content-grid">
        <section className="panel"><h2>Outgoing team</h2><p className="panel-subtitle">Responsible for sharing context and resources.</p><div className="contact-row"><div className="avatar">OT</div><div><strong>Outgoing Core Team</strong><span>Documentation & experience</span></div></div><div className="contact-row"><div className="avatar orange-avatar">PO</div><div><strong>Previous POCs</strong><span>Role-specific handover</span></div></div></section>
        <section className="panel"><h2>Incoming team</h2><p className="panel-subtitle">Responsible for reviewing and acknowledging handover.</p><div className="contact-row"><div className="avatar green-avatar">IT</div><div><strong>Incoming Core Team</strong><span>Review and ownership</span></div></div><div className="contact-row"><div className="avatar blue-avatar">NP</div><div><strong>New POCs</strong><span>Learn from past event owners</span></div></div></section>
      </div>
    </>
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><BookOpen size={22}/></div><div><strong>Society<span>Memory</span></strong><small>Institutional knowledge hub</small></div></div>
        <div className="workspace"><div className="workspace-avatar">O</div><div><strong>OWASP Student Chapter</strong><span>Society workspace</span></div><ChevronRight size={15}/></div>
        <div className="nav-label">WORKSPACE</div>
        <nav>{navItems.map(item => <button key={item.name} className={`nav-item ${activePage === item.name ? "active" : ""}`} onClick={() => {setActivePage(item.name);setMobileMenu(false);setSearch("");}}><item.icon size={18}/><span>{item.name}</span>{item.name === "Handover" && <span className="nav-count">{tasks.filter(t=>!t.done).length}</span>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="help-card"><CircleHelp size={19}/><strong>Need a hand?</strong><p>Explore the knowledge hub or check the handover guide.</p><button onClick={() => notify("Help center coming soon!")}>Visit help center <ArrowUpRight size={14}/></button></div><div className="user-profile"><div className="user-avatar">VG</div><div><strong>Society Organizer</strong><span>Core Team Member</span></div><button className="icon-btn" onClick={exportData} title="Export backup"><Download size={16}/></button></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={20}/></button><div className="breadcrumbs">Workspace <ChevronRight size={14}/> <strong>{activePage}</strong></div><div className="topbar-right"><div className="global-search"><Search size={16}/><input placeholder="Search society memory..." value={search} onChange={e => {setSearch(e.target.value); if(activePage === "Overview") setActivePage("Event Archives");}}/><kbd>⌘ K</kbd></div><button className="icon-btn notification-btn" onClick={() => notify("You're all caught up!")}><Bell size={18}/><i/></button><div className="top-avatar">VG</div></div></header>
        <div className="page-content">
          {activePage === "Overview" && renderOverview()}
          {activePage === "Event Archives" && renderEvents()}
          {activePage === "Lessons Learned" && renderLessons()}
          {activePage === "Templates & Resources" && renderResources()}
          {activePage === "Common Mistakes" && renderMistakes()}
          {activePage === "Handover" && renderHandover()}
        </div>
        <footer><span>SocietyMemory <span className="footer-dot">•</span> Preserving experience, empowering the next generation.</span><span>Made for student societies <span className="footer-heart">♥</span></span></footer>
      </main>

      {showModal && <EventModal onClose={() => setShowModal(false)} onSave={addEvent}/>}
      {selectedEvent && <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)}/>}
      {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
    </div>
  );
}

function StatCard({ icon, label, value, note, color }) {
  return <div className="stat-card"><div className={`stat-icon ${color}`}>{icon}</div><span className="stat-label">{label}</span><div className="stat-value">{value}</div><span className="stat-note">{note}</span></div>;
}

function PageHeader({ title, subtitle, action, actionLabel = "Add event" }) {
  return <div className="page-header"><div><div className="eyebrow">SOCIETY MEMORY</div><h1>{title}</h1><p>{subtitle}</p></div>{action && <button className="primary-btn" onClick={action}><Plus size={17}/>{actionLabel}</button>}</div>;
}

function EventModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Hackathon");
  const [date, setDate] = useState("");
  const [team, setTeam] = useState("");
  const [budget, setBudget] = useState("");
  const [summary, setSummary] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, category, date: date || "Date not set", team: team || "Organizing Team", budget: budget || "Not recorded", summary: summary || "No event summary added yet.", good: "", bad: "", improve: "" });
  };

  return <div className="modal-overlay" onClick={onClose}><form className="modal" onSubmit={submit} onClick={e => e.stopPropagation()}>
    <div className="modal-header"><div><h2>Add an event memory</h2><p>Start building your society's event archive.</p></div><button type="button" className="icon-btn" onClick={onClose}><X size={19}/></button></div>
    <label>Event name<input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Annual Hackathon" required/></label>
    <div className="form-grid"><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option>Hackathon</option><option>Outreach</option><option>Induction</option><option>Competition</option><option>Workshop</option><option>Other</option></select></label><label>Date<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label></div>
    <div className="form-grid"><label>Organizing team<input value={team} onChange={e=>setTeam(e.target.value)} placeholder="e.g. Events Team"/></label><label>Budget<input value={budget} onChange={e=>setBudget(e.target.value)} placeholder="e.g. ₹5000"/></label></div>
    <label>Event summary<textarea value={summary} onChange={e=>setSummary(e.target.value)} placeholder="What was this event about?"/></label>
    <div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" type="submit"><Plus size={16}/> Save event</button></div>
  </form></div>;
}

function EventDetail({ event, onClose }) {
  return <div className="modal-overlay" onClick={onClose}><div className="modal detail-modal" onClick={e=>e.stopPropagation()}>
    <div className="modal-header"><div><span className="category-tag">{event.category}</span><h2>{event.name}</h2><p>{event.date} · {event.team}</p></div><button className="icon-btn" onClick={onClose}><X size={19}/></button></div>
    <p className="detail-summary">{event.summary}</p>
    <div className="detail-budget"><span>Recorded budget</span><strong>{event.budget}</strong></div>
    <div className="detail-section"><h3><CheckCircle2 size={17}/> What went well</h3><p>{event.good || "No lessons documented yet."}</p></div>
    <div className="detail-section"><h3><AlertTriangle size={17}/> What could be improved</h3><p>{event.bad || "No issues documented yet."}</p></div>
    <div className="detail-section"><h3><Lightbulb size={17}/> Recommendation for next time</h3><p>{event.improve || "Add a retrospective to capture recommendations."}</p></div>
    <button className="primary-btn full-btn" onClick={onClose}>Done</button>
  </div></div>;
}

export default App;