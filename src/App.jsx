import { useEffect, useMemo, useState } from "react";

const ONE_DAY = 24 * 60 * 60 * 1000;

const DEFAULT_START = "2026-06-08";
const DEFAULT_MAX_HOURS = 10;
const COMPLETED_STORAGE_KEY = "cs-study-planner-completed-v2";
const NOTES_STORAGE_KEY = "cs-study-planner-notes-v1";
const PRIORITY_STORAGE_KEY = "cs-study-planner-priority-v1";
const CUSTOM_CHAPTERS_STORAGE_KEY = "cs-study-planner-custom-chapters-v1";
const THEME_STORAGE_KEY = "cs-study-planner-theme-v1";

function d(year, month, day) {
  return new Date(year, month - 1, day);
}

const SUBJECTS = [
  { id: "jigl", name: "JIGL", group: 1, exam: d(2026, 12, 21) },
  { id: "cmsl", name: "CMSL", group: 2, exam: d(2026, 12, 22) },
  { id: "colaw", name: "Company Law", group: 1, exam: d(2026, 12, 23) },
  { id: "ecipl", name: "ECIPL", group: 2, exam: d(2026, 12, 24) },
  { id: "sbil", name: "SBIL + Labour Laws", group: 1, exam: d(2026, 12, 25) },
  { id: "tax", name: "Tax Laws", group: 2, exam: d(2026, 12, 26), startsOn: d(2026, 6, 20) },
  { id: "cafm", name: "CAFM", group: 1, exam: d(2026, 12, 27) },
];

const CHAPTERS = [
  ["jigl", "IOS", { revision: 2.5, writing: 3 }],
  ["jigl", "RTI", { revision: 3, writing: 3 }],
  ["jigl", "Torts", { revision: 1, writing: 1 }],
  ["jigl", "Administrative Law", { revision: 2, writing: 3 }],
  ["jigl", "Sources of Law", { revision: 4, writing: 4.5 }],
  ["jigl", "ICA", { classes: 18, writing: 4 }],
  ["jigl", "CPC", { classes: 13 }],
  ["jigl", "ADR", { classes: 18, writing: 4 }],
  ["jigl", "CC Act", { classes: 3 }],
  ["jigl", "BNSS", { revision: 3 }],
  ["jigl", "BNS", { revision: 5, writing: 4 }],
  ["jigl", "Limitation", { revision: "estimate", writing: 3 }],
  ["jigl", "COI", { writing: 3 }],
  ["jigl", "IT Act", { classes: 14, writing: 2.5 }],
  ["jigl", "NI Act", { classes: 15, writing: 3 }],
  ["jigl", "BSA", { classes: 16 }],

  ["colaw", "Intro of Company Law", { revision: "estimate" }],
  ["colaw", "Nature and Characteristics of Company", { revision: "estimate" }],
  ["colaw", "Lifting of Corporate Veil", { revision: "estimate" }],
  ["colaw", "Dormant Company", { writing: 3, caseStudy: 2 }],
  ["colaw", "Membership", { revision: 1, caseStudy: 1 }],
  ["colaw", "Transfer and Transmission", { revision: 1, writing: 1 }],
  ["colaw", "Shares", { classes: 5, revision: "estimate" }],
  ["colaw", "CAA", { revision: 10, writing: 3, caseStudy: 2.5 }],
  ["colaw", "Debentures", { revision: "estimate" }],
  ["colaw", "Register and Return", { revision: "estimate" }],
  ["colaw", "Miscellaneous Topics", { classes: 3 }],
  ["colaw", "CSR", { revision: "estimate", writing: 3.5 }],
  ["colaw", "Deposit", { revision: "estimate" }],
  ["colaw", "Charges", { revision: "estimate" }],
  ["colaw", "General Meetings", { revision: "estimate" }],
  ["colaw", "Dividend", { revision: "estimate" }],
  ["colaw", "Auditors", { classes: 24 }],
  ["colaw", "Promotion and Formation of Company", { revision: "estimate", writing: 3 }],
  ["colaw", "Classification of Company - Amendment Class", { classes: "estimate" }],
  ["colaw", "MOA and AOA", { revision: "estimate" }],
  ["colaw", "Prospectus and Allotment", { revision: "estimate" }],
  ["colaw", "Directors", { classes: 150 }],
  ["colaw", "MCA 21", { classes: 8 }],
  ["colaw", "Miscellaneous Concept", { classes: 2 }],
  ["colaw", "Transparency and Disclosures", { classes: 18 }],
  ["colaw", "Company Law Drafting", { classes: 6 }],
  ["colaw", "Company Law Numericals", { classes: 3 }],

  ["sbil", "Selection of Business Organisation", { revision: "estimate", writing: 3 }],
  ["sbil", "Non-corporate Entities", { revision: 6, writing: 3 }],
  ["sbil", "Joint Venture", { revision: 4, writing: 3 }],
  ["sbil", "Startups", { revision: 5, writing: 3 }],
  ["sbil", "MSME", { classes: 2, writing: 3 }],
  ["sbil", "Conversion of Business Entities", { revision: "estimate", writing: 3 }],
  ["sbil", "LLP", { classes: 8, writing: 3 }],
  ["sbil", "FSO", { classes: 12, writing: 2 }],
  ["sbil", "Setting Up Business Outside India", { classes: 11, writing: 1 }],
  ["sbil", "Setting Up Liaison Office", { classes: 12, writing: 3 }],
  ["sbil", "Various Initial Registrations", { classes: 28, writing: 3 }],
  ["sbil", "Past Year Papers", { pyp: 9 }],
  ["sbil", "Code on Wages", { classes: 24 }],
  ["sbil", "Industrial Relations Code", { classes: 25 }],
  ["sbil", "Code on Social Security", { classes: 24 }],
  ["sbil", "Occupational Safety and Health", { classes: 15 }],
  ["sbil", "Sexual Harassment Act", { classes: 7 }],
  ["sbil", "Child and Adolescent Act", { classes: 2 }],
  ["sbil", "Apprentices Act", { classes: 6 }],
  ["sbil", "Constitution and Labour Laws", { classes: 9 }],

  ["cafm", "CAFM Full Course Revision", { revision: 250 }],

  ["cmsl", "Intro to CMSL", { classes: 12 }],
  ["cmsl", "Basics of Capital Market", { classes: 19 }],
  ["cmsl", "Secondary Market in India", { classes: 27 }],
  ["cmsl", "Stock Market in India", { classes: 7 }],
  ["cmsl", "Depositories Act", { classes: 6 }],
  ["cmsl", "Insider Trading", { classes: 33 }],
  ["cmsl", "SEBI SBEB Regulations 2021", { classes: 23 }],
  ["cmsl", "SEBI Act 1992", { classes: 15 }],
  ["cmsl", "SEBI Prohibition of Unfair Trade Practice", { classes: 9 }],
  ["cmsl", "SEBI LODR Regulation", { classes: 24 }],
  ["cmsl", "Mutual Funds", { classes: 24 }],
  ["cmsl", "Collective Investment Schemes", { classes: 7 }],
  ["cmsl", "Acquisition of Shares and Takeovers", { classes: 30 }],
  ["cmsl", "IFSCA", { classes: 16 }],
  ["cmsl", "SEBI ICDR Regulations", { classes: 47 }],
  ["cmsl", "Issue and Listing of Non-convertible Securities", { classes: 6 }],
  ["cmsl", "SEBI Delisting of Equity Shares", { classes: 11 }],
  ["cmsl", "Buyback of Securities", { classes: 15 }],
  ["cmsl", "Securities Contract Act", { classes: 9 }],
  ["cmsl", "Case Studies and Numericals", { caseStudy: 98 }],

  ["ecipl", "Introduction", { classes: 5 }],
  ["ecipl", "Special Economic Zones", { classes: 10 }],
  ["ecipl", "RERA", { classes: 14 }],
  ["ecipl", "FCRA", { classes: 14 }],
  ["ecipl", "Prevention of Money Laundering", { classes: 11 }],
  ["ecipl", "Competition Act", { classes: 16 }],
  ["ecipl", "Consumer Protection Act", { classes: 24 }],
  ["ecipl", "Legal Metrology Act", { classes: 24 }],
  ["ecipl", "FEMA", { classes: 16 }],
  ["ecipl", "Design Act", { classes: 6 }],
  ["ecipl", "GI Act", { classes: 4 }],
  ["ecipl", "Trade Mark Act", { classes: 21 }],
  ["ecipl", "Copyright", { classes: 15 }],
  ["ecipl", "Patent Act", { classes: 12 }],
  ["ecipl", "ODI", { classes: 20 }],
  ["ecipl", "FTP", { classes: 15 }],
  ["ecipl", "FDI", { classes: 20 }],

  ["tax", "Tax Laws - Total Workload", { classes: 180, revision: 90, writing: 30 }],
];

