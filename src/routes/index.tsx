import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  GraduationCap,
  Megaphone,
  Plus,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type NoticeCategory = "Academic" | "Exams" | "Events" | "Urgent";
type Notice = {
  id: number;
  title: string;
  body: string;
  category: NoticeCategory;
  date: string;
  author: string;
  audience: string;
  pinned?: boolean;
};

const initialNotices: Notice[] = [
  {
    id: 1,
    title: "Mid-semester examination timetable",
    body: "The mid-semester examination timetable is now available. Please check your course schedule and arrive at least 15 minutes before each paper. Bring your college ID to every examination.",
    category: "Exams",
    date: "Today · 9:15 AM",
    author: "Examination Cell",
    audience: "All students",
    pinned: true,
  },
  {
    id: 2,
    title: "Library hours extended during exam week",
    body: "The central library will remain open until 10:00 PM from November 12–22. The reading hall and reference section will be available throughout the extended hours.",
    category: "Academic",
    date: "Today · 8:40 AM",
    author: "Central Library",
    audience: "All students",
  },
  {
    id: 3,
    title: "Annual cultural fest — registrations open",
    body: "Registrations are open for performances, workshops, and campus stalls at this year's annual cultural fest. Sign up with your class representative by November 16.",
    category: "Events",
    date: "Yesterday · 3:20 PM",
    author: "Student Affairs",
    audience: "Students & faculty",
  },
  {
    id: 4,
    title: "Campus Wi-Fi maintenance tonight",
    body: "Campus Wi-Fi will be unavailable in the academic block between 11:00 PM and 1:00 AM while scheduled maintenance is carried out. Hostel networks are not affected.",
    category: "Urgent",
    date: "Yesterday · 1:05 PM",
    author: "IT Services",
    audience: "Campus-wide",
  },
  {
    id: 5,
    title: "Project submission guidelines updated",
    body: "Updated project formatting and submission guidelines are available from your department office. Please review them before submitting your semester projects.",
    category: "Academic",
    date: "Nov 7 · 11:30 AM",
    author: "Academic Office",
    audience: "Undergraduate students",
  },
];

const categories = ["All notices", "Academic", "Exams", "Events", "Urgent"] as const;
const categoryStyles: Record<NoticeCategory, string> = {
  Academic: "category-academic",
  Exams: "category-exams",
  Events: "category-events",
  Urgent: "category-urgent",
};
const categoryIcons: Record<NoticeCategory, typeof BookOpen> = {
  Academic: BookOpen,
  Exams: GraduationCap,
  Events: CalendarDays,
  Urgent: ShieldAlert,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NotifyHub — College notices, all in one place" },
      {
        name: "description",
        content:
          "A central place for college announcements, academic updates, events, and urgent notices.",
      },
      { property: "og:title", content: "NotifyHub — College notices, all in one place" },
      {
        property: "og:description",
        content:
          "A central place for college announcements, academic updates, events, and urgent notices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotifyHub,
});