const PHASES = {
  classes: { label: "Classes", color: "#1D4ED8", bg: "#EFF6FF" },
  revision: { label: "Revision", color: "#047857", bg: "#ECFDF5" },
  writing: { label: "Writing Practice", color: "#B45309", bg: "#FFFBEB" },
  caseStudy: { label: "Case Study", color: "#7C3AED", bg: "#F5F3FF" },
  pyp: { label: "Past Papers", color: "#BE123C", bg: "#FFF1F2" },
  mock: { label: "Mock Test", color: "#334155", bg: "#F8FAFC" },
};

function parseDate(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date, days) {
  return new Date(date.getTime() + days * ONE_DAY);
}

function sameDay(a, b) {
  return a.toDateString() === b.toDateString();
}

function fmt(date) {
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function shortDate(date) {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function estimateHours(phase, knownHours) {
  const base = Math.max(knownHours, 4);
  if (phase === "classes") return 4;
  if (phase === "revision") return Math.max(3, Math.round(base * 0.45));
  if (phase === "writing") return 3;
  if (phase === "caseStudy") return 2;
  return 3;
}

function normalizeChapters(customChapters = []) {
  const customRows = customChapters.map((chapter) => [
    chapter.subjectId,
    chapter.chapter,
    { [chapter.phase]: Number(chapter.hours) || 0 },
  ]);

  return [...CHAPTERS, ...customRows].flatMap(([subjectId, chapter, work], chapterIndex) => {
    const subject = SUBJECTS.find((s) => s.id === subjectId);
    if (!subject) return [];
    const knownHours = Object.values(work).reduce((sum, value) => sum + (typeof value === "number" ? value : 0), 0);

    return Object.entries(work).map(([phase, rawHours]) => {
      const estimated = rawHours === "estimate";
      const hours = estimated ? estimateHours(phase, knownHours) : rawHours;

      return {
        id: `${subjectId}-${chapterIndex}-${phase}`,
        subjectId,
        subject: subject.name,
        group: subject.group,
        exam: subject.exam,
        startsOn: subject.startsOn || null,
        chapter,
        phase,
        hours,
        estimated,
        order: chapterIndex,
      };
    });
  });
}

function buildSchedule({ startDate, maxHours, includeSundays, selectedGroups, customChapters }) {
  const start = parseDate(startDate);
  const activeSubjectIds = new Set(SUBJECTS.filter((s) => selectedGroups.includes(s.group)).map((s) => s.id));
  const allTasks = normalizeChapters(customChapters)
    .filter((task) => activeSubjectIds.has(task.subjectId))
    .sort((a, b) => a.exam - b.exam || a.group - b.group || a.subject.localeCompare(b.subject) || a.order - b.order);

  const queue = allTasks.map((task) => ({ ...task, remaining: task.hours }));
  const lastExam = SUBJECTS.filter((s) => activeSubjectIds.has(s.id)).reduce((latest, subject) => {
    return subject.exam > latest ? subject.exam : latest;
  }, start);

  const days = [];
  let cursor = new Date(start);

  while (cursor <= lastExam) {
    const exams = SUBJECTS.filter((s) => activeSubjectIds.has(s.id) && sameDay(s.exam, cursor));
    if (exams.length) {
      days.push({ date: new Date(cursor), type: "exam", exams });
      cursor = addDays(cursor, 1);
      continue;
    }

    const isSunday = cursor.getDay() === 0;
    if (!includeSundays && isSunday) {
      days.push({ date: new Date(cursor), type: "off", entries: [] });
      cursor = addDays(cursor, 1);
      continue;
    }

    let capacity = maxHours;
    const entries = [];

    while (capacity > 0.01) {
      const task = queue.find((item) => {
        const started = !item.startsOn || cursor >= item.startsOn;
        const beforeExam = cursor < item.exam;
        return item.remaining > 0.01 && started && beforeExam;
      });

      if (!task) break;

      const hrs = Math.min(capacity, task.remaining);
      const rounded = Math.round(hrs * 10) / 10;
      entries.push({ ...task, hoursToday: rounded });
      task.remaining = Math.round((task.remaining - rounded) * 10) / 10;
      capacity = Math.round((capacity - rounded) * 10) / 10;
    }

    days.push({ date: new Date(cursor), type: entries.length ? "study" : "buffer", entries });
    cursor = addDays(cursor, 1);
  }

  const overflow = queue.filter((task) => task.remaining > 0.01);
  return { days, tasks: allTasks, overflow };
}

function totalHours(tasks) {
  return Math.round(tasks.reduce((sum, task) => sum + task.hours, 0) * 10) / 10;
}

function readStorage(key, fallback) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // State still works for the current session if browser storage is unavailable.
  }
}