function NotifyHub() {
  const [notices, setNotices] = useState(initialNotices);
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All notices");
  const [search, setSearch] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [postOpen, setPostOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<NoticeCategory>("Academic");
  const [published, setPublished] = useState(false);

  const filteredNotices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notices.filter((notice) => {
      const matchesCategory = activeCategory === "All notices" || notice.category === activeCategory;
      const matchesSearch =
        !query || `${notice.title} ${notice.body} ${notice.author}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, notices, search]);

  function publishNotice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    if (!cleanTitle || !cleanBody) return;
    const newNotice: Notice = {
      id: Date.now(),
      title: cleanTitle,
      body: cleanBody,
      category,
      date: "Just now",
      author: "College Administration",
      audience: "All students",
    };
    setNotices((current) => [newNotice, ...current]);
    setActiveCategory("All notices");
    setSearch("");
    setTitle("");
    setBody("");
    setPublished(true);
    setPostOpen(false);
    window.setTimeout(() => setPublished(false), 4000);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="app-header">
        <a className="brand-lockup" href="/" aria-label="NotifyHub home">
          <span className="brand-mark">
            <Megaphone size={19} strokeWidth={2.1} />
          </span>
          <span className="brand-name">
            notify<span>hub</span>
          </span>
        </a>
        <div className="header-campus">
          <span className="campus-dot" /> Riverdale College <ChevronRight size={14} />
          <span>Student portal</span>
        </div>
        <div className="header-actions">
          <Button variant="ghost" size="icon" className="notification-button" aria-label="Notifications">
            <Bell size={18} />
            <span className="notification-dot" />
          </Button>
          <div className="profile-chip" aria-label="Maya Patel, student">
            <span className="profile-avatar">MP</span>
            <span className="profile-name">Maya Patel</span>
          </div>
        </div>
      </header>

      <main className="dashboard-shell">
        <aside className="sidebar" aria-label="Main navigation">
          <p className="sidebar-label">WORKSPACE</p>
          <a className="nav-item nav-item-active" href="#notices">
            <Megaphone size={17} /> Notice board <span className="nav-count">08</span>
          </a>
          <a className="nav-item" href="#upcoming">
            <CalendarDays size={17} /> Events
          </a>
          <a className="nav-item" href="#notices">
            <BookOpen size={17} /> Academic updates
          </a>
          <div className="sidebar-divider" />
          <p className="sidebar-label">YOUR CAMPUS</p>
          <div className="campus-card">
            <div className="campus-card-icon">
              <GraduationCap size={19} />
            </div>
            <div>
              <strong>Riverdale College</strong>
              <span>North campus</span>
            </div>
          </div>
          <div className="sidebar-note">
            <span className="sidebar-note-icon">
              <Sparkles size={16} />
            </span>
            <p>Everything happening on campus, in one place.</p>
          </div>
          <div className="sidebar-footer">
            <span className="status-dot" /> All systems up <span>·</span> Help center
          </div>
        </aside>

        <section className="dashboard-main">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">
                MONDAY, NOVEMBER 9, 2026 <span className="eyebrow-mark">✳</span>
              </p>
              <h1>
                Good morning, Maya<span>.</span>
              </h1>
              <p className="welcome-copy">Here’s what’s happening around campus.</p>
            </div>
            <Button onClick={() => setPostOpen(true)} className="post-button">
              <Plus size={17} /> Post a notice
            </Button>
          </div>

          <section className="summary-strip" aria-label="Campus overview">
            <div className="summary-item">
              <span className="summary-icon summary-icon-teal">
                <Megaphone size={17} />
              </span>
              <div>
                <strong>{notices.length.toString().padStart(2, "0")}</strong>
                <span>Active notices</span>
              </div>
            </div>
            <div className="summary-separator" />
            <div className="summary-item">
              <span className="summary-icon summary-icon-coral">
                <ShieldAlert size={17} />
              </span>
              <div>
                <strong>
                  {notices.filter((notice) => notice.category === "Urgent").length.toString().padStart(2, "0")}
                </strong>
                <span>Urgent updates</span>
              </div>
            </div>
            <div className="summary-separator" />
            <div className="summary-item">
              <span className="summary-icon summary-icon-gold">
                <CalendarDays size={17} />
              </span>
              <div>
                <strong>02</strong>
                <span>Upcoming events</span>
              </div>
            </div>
            <div className="summary-right">
              <span className="summary-live-dot" /> Updated just now
            </div>
          </section>

          {published && (
            <div className="publish-confirmation" role="status">
              <span>
                <Check size={15} />
              </span>
              Your notice is now on the board.
              <button onClick={() => setPublished(false)} aria-label="Dismiss confirmation">
                <X size={15} />
              </button>
            </div>
          )}

          <div className="content-grid">
            <section className="notice-section" id="notices">
              <div className="section-heading">
                <div>
                  <div className="heading-title-row">
                    <h2>Notice board</h2>
                    <Badge variant="secondary" className="count-badge">
                      {filteredNotices.length}
                    </Badge>
                  </div>
                  <p>Updates from around your college</p>
                </div>
                <div className="notice-search">
                  <Search size={16} />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search notices"
                    aria-label="Search notices"
                  />
                </div>
              </div>

              <div className="category-tabs" role="tablist" aria-label="Filter notices by category">
                {categories.map((item) => (
                  <button
                    key={item}
                    role="tab"
                    aria-selected={activeCategory === item}
                    className={`category-tab ${activeCategory === item ? "category-tab-active" : ""}`}
                    onClick={() => setActiveCategory(item)}
                  >
                    {item === "All notices" ? "All notices" : item}
                    <span>
                      {item === "All notices"
                        ? notices.length
                        : notices.filter((notice) => notice.category === item).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="notice-list">
                {filteredNotices.length ? (
                  filteredNotices.map((notice) => {
                    const Icon = categoryIcons[notice.category];
                    return (
                      <button
                        key={notice.id}
                        className={`notice-row ${notice.pinned ? "notice-row-pinned" : ""}`}
                        onClick={() => setSelectedNotice(notice)}
                      >
                        <span className={`notice-icon ${categoryStyles[notice.category]}`}>
                          <Icon size={18} />
                        </span>
                        <span className="notice-content">
                          <span className="notice-meta">
                            <span className={`notice-category ${categoryStyles[notice.category]}`}>
                              {notice.category}
                            </span>
                            {notice.pinned && (
                              <span className="pinned-label">
                                <span /> Pinned
                              </span>
                            )}
                            <span className="notice-time">
                              <Clock3 size={12} /> {notice.date}
                            </span>
                          </span>
                          <strong className="notice-title">{notice.title}</strong>
                          <span className="notice-preview">{notice.body}</span>
                          <span className="notice-author">{notice.author}</span>
                        </span>
                        <ChevronRight size={17} className="notice-chevron" />
                      </button>
                    );
                  })
                ) : (
                  <div className="empty-state">
                    <Search size={21} />
                    <strong>No notices found</strong>
                    <span>Try a different search or category.</span>
                  </div>
                )}
              </div>
              <div className="notice-list-footer">
                <span>
                  Showing {filteredNotices.length} of {notices.length} notices
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveCategory("All notices");
                    setSearch("");
                  }}
                >
                  View all notices <ChevronRight size={15} />
                </Button>
              </div>
            </section>

            <aside className="right-rail" id="upcoming">
              <section className="upcoming-section">
                <div className="rail-heading">
                  <div>
                    <h2>Coming up</h2>
                    <p>Mark your calendar</p>
                  </div>
                  <Button variant="ghost" size="icon" aria-label="View calendar">
                    <CalendarDays size={17} />
                  </Button>
                </div>
                <div className="event-list">
                  <div className="event-row">
                    <div className="event-date">
                      <span>NOV</span>
                      <strong>12</strong>
                    </div>
                    <div className="event-copy">
                      <strong>Mid-semester exams begin</strong>
                      <span>
                        <Clock3 size={12} /> 9:00 AM <span className="event-dot">·</span> Main campus
                      </span>
                    </div>
                  </div>
                  <div className="event-row">
                    <div className="event-date event-date-gold">
                      <span>NOV</span>
                      <strong>18</strong>
                    </div>
                    <div className="event-copy">
                      <strong>Annual cultural fest</strong>
                      <span>
                        <Clock3 size={12} /> 4:30 PM <span className="event-dot">·</span> Open grounds
                      </span>
                    </div>
                  </div>
                </div>
                <button className="calendar-link" onClick={() => setActiveCategory("Events")}>
                  See all events <ChevronRight size={15} />
                </button>
              </section>

              <section className="important-note">
                <div className="important-top">
                  <span className="important-icon">
                    <ShieldAlert size={17} />
                  </span>
                  <span>IMPORTANT</span>
                </div>
                <h3>Keep your college ID handy</h3>
                <p>A valid student ID is required to enter examination halls. Contact the office if yours is missing.</p>
                <button onClick={() => setActiveCategory("Exams")}>
                  See exam notices <ChevronRight size={15} />
                </button>
              </section>

              <section className="admin-note">
                <div className="admin-note-icon">
                  <Users size={18} />
                </div>
                <div>
                  <strong>Are you an administrator?</strong>
                  <p>Share an update with the whole campus.</p>
                  <button onClick={() => setPostOpen(true)}>
                    Create a notice <Send size={13} />
                  </button>
                </div>
              </section>
              <div className="rail-footer">
                <span>NotifyHub</span>
                <span>·</span>
                <button>Privacy</button>
                <span>·</span>
                <button>Support</button>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Dialog open={postOpen} onOpenChange={setPostOpen}>
        <DialogContent className="notice-dialog">
          <DialogHeader>
            <DialogTitle>Post a campus notice</DialogTitle>
            <DialogDescription>Share an update with your college community.</DialogDescription>
          </DialogHeader>
          <form onSubmit={publishNotice} className="notice-form">
            <label htmlFor="notice-title">Notice title</label>
            <Input
              id="notice-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Department seminar this Friday"
              maxLength={100}
              required
            />
            <label htmlFor="notice-category">Category</label>
            <select
              id="notice-category"
              value={category}
              onChange={(event) => setCategory(event.target.value as NoticeCategory)}
            >
              {(["Academic", "Exams", "Events", "Urgent"] as NoticeCategory[]).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <label htmlFor="notice-body">Details</label>
            <Textarea
              id="notice-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Add the key information students need to know…"
              rows={5}
              maxLength={700}
              required
            />
            <div className="form-audience">
              <Users size={15} /> Shared with all students
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPostOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Send size={15} /> Publish notice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedNotice)}
        onOpenChange={(open) => {
          if (!open) setSelectedNotice(null);
        }}
      >
        <DialogContent className="notice-dialog">
          {selectedNotice && (
            <>
              <DialogHeader>
                <span className={`detail-category ${categoryStyles[selectedNotice.category]}`}>
                  {selectedNotice.category}
                </span>
                <DialogTitle>{selectedNotice.title}</DialogTitle>
                <DialogDescription>
                  {selectedNotice.author} <span>·</span> {selectedNotice.date}
                </DialogDescription>
              </DialogHeader>
              <p className="detail-body">{selectedNotice.body}</p>
              <div className="detail-audience">
                <Users size={15} /> {selectedNotice.audience}
              </div>
              <DialogFooter>
                <Button onClick={() => setSelectedNotice(null)}>Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