function entryKey(day, entry) {
  return `${day.date.toISOString().slice(0, 10)}__${entry.id}`;
}

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getMockSubjects(date, selectedGroups) {
  return SUBJECTS.filter((subject) => selectedGroups.includes(subject.group) && sameDay(addDays(subject.exam, -7), date));
}

function makeCsv(rows) {
  return rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
}

function makeId() {
  return window.crypto?.randomUUID?.() || `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function App() {
  const [startDate, setStartDate] = useState(DEFAULT_START);
  const [maxHours, setMaxHours] = useState(DEFAULT_MAX_HOURS);
  const [includeSundays, setIncludeSundays] = useState(true);
  const [groupMode, setGroupMode] = useState("both");
  const [view, setView] = useState("calendar");
  const [completed, setCompleted] = useState(() => readStorage(COMPLETED_STORAGE_KEY, {}));
  const [notes, setNotes] = useState(() => readStorage(NOTES_STORAGE_KEY, {}));
  const [priorities, setPriorities] = useState(() => readStorage(PRIORITY_STORAGE_KEY, {}));
  const [customChapters, setCustomChapters] = useState(() => readStorage(CUSTOM_CHAPTERS_STORAGE_KEY, []));
  const [theme, setTheme] = useState(() => readStorage(THEME_STORAGE_KEY, "light"));
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [newChapter, setNewChapter] = useState({ subjectId: "jigl", chapter: "", phase: "classes", hours: 1 });

  const selectedGroups = groupMode === "both" ? [1, 2] : [Number(groupMode)];
  const result = useMemo(
    () => buildSchedule({ startDate, maxHours: Number(maxHours), includeSundays, selectedGroups, customChapters }),
    [startDate, maxHours, includeSundays, groupMode, customChapters]
  );

  const subjectStats = SUBJECTS.filter((subject) => selectedGroups.includes(subject.group)).map((subject) => {
    const tasks = result.tasks.filter((task) => task.subjectId === subject.id);
    const subjectCompleted = totalHours(
      result.days.flatMap((day) => {
        if (day.type !== "study") return [];
        return day.entries
          .filter((entry) => entry.subjectId === subject.id && completed[entryKey(day, entry)])
          .map((entry) => ({ hours: entry.hoursToday }));
      })
    );
    const hours = totalHours(tasks);
    return {
      ...subject,
      hours,
      completed: subjectCompleted,
      percent: hours ? Math.round((subjectCompleted / hours) * 100) : 0,
      estimated: tasks.filter((task) => task.estimated).length,
    };
  });

  const filteredDays = result.days.map((day) => {
    if (day.type !== "study") return day;
    const entries = day.entries.filter((entry) => {
      const key = entryKey(day, entry);
      const text = `${entry.subject} ${entry.chapter} ${PHASES[entry.phase]?.label || ""} ${notes[key] || ""}`.toLowerCase();
      const subjectOk = subjectFilter === "all" || entry.subjectId === subjectFilter;
      const phaseOk = phaseFilter === "all" || entry.phase === phaseFilter;
      const searchOk = !search.trim() || text.includes(search.trim().toLowerCase());
      const priorityOk = !priorityOnly || priorities[key];
      return subjectOk && phaseOk && searchOk && priorityOk;
    });
    return { ...day, entries, type: entries.length ? "study" : "filtered" };
  });
  const visibleDays = filteredDays.filter((day) => {
    if (day.type === "filtered") return view === "calendar";
    return day.type !== "buffer" || view === "calendar";
  });
  const totalWorkload = totalHours(result.tasks);
  const overflowHours = totalHours(result.overflow.map((task) => ({ hours: task.remaining })));
  const completedHours = totalWorkload - overflowHours;
  const studyDays = result.days.filter((day) => day.type === "study").length;
  const avgHours = studyDays ? Math.round((completedHours / studyDays) * 10) / 10 : 0;
  const firstStart = parseDate(startDate);
  const nextExam = SUBJECTS.filter((subject) => selectedGroups.includes(subject.group))
    .sort((a, b) => a.exam - b.exam)[0];
  const examCount = SUBJECTS.filter((subject) => selectedGroups.includes(subject.group)).length;
  const groupLabel = groupMode === "both" ? "Both groups" : `Group ${groupMode}`;
  const phaseTotals = Object.entries(PHASES).map(([phase, meta]) => ({
    phase,
    ...meta,
    hours: totalHours(result.tasks.filter((task) => task.phase === phase)),
  })).filter((item) => item.hours > 0);
  const completedStudyHours = totalHours(
    result.days.flatMap((day) => {
      if (day.type !== "study") return [];
      return day.entries
        .map((entry) => ({ hours: completed[entryKey(day, entry)] ? entry.hoursToday : 0 }))
        .filter((entry) => entry.hours > 0);
    })
  );
  const completionPercent = completedHours ? Math.round((completedStudyHours / completedHours) * 100) : 0;
  const subjectOptions = SUBJECTS.filter((subject) => selectedGroups.includes(subject.group));

  useEffect(() => {
    saveStorage(COMPLETED_STORAGE_KEY, completed);
  }, [completed]);

  useEffect(() => saveStorage(NOTES_STORAGE_KEY, notes), [notes]);
  useEffect(() => saveStorage(PRIORITY_STORAGE_KEY, priorities), [priorities]);
  useEffect(() => saveStorage(CUSTOM_CHAPTERS_STORAGE_KEY, customChapters), [customChapters]);
  useEffect(() => saveStorage(THEME_STORAGE_KEY, theme), [theme]);

  function toggleCompleted(key) {
    setCompleted((current) => {
      const next = { ...current };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      saveStorage(COMPLETED_STORAGE_KEY, next);
      return next;
    });
  }

  function resetCompleted() {
    saveStorage(COMPLETED_STORAGE_KEY, {});
    setCompleted({});
  }

  function updateNote(key, value) {
    setNotes((current) => {
      const next = { ...current };
      if (value.trim()) next[key] = value;
      else delete next[key];
      saveStorage(NOTES_STORAGE_KEY, next);
      return next;
    });
  }

  function togglePriority(key) {
    setPriorities((current) => {
      const next = { ...current };
      if (next[key]) delete next[key];
      else next[key] = true;
      saveStorage(PRIORITY_STORAGE_KEY, next);
      return next;
    });
  }

  function addCustomChapter(event) {
    event.preventDefault();
    if (!newChapter.chapter.trim() || Number(newChapter.hours) <= 0) return;
    setCustomChapters((current) => [
      ...current,
      { ...newChapter, id: makeId(), chapter: newChapter.chapter.trim(), hours: Number(newChapter.hours) },
    ]);
    setNewChapter({ subjectId: newChapter.subjectId, chapter: "", phase: newChapter.phase, hours: 1 });
  }

  function removeCustomChapter(id) {
    setCustomChapters((current) => current.filter((chapter) => chapter.id !== id));
  }

  function exportBackup() {
    const data = {
      completed,
      notes,
      priorities,
      customChapters,
      settings: { startDate, maxHours, includeSundays, groupMode, theme },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cs-study-planner-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || "{}"));
        if (data.completed) setCompleted(data.completed);
        if (data.notes) setNotes(data.notes);
        if (data.priorities) setPriorities(data.priorities);
        if (Array.isArray(data.customChapters)) setCustomChapters(data.customChapters);
        if (data.settings) {
          if (data.settings.startDate) setStartDate(data.settings.startDate);
          if (data.settings.maxHours) setMaxHours(data.settings.maxHours);
          if (typeof data.settings.includeSundays === "boolean") setIncludeSundays(data.settings.includeSundays);
          if (data.settings.groupMode) setGroupMode(data.settings.groupMode);
          if (data.settings.theme) setTheme(data.settings.theme);
        }
      } catch {
        window.alert("Backup file could not be imported.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function exportCsv() {
    const rows = [["Date", "Subject", "Chapter", "Phase", "Hours", "Completed", "Priority", "Note"]];
    result.days.forEach((day) => {
      if (day.type !== "study") return;
      day.entries.forEach((entry) => {
        const key = entryKey(day, entry);
        rows.push([
          fmt(day.date),
          entry.subject,
          entry.chapter,
          PHASES[entry.phase]?.label || entry.phase,
          entry.hoursToday,
          completed[key] ? "Yes" : "No",
          priorities[key] ? "High" : "",
          notes[key] || "",
        ]);
      });
    });
    const blob = new Blob([makeCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cs-study-planner.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function jumpToToday() {
    const today = dateKey(new Date());
    const target = document.getElementById(`day-${today}`) || document.querySelector("[id^='day-']");
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <main className={`app-shell ${theme === "dark" ? "dark" : ""}`}>
      <style>{`
        * { box-sizing: border-box; }
        :root {
          color-scheme: light;
          --ink: #16202e;
          --muted: #637184;
          --line: #d8e1ec;
          --paper: #ffffff;
          --soft: #f7f9fc;
          --blue: #2356d7;
          --teal: #0f766e;
          --amber: #b45309;
          --red: #b91c1c;
        }
        .dark {
          --ink: #e5edf7;
          --muted: #9aa8ba;
          --line: #2d3b4f;
          --paper: #111827;
          --soft: #0b1220;
          --blue: #7aa2ff;
          --teal: #5eead4;
          --amber: #fbbf24;
          --red: #fca5a5;
        }
        body {
          margin: 0;
          background: linear-gradient(180deg, #edf4ff 0, #f7f9fc 270px, #f3f6fa 100%);
          color: var(--ink);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .dark {
          color: var(--ink);
        }
        body:has(.dark) {
          background: linear-gradient(180deg, #101827 0, #0b1220 270px, #0f172a 100%);
        }
        button, input, select { font: inherit; }
        .app-shell {
          width: min(1240px, calc(100% - 28px));
          margin: 0 auto;
          padding: 22px 0 42px;
        }
        .topbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 280px;
          gap: 22px;
          align-items: stretch;
          margin-bottom: 14px;
        }
        .hero-copy {
          min-height: 230px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid rgba(35, 86, 215, .18);
          border-radius: 8px;
          background:
            linear-gradient(135deg, rgba(255,255,255,.92), rgba(255,255,255,.74)),
            radial-gradient(circle at top right, rgba(15,118,110,.18), transparent 34%);
          padding: 24px;
          box-shadow: 0 18px 45px rgba(42, 61, 86, .08);
        }
        .dark .hero-copy {
          background:
            linear-gradient(135deg, rgba(17,24,39,.96), rgba(17,24,39,.86)),
            radial-gradient(circle at top right, rgba(94,234,212,.14), transparent 34%);
        }
        .eyebrow {
          margin: 0 0 6px;
          color: var(--blue);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        h1 {
          margin: 0;
          max-width: 760px;
          font-size: clamp(34px, 5vw, 60px);
          line-height: 1;
          letter-spacing: 0;
        }
        .subhead {
          max-width: 720px;
          margin: 12px 0 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.5;
        }
        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 22px;
        }
        .hero-meta span {
          border: 1px solid #dbe5f1;
          border-radius: 999px;
          background: rgba(255, 255, 255, .76);
          color: #334155;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 800;
        }
        .dark .hero-meta span {
          border-color: #334155;
          background: rgba(15, 23, 42, .8);
          color: #cbd5e1;
        }
        .score {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid #cbd5e1;
          background: var(--paper);
          border-radius: 8px;
          padding: 18px;
          box-shadow: 0 18px 45px rgba(42, 61, 86, .08);
        }
        .score span {
          display: block;
          font-size: 42px;
          font-weight: 850;
          color: var(--teal);
          line-height: 1;
        }
        .score small {
          color: var(--muted);
          font-weight: 700;
        }
        .score p {
          margin: 12px 0 0;
          color: #475569;
          font-size: 13px;
          line-height: 1.45;
        }
        .metric-strip {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
          margin: 14px 0;
        }
        .metric {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--paper);
          padding: 13px 14px;
        }
        .metric span {
          display: block;
          color: var(--muted);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .05em;
          text-transform: uppercase;
        }
        .metric strong {
          display: block;
          margin-top: 5px;
          color: var(--ink);
          font-size: 22px;
          line-height: 1.1;
        }
        .controls {
          display: grid;
          grid-template-columns: 1fr 150px 190px 138px;
          gap: 10px;
          margin: 14px 0 18px;
          align-items: end;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(255, 255, 255, .86);
          padding: 12px;
        }
        label {
          display: grid;
          gap: 6px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .04em;
        }
        input, select, textarea, .toggle {
          width: 100%;
          height: 42px;
          border: 1px solid #c7d2df;
          border-radius: 8px;
          background: var(--paper);
          color: var(--ink);
          padding: 0 12px;
        }
        textarea {
          min-height: 38px;
          resize: vertical;
          padding: 9px 10px;
        }
        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          padding: 0;
          accent-color: var(--teal);
          cursor: pointer;
        }
        input:focus, select:focus {
          outline: 3px solid rgba(35, 86, 215, .16);
          border-color: var(--blue);
        }
        .toggle {
          cursor: pointer;
          font-weight: 800;
          color: #475569;
          transition: .16s ease;
        }
        .toggle:hover { border-color: var(--blue); color: var(--blue); }
        .toggle.active {
          border-color: var(--blue);
          background: var(--blue);
          color: #ffffff;
        }
        .toggle.small {
          width: auto;
          min-width: 98px;
          height: 36px;
          padding: 0 10px;
          font-size: 12px;
        }
        .file-button {
          position: relative;
          overflow: hidden;
        }
        .file-button input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }
        .filter-grid, .editor-panel {
          display: grid;
          grid-template-columns: 1.1fr 180px 180px 140px 140px;
          gap: 10px;
          align-items: end;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(255, 255, 255, .86);
          padding: 12px;
          margin: 12px 0 18px;
        }
        .dark .filter-grid, .dark .controls, .dark .editor-panel {
          background: rgba(17, 24, 39, .86);
        }
        .editor-panel {
          grid-template-columns: 180px 1fr 170px 120px auto;
        }
        .custom-list {
          display: grid;
          gap: 8px;
          margin-top: 10px;
        }
        .custom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--paper);
          padding: 9px 10px;
          font-size: 13px;
        }
        .section-title {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: end;
          margin: 22px 0 10px;
        }
        .section-title h2 {
          margin: 0;
          font-size: 18px;
          line-height: 1.2;
        }
        .section-title p {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 13px;
        }
        .cards {
          display: grid;
          grid-template-columns: repeat(7, minmax(142px, 1fr));
          gap: 10px;
          margin-bottom: 16px;
        }
        .subject-card {
          min-height: 170px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--paper);
          padding: 14px;
          box-shadow: 0 10px 24px rgba(42, 61, 86, .05);
        }
        .subject-card h2 {
          margin: 8px 0;
          font-size: 16px;
          line-height: 1.2;
          letter-spacing: 0;
        }
        .subject-card strong {
          color: var(--teal);
          font-size: 24px;
          line-height: 1;
        }
        .subject-card p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.35;
        }
        .subject-progress {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 8px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
        }
        .group-tag {
          display: inline-flex;
          width: fit-content;
          border-radius: 999px;
          background: #eef2ff;
          color: #3730a3;
          padding: 3px 8px;
          font-size: 11px;
          font-weight: 800;
        }
        .progress-track {
          height: 6px;
          overflow: hidden;
          border-radius: 999px;
          background: #edf2f7;
          margin-top: 12px;
        }
        .progress-fill {
          height: 100%;
          min-width: 7%;
          border-radius: inherit;
          background: linear-gradient(90deg, var(--blue), var(--teal));
        }
        .muted { opacity: .8; }
        .alert {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          margin: 16px 0;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          background: #fff1f2;
          color: #991b1b;
          padding: 12px 14px;
          font-size: 14px;
        }
        .alert span { color: #7f1d1d; }
        .phase-panel {
          display: grid;
          grid-template-columns: minmax(240px, .8fr) 1.2fr;
          gap: 10px;
          margin: 16px 0;
        }
        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-content: start;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--paper);
          padding: 12px;
          margin: 0;
        }
        .legend span, .phase {
          border-radius: 999px;
          padding: 4px 9px;
          font-size: 11px;
          font-weight: 850;
          white-space: nowrap;
        }
        .phase-bars {
          display: grid;
          gap: 8px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--paper);
          padding: 12px;
        }
        .phase-bar {
          display: grid;
          grid-template-columns: 140px 1fr 76px;
          gap: 10px;
          align-items: center;
          font-size: 12px;
          color: #475569;
        }
        .phase-bar b { color: var(--ink); }
        .phase-bar-track {
          height: 8px;
          overflow: hidden;
          border-radius: 999px;
          background: #edf2f7;
        }
        .phase-bar-fill {
          height: 100%;
          border-radius: inherit;
        }
        .table-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          border: 1px solid var(--line);
          border-bottom: 0;
          border-radius: 8px 8px 0 0;
          background: var(--paper);
          padding: 13px 14px;
        }
        .table-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: flex-end;
        }
        .table-head h2 {
          margin: 0;
          font-size: 18px;
        }
        .table-head span {
          color: var(--muted);
          font-size: 13px;
        }
        .plan {
          overflow: auto;
          border: 1px solid var(--line);
          border-radius: 0 0 8px 8px;
          background: var(--paper);
        }
        table {
          width: 100%;
          min-width: 1160px;
          border-collapse: collapse;
          font-size: 13px;
        }
        th {
          position: sticky;
          top: 0;
          z-index: 1;
          background: #f8fafc;
          color: var(--muted);
          font-size: 11px;
          letter-spacing: .05em;
          text-transform: uppercase;
        }
        th, td {
          border-bottom: 1px solid #edf2f7;
          padding: 10px 12px;
          text-align: left;
          vertical-align: top;
        }
        tbody tr:hover td { background: #fbfdff; }
        td:first-child {
          width: 164px;
          color: #334155;
          font-weight: 800;
        }
        .hours-cell {
          width: 90px;
          color: #0f766e;
          font-weight: 850;
          white-space: nowrap;
        }
        .done-cell {
          width: 82px;
          text-align: center;
        }
        .completed-row td {
          background: #f0fdf4;
          color: #64748b;
        }
        .completed-row .chapter-text {
          text-decoration: line-through;
          text-decoration-thickness: 2px;
          text-decoration-color: rgba(15, 118, 110, .45);
        }
        .completed-row .hours-cell {
          color: var(--teal);
        }
        .today-row td {
          box-shadow: inset 0 1px 0 rgba(35, 86, 215, .25), inset 0 -1px 0 rgba(35, 86, 215, .25);
          background: #eef6ff;
        }
        .daily-meter {
          display: grid;
          gap: 5px;
          margin-top: 6px;
          color: var(--muted);
          font-size: 11px;
          font-weight: 800;
        }
        .daily-meter span {
          height: 5px;
          overflow: hidden;
          border-radius: 999px;
          background: #e2e8f0;
        }
        .daily-meter i {
          display: block;
          height: 100%;
          background: var(--teal);
        }
        .priority-btn {
          width: auto;
          min-width: 64px;
          height: 28px;
          border: 1px solid #cbd5e1;
          border-radius: 999px;
          background: #fff;
          color: #64748b;
          cursor: pointer;
          font-size: 11px;
          font-weight: 850;
        }
        .priority-btn.active {
          border-color: #f59e0b;
          background: #fffbeb;
          color: #92400e;
        }
        .note-input {
          min-width: 180px;
          width: 100%;
          height: 34px;
          min-height: 34px;
          font-size: 12px;
        }
        .mock-row td {
          background: #fff7ed;
          color: #9a3412;
          font-weight: 850;
        }
        .exam-row td {
          background: #e0f2fe;
          color: #075985;
          font-weight: 850;
        }
        .quiet-row td {
          background: #f8fafc;
          color: #94a3b8;
        }
        .estimate {
          display: inline-block;
          margin-left: 8px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #64748b;
          padding: 2px 7px;
          font-size: 10px;
          font-weight: 800;
          vertical-align: middle;
        }
        .footer-note {
          margin: 14px 0 0;
          color: var(--muted);
          font-size: 12px;
          text-align: right;
        }
        .mobile-bar {
          position: sticky;
          bottom: 10px;
          z-index: 5;
          display: none;
          gap: 8px;
          margin-top: 14px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(255,255,255,.94);
          padding: 8px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, .14);
        }
        .dark .mobile-bar { background: rgba(17,24,39,.94); }
        @media print {
          .controls, .filter-grid, .table-actions, .editor-panel, .mobile-bar, .footer-note { display: none !important; }
          body { background: #fff; }
          .app-shell { width: 100%; padding: 0; }
          .plan { overflow: visible; }
          table { min-width: 0; font-size: 11px; }
        }
        @media (max-width: 900px) {
          .topbar { grid-template-columns: 1fr; }
          .metric-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .controls { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .phase-panel { grid-template-columns: 1fr; }
          .filter-grid, .editor-panel { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .alert { flex-direction: column; }
        }
        @media (max-width: 560px) {
          .app-shell { width: min(100% - 18px, 1180px); padding-top: 12px; }
          .controls, .cards, .metric-strip { grid-template-columns: 1fr; }
          .hero-copy { min-height: auto; padding: 18px; }
          .subject-card { min-height: 130px; }
          .phase-bar { grid-template-columns: 1fr; gap: 5px; }
          .table-head { align-items: flex-start; flex-direction: column; }
          .table-actions { width: 100%; justify-content: stretch; }
          .filter-grid, .editor-panel { grid-template-columns: 1fr; }
          .mobile-bar { display: grid; grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
      <section className="topbar">
        <div className="hero-copy">
          <div>
            <p className="eyebrow">CS Study Planner</p>
            <h1>Chapter-wise timetable</h1>
            <p className="subhead">A base version for planning December 2026 prep across chapters, revisions, writing practice, case studies, and exam dates.</p>
          </div>
          <div className="hero-meta">
            <span>{groupLabel}</span>
            <span>{maxHours || 0} hrs/day</span>
            <span>Sundays {includeSundays ? "included" : "off"}</span>
            <span>{examCount} exams</span>
            <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
          </div>
        </div>
        <div className="score">
          <div>
            <span>{Math.round(completedHours)}</span>
            <small>{completionPercent}% completed</small>
          </div>
          <p>{Math.round(completedStudyHours)} of {Math.round(completedHours)} scheduled hours marked complete.</p>
        </div>
      </section>

      <section className="metric-strip">
        <div className="metric">
          <span>Total workload</span>
          <strong>{Math.round(totalWorkload)} hrs</strong>
        </div>
        <div className="metric">
          <span>Study days</span>
          <strong>{studyDays}</strong>
        </div>
        <div className="metric">
          <span>Average pace</span>
          <strong>{avgHours} hrs/day</strong>
        </div>
        <div className="metric">
          <span>Completed</span>
          <strong>{Math.round(completedStudyHours)} hrs</strong>
        </div>
        <div className="metric">
          <span>First exam</span>
          <strong>{nextExam ? shortDate(nextExam.exam) : "-"}</strong>
        </div>
      </section>

      <section className="controls">
        <label>
          Start date
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>
        <label>
          Max hours/day
          <input type="number" min="1" max="16" value={maxHours} onChange={(event) => setMaxHours(event.target.value)} />
        </label>
        <label>
          Group
          <select value={groupMode} onChange={(event) => setGroupMode(event.target.value)}>
            <option value="both">Both groups</option>
            <option value="1">Group 1</option>
            <option value="2">Group 2</option>
          </select>
        </label>
        <button className={includeSundays ? "toggle active" : "toggle"} onClick={() => setIncludeSundays((value) => !value)}>
          Sundays {includeSundays ? "on" : "off"}
        </button>
      </section>

      <section className="filter-grid">
        <label>
          Search chapters
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Directors, FEMA, notes..." />
        </label>
        <label>
          Subject
          <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
            <option value="all">All subjects</option>
            {subjectOptions.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
          </select>
        </label>
        <label>
          Phase
          <select value={phaseFilter} onChange={(event) => setPhaseFilter(event.target.value)}>
            <option value="all">All phases</option>
            {Object.entries(PHASES).map(([key, phase]) => <option key={key} value={key}>{phase.label}</option>)}
          </select>
        </label>
        <button className={priorityOnly ? "toggle active" : "toggle"} onClick={() => setPriorityOnly((value) => !value)}>
          Priority only
        </button>
        <button className="toggle" onClick={jumpToToday}>
          Today
        </button>
      </section>

      <section className="filter-grid">
        <button className="toggle" onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button className="toggle" onClick={exportCsv}>
          Export CSV
        </button>
        <button className="toggle" onClick={() => window.print()}>
          Print / PDF
        </button>
        <button className="toggle" onClick={exportBackup}>
          Backup
        </button>
        <label className="toggle file-button">
          Restore
          <input type="file" accept="application/json" onChange={importBackup} />
        </label>
      </section>

      <section className="section-title">
        <div>
          <h2>Data editor</h2>
          <p>Add extra chapters locally without touching code. They are included in backup files.</p>
        </div>
        <button className="toggle small" onClick={() => setShowEditor((value) => !value)}>{showEditor ? "Hide editor" : "Add chapter"}</button>
      </section>

      {showEditor && (
        <>
          <form className="editor-panel" onSubmit={addCustomChapter}>
            <label>
              Subject
              <select value={newChapter.subjectId} onChange={(event) => setNewChapter((value) => ({ ...value, subjectId: event.target.value }))}>
                {SUBJECTS.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
              </select>
            </label>
            <label>
              Chapter
              <input value={newChapter.chapter} onChange={(event) => setNewChapter((value) => ({ ...value, chapter: event.target.value }))} placeholder="Chapter name" />
            </label>
            <label>
              Phase
              <select value={newChapter.phase} onChange={(event) => setNewChapter((value) => ({ ...value, phase: event.target.value }))}>
                {Object.entries(PHASES).map(([key, phase]) => <option key={key} value={key}>{phase.label}</option>)}
              </select>
            </label>
            <label>
              Hours
              <input type="number" min="0.5" step="0.5" value={newChapter.hours} onChange={(event) => setNewChapter((value) => ({ ...value, hours: event.target.value }))} />
            </label>
            <button className="toggle active" type="submit">Add</button>
          </form>
          {customChapters.length > 0 && (
            <div className="custom-list">
              {customChapters.map((chapter) => {
                const subject = SUBJECTS.find((item) => item.id === chapter.subjectId);
                return (
                  <div className="custom-row" key={chapter.id}>
                    <span>{subject?.name} | {chapter.chapter} | {PHASES[chapter.phase]?.label} | {chapter.hours} hrs</span>
                    <button className="toggle small" onClick={() => removeCustomChapter(chapter.id)}>Remove</button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <section className="section-title">
        <div>
          <h2>Subjects</h2>
          <p>Workload and exam timing for the current group selection.</p>
        </div>
      </section>

      <section className="cards">
        {subjectStats.map((subject) => (
          <article key={subject.id} className="subject-card">
            <div>
              <span className="group-tag">Group {subject.group}</span>
              <h2>{subject.name}</h2>
            </div>
            <strong>{subject.hours} hrs</strong>
            <p>Exam: {shortDate(subject.exam)}{subject.startsOn ? ` | starts ${shortDate(subject.startsOn)}` : ""}</p>
            {subject.estimated > 0 && <p className="muted">{subject.estimated} estimated items</p>}
            <div className="subject-progress">
              <span>{Math.round(subject.completed)} hrs done</span>
              <span>{subject.percent}%</span>
            </div>
            <div className="progress-track" aria-hidden="true">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, Math.max(3, subject.percent))}%` }}
              />
            </div>
          </article>
        ))}
      </section>

      {result.overflow.length > 0 && (
        <section className="alert">
          <strong>{Math.round(overflowHours)} hours do not fit before exams.</strong>
          <span>Increase daily hours, start earlier, remove Sundays off, or reduce estimated hours.</span>
        </section>
      )}

      <section className="phase-panel">
        <div className="legend">
          {Object.entries(PHASES).map(([key, phase]) => (
            <span key={key} style={{ background: phase.bg, color: phase.color }}>{phase.label}</span>
          ))}
        </div>
        <div className="phase-bars">
          {phaseTotals.map((item) => (
            <div className="phase-bar" key={item.phase}>
              <b>{item.label}</b>
              <div className="phase-bar-track">
                <div
                  className="phase-bar-fill"
                  style={{ width: `${Math.max(4, (item.hours / Math.max(1, totalWorkload)) * 100)}%`, background: item.color }}
                />
              </div>
              <span>{item.hours} hrs</span>
            </div>
          ))}
        </div>
      </section>

      <div className="table-head">
        <div>
          <h2>Day-wise plan</h2>
          <span>{visibleDays.length} rows of calendar output from {shortDate(firstStart)}</span>
        </div>
        <div className="table-actions">
          <button className={view === "calendar" ? "toggle active" : "toggle"} onClick={() => setView(view === "calendar" ? "work" : "calendar")}>
            {view === "calendar" ? "All days" : "Work only"}
          </button>
          <button className="toggle" onClick={resetCompleted}>
            Reset progress
          </button>
        </div>
      </div>
      <section className="plan">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Chapter</th>
              <th>Phase</th>
              <th>Hours</th>
              <th>Priority</th>
              <th>Notes</th>
              <th>Done</th>
            </tr>
          </thead>
          <tbody>
            {visibleDays.map((day) => {
              const mockSubjects = getMockSubjects(day.date, selectedGroups);
              const isToday = sameDay(day.date, new Date());

              if (day.type === "exam") {
                return (
                  <tr key={day.date.toISOString()} id={`day-${dateKey(day.date)}`} className={isToday ? "exam-row today-row" : "exam-row"}>
                    <td>{fmt(day.date)}</td>
                    <td colSpan="7">Exam day: {day.exams.map((exam) => exam.name).join(", ")}</td>
                  </tr>
                );
              }

              if (day.type === "off" || day.type === "buffer") {
                return [
                  mockSubjects.length > 0 ? (
                    <tr key={`${day.date.toISOString()}-mock`} id={`day-${dateKey(day.date)}`} className={isToday ? "mock-row today-row" : "mock-row"}>
                      <td>{fmt(day.date)}</td>
                      <td colSpan="7">Mock test: {mockSubjects.map((subject) => subject.name).join(", ")}</td>
                    </tr>
                  ) : null,
                  <tr key={day.date.toISOString()} id={mockSubjects.length ? undefined : `day-${dateKey(day.date)}`} className={isToday ? "quiet-row today-row" : "quiet-row"}>
                    <td>{fmt(day.date)}</td>
                    <td colSpan="7">{day.type === "off" ? "Sunday off" : "Buffer day"}</td>
                  </tr>,
                ];
              }

              if (day.type === "filtered") {
                return (
                  <tr key={day.date.toISOString()} id={`day-${dateKey(day.date)}`} className={isToday ? "quiet-row today-row" : "quiet-row"}>
                    <td>{fmt(day.date)}</td>
                    <td colSpan="7">No rows match current filters</td>
                  </tr>
                );
              }

              const dayTotal = totalHours(day.entries.map((entry) => ({ hours: entry.hoursToday })));
              const dayDone = totalHours(day.entries.filter((entry) => completed[entryKey(day, entry)]).map((entry) => ({ hours: entry.hoursToday })));
              const dayPercent = dayTotal ? Math.round((dayDone / dayTotal) * 100) : 0;
              const studyRows = day.entries.map((entry, index) => {
                const phase = PHASES[entry.phase];
                const key = entryKey(day, entry);
                const isDone = Boolean(completed[key]);
                return (
                  <tr
                    key={`${day.date.toISOString()}-${entry.id}-${index}`}
                    id={index === 0 && !mockSubjects.length ? `day-${dateKey(day.date)}` : undefined}
                    className={`${isDone ? "completed-row" : ""} ${isToday ? "today-row" : ""}`}
                  >
                    {index === 0 && (
                      <td rowSpan={day.entries.length}>
                        {fmt(day.date)}
                        <div className="daily-meter">
                          <span><i style={{ width: `${dayPercent}%` }} /></span>
                          {dayDone}/{dayTotal} hrs
                        </div>
                      </td>
                    )}
                    <td>{entry.subject}</td>
                    <td><span className="chapter-text">{entry.chapter}</span>{entry.estimated ? <span className="estimate">estimated</span> : null}</td>
                    <td><span className="phase" style={{ background: phase.bg, color: phase.color }}>{phase.label}</span></td>
                    <td className="hours-cell">{entry.hoursToday} hrs</td>
                    <td>
                      <button className={priorities[key] ? "priority-btn active" : "priority-btn"} onClick={() => togglePriority(key)}>
                        {priorities[key] ? "High" : "Normal"}
                      </button>
                    </td>
                    <td>
                      <textarea
                        className="note-input"
                        value={notes[key] || ""}
                        placeholder="Add note"
                        onChange={(event) => updateNote(key, event.target.value)}
                      />
                    </td>
                    <td className="done-cell">
                      <input
                        type="checkbox"
                        checked={isDone}
                        aria-label={`Mark ${entry.subject} ${entry.chapter} complete`}
                        onChange={() => toggleCompleted(key)}
                      />
                    </td>
                  </tr>
                );
              });
              return [
                mockSubjects.length > 0 ? (
                  <tr key={`${day.date.toISOString()}-mock`} id={`day-${dateKey(day.date)}`} className={isToday ? "mock-row today-row" : "mock-row"}>
                    <td>{fmt(day.date)}</td>
                    <td colSpan="7">Mock test: {mockSubjects.map((subject) => subject.name).join(", ")}</td>
                  </tr>
                ) : null,
                ...studyRows,
              ];
            })}
          </tbody>
        </table>
      </section>
      <div className="mobile-bar">
        <button className="toggle" onClick={jumpToToday}>Today</button>
        <button className={priorityOnly ? "toggle active" : "toggle"} onClick={() => setPriorityOnly((value) => !value)}>Priority</button>
        <button className="toggle" onClick={exportBackup}>Backup</button>
      </div>
      <p className="footer-note">Base version: data and scheduling rules are centralized in src/App.jsx.</p>
    </main>
  );
}

export default App;
