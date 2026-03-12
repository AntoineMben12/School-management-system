import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Check,
  AlertTriangle,
  BookOpen,
  Calendar,
  Users,
  DollarSign,
  FileText,
  MessageSquare,
  Upload,
  Send,
  Phone,
  Mail,
  Shield,
  Activity,
  Grid,
  List,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Bell,
  Settings,
  ArrowUpDown,
  CheckSquare,
  Square,
  Loader,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { adminAPI } from "../../services/api";

// Palette
const P = {
  900: "#2D0A6E",
  800: "#3B0F8A",
  700: "#4C1DA8",
  600: "#5B21B6",
  500: "#7C3AED",
  400: "#8B5CF6",
  300: "#A78BFA",
  200: "#C4B5FD",
  100: "#EDE9FE",
  50: "#F5F3FF",
  pink: "#D946EF",
  rose: "#F43F5E",
  green: "#059669",
  amber: "#D97706",
  sky: "#0284C7",
  bg: "#F3F0FB",
  card: "#FFFFFF",
  text: "#1A0E3A",
  muted: "#6B5B9A",
  border: "#E4DCFA",
};
const SEC = { A: P[600], B: "#6D28D9", C: "#7C3AED", D: "#8B5CF6" };

const ATT_D = [
  { m: "Sep", p: 22, a: 2 },
  { m: "Oct", p: 20, a: 4 },
  { m: "Nov", p: 19, a: 3 },
  { m: "Dec", p: 18, a: 2 },
  { m: "Jan", p: 21, a: 1 },
  { m: "Feb", p: 20, a: 2 },
];
const GRD_D = [
  { s: "Math", g: 85 },
  { s: "Eng", g: 91 },
  { s: "Sci", g: 78 },
  { s: "His", g: 88 },
  { s: "Art", g: 95 },
];

const ini = (n) =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AttPill = ({ v }) => {
  const [c, bg] =
    v >= 85
      ? [P.green, "#D1FAE5"]
      : v >= 70
        ? [P.amber, "#FEF3C7"]
        : [P.rose, "#FEE2E2"];
  return (
    <span
      style={{
        color: c,
        background: bg,
        borderRadius: 99,
        padding: "3px 11px",
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {v}%
    </span>
  );
};
const FeePill = ({ s }) => {
  const m = {
    Paid: [P.green, "#D1FAE5"],
    Owing: [P.rose, "#FEE2E2"],
    Partial: [P.amber, "#FEF3C7"],
  };
  const [c, bg] = m[s] || ["#555", "#eee"];
  return (
    <span
      style={{
        color: c,
        background: bg,
        borderRadius: 99,
        padding: "3px 11px",
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {s}
    </span>
  );
};
const StatPill = ({ s }) => {
  const m = {
    Active: [P[600], P[100]],
    Inactive: ["#6B7280", "#F3F4F6"],
    Transferred: [P.sky, "#E0F2FE"],
  };
  const [c, bg] = m[s] || ["#555", "#eee"];
  return (
    <span
      style={{
        color: c,
        background: bg,
        borderRadius: 99,
        padding: "3px 10px",
        fontWeight: 600,
        fontSize: 11,
      }}
    >
      {s}
    </span>
  );
};
const Avatar = ({ name, size = 36, sec }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `linear-gradient(135deg,${SEC[sec] || P[500]},${P[300]})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: 800,
      fontSize: size * 0.34,
      flexShrink: 0,
      boxShadow: `0 0 0 2px #fff,0 0 0 3.5px ${(SEC[sec] || P[500]) + "55"}`,
    }}
  >
    {ini(name)}
  </div>
);

function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        justifyContent: "center",
        padding: "10px 0 2px",
      }}
    >
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          border: `1.5px solid ${P.border}`,
          background: current === 1 ? P[50] : "#fff",
          color: current === 1 ? P.muted : P[600],
          cursor: current === 1 ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
        }}
      >
        <ChevronLeft size={14} />
      </button>
      {Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: `1.5px solid ${p === current ? P[500] : P.border}`,
            background:
              p === current
                ? `linear-gradient(135deg,${P[600]},${P[400]})`
                : "#fff",
            color: p === current ? "#fff" : P.muted,
            fontWeight: p === current ? 800 : 500,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.15s",
            boxShadow: p === current ? `0 2px 8px ${P[500]}55` : "none",
            fontFamily: "inherit",
          }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          border: `1.5px solid ${P.border}`,
          background: current === total ? P[50] : "#fff",
          color: current === total ? P.muted : P[600],
          cursor: current === total ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
        }}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

const PER = 4;

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selG, setSelG] = useState("All");
  const [selS, setSelS] = useState("All");
  const [fSt, setFSt] = useState("All");
  const [fFee, setFFee] = useState("All");
  const [sCol, setSCol] = useState("name");
  const [sDir, setSDir] = useState("asc");
  const [view, setView] = useState("table");
  const [chosen, setChosen] = useState([]);
  const [activeS, setActiveS] = useState(null);
  const [tab, setTab] = useState("overview");
  const [showAdd, setShowAdd] = useState(false);
  const [step, setStep] = useState(1);
  const [delT, setDelT] = useState(null);
  const [toast, setToast] = useState(null);
  const [pgMap, setPgMap] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    owing: 0,
    lowAtt: 0,
  });
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [newSt, setNewSt] = useState({
    fn: "",
    ln: "",
    dob: "",
    gender: "Female",
    blood: "A+",
    addr: "",
    grade: 10,
    sec: "A",
    enr: "",
    parent: "",
    pPhone: "",
    pEmail: "",
  });

  const flash = (m, t = "ok") => {
    setToast({ m, t });
    setTimeout(() => setToast(null), 3000);
  };
  const setPg = (k, p) => setPgMap((prev) => ({ ...prev, [k]: p }));

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsData, statsData, gradesData] = await Promise.all([
        adminAPI.getAllStudents(),
        adminAPI.getStudentStats(),
        adminAPI.getGradesAndSections(),
      ]);

      setStudents(studentsData || []);
      setStats(statsData || { total: 0, active: 0, owing: 0, lowAtt: 0 });
      setGrades(gradesData.grades || []);
      setSections(gradesData.sections || []);
    } catch (error) {
      flash(error.message || "Failed to load students", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const allG = useMemo(() => grades, [grades]);
  const allS = useMemo(() => sections, [sections]);

  const filtered = useMemo(() => {
    let d = students.filter((s) => {
      const q = search.toLowerCase();
      return (
        (!q ||
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)) &&
        (selG === "All" || s.grade === Number(selG)) &&
        (selS === "All" || s.section === selS) &&
        (fSt === "All" || s.status === fSt) &&
        (fFee === "All" || s.fee === fFee)
      );
    });
    d.sort((a, b) => {
      let av = a[sCol],
        bv = b[sCol];
      if (typeof av === "string") {
        av = av.toLowerCase();
        bv = bv.toLowerCase();
      }
      return sDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });
    return d;
  }, [students, search, selG, selS, fSt, fFee, sCol, sDir]);

  const grouped = useMemo(() => {
    const m = {};
    filtered.forEach((s) => {
      if (!m[s.grade]) m[s.grade] = {};
      if (!m[s.grade][s.section]) m[s.grade][s.section] = [];
      m[s.grade][s.section].push(s);
    });
    return Object.entries(m).sort((a, b) => Number(a[0]) - Number(b[0]));
  }, [filtered]);

  const doSort = (col) => {
    if (sCol === col) setSDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSCol(col);
      setSDir("asc");
    }
  };
  const SI = ({ col }) =>
    sCol === col ? (
      sDir === "asc" ? (
        <ChevronUp size={12} />
      ) : (
        <ChevronDown size={12} />
      )
    ) : (
      <ArrowUpDown size={11} style={{ opacity: 0.3 }} />
    );
  const toggleOne = (id) =>
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const deleteS = async (id) => {
    try {
      await adminAPI.deleteStudent(id);
      setStudents((s) => s.filter((x) => x.id !== id));
      setDelT(null);
      if (activeS?.id === id) setActiveS(null);
      flash("Student removed successfully.");
    } catch (error) {
      flash(error.message || "Failed to delete student", "error");
    }
  };

  const submitAdd = async () => {
    try {
      const newStudent = {
        fn: newSt.fn,
        ln: newSt.ln,
        dob: newSt.dob || null,
        gender: newSt.gender,
        blood: newSt.blood,
        addr: newSt.addr,
        grade: Number(newSt.grade),
        sec: newSt.sec,
        enr: newSt.enr || new Date().toISOString().split("T")[0],
        parent: newSt.parent,
        pPhone: newSt.pPhone,
        pEmail: newSt.pEmail,
      };

      await adminAPI.createStudent(newStudent);
      setShowAdd(false);
      setStep(1);
      setNewSt({
        fn: "",
        ln: "",
        dob: "",
        gender: "Female",
        blood: "A+",
        addr: "",
        grade: 10,
        sec: "A",
        enr: "",
        parent: "",
        pPhone: "",
        pEmail: "",
      });
      flash("Student added successfully!");
      await fetchData();
    } catch (error) {
      flash(error.message || "Failed to add student", "error");
    }
  };

  const DTABS = [
    "overview",
    "academic",
    "attendance",
    "parents",
    "fees",
    "behavior",
    "documents",
    "messages",
  ];
  const inp = {
    width: "100%",
    border: `1.5px solid ${P.border}`,
    borderRadius: 10,
    padding: "9px 13px",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    background: "#FAF8FF",
    color: P.text,
  };
  const lbl = {
    fontSize: 10,
    fontWeight: 700,
    color: P.muted,
    marginBottom: 5,
    display: "block",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  };

  if (loading)
    return (
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          background: P.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Loader
            size={40}
            color={P[500]}
            style={{ animation: "spin 1s linear infinite" }}
          />
          <div style={{ color: P.text, fontWeight: 700 }}>
            Loading students...
          </div>
        </div>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        background: P.bg,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:${P.bg};}::-webkit-scrollbar-thumb{background:${P[200]};border-radius:10px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .rh:hover td{background:${P[50]}!important;}
        .ibtn:hover{background:${P[100]}!important;color:${P[600]}!important;}
        .clift:hover{box-shadow:0 10px 36px ${P[500]}22!important;transform:translateY(-2px);}
        .pt:hover{color:${P[600]}!important;}
        .chip:hover{opacity:0.88;transform:translateY(-1px);}
        .pgbtn:hover{background:${P[50]}!important;}
        @media(max-width:900px){.kpi{grid-template-columns:1fr 1fr!important;}.hmd{display:none!important;}}
        @media(max-width:600px){.kpi{grid-template-columns:1fr 1fr!important;}.pp{padding:12px 14px!important;}.tb{flex-wrap:wrap!important;}.dp{width:100vw!important;}.chips{display:none!important;}}
      `}</style>

      {/* NAV */}
      <nav
        style={{
          background: `linear-gradient(135deg,${P[900]},${P[700]})`,
          height: 58,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          justifyContent: "space-between",
          flexShrink: 0,
          boxShadow: `0 2px 20px ${P[900]}66`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <GraduationCap size={18} color="#fff" />
          </div>
          <span
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: -0.4,
            }}
          >
            EduAdmin
          </span>
          <ChevronRight size={13} color="rgba(255,255,255,0.3)" />
          <span
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Students
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button
            className="ibtn"
            onClick={() => flash("No new notifications")}
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
              padding: 8,
              borderRadius: 9,
              color: "rgba(255,255,255,0.75)",
              display: "flex",
              transition: "all 0.15s",
            }}
          >
            <Bell size={16} />
          </button>
          <button
            className="ibtn"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: "pointer",
              padding: 8,
              borderRadius: 9,
              color: "rgba(255,255,255,0.75)",
              display: "flex",
              transition: "all 0.15s",
            }}
          >
            <Settings size={16} />
          </button>
          <div
            style={{
              width: 34,
              height: 34,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 12,
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            AD
          </div>
        </div>
      </nav>

      {/* BODY */}
      <div className="pp" style={{ flex: 1, padding: "24px 28px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 22,
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: P.text,
                letterSpacing: -0.6,
              }}
            >
              Student Registry
            </h1>
            <p
              style={{
                fontSize: 13,
                color: P.muted,
                marginTop: 3,
                fontWeight: 500,
              }}
            >
              {students.length} students · Grades 6–12 · AY 2025/26
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: `linear-gradient(135deg,${P[700]},${P[400]})`,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: `0 4px 16px ${P[500]}44`,
              flexShrink: 0,
            }}
          >
            <Plus size={15} /> Add Student
          </button>
        </div>

        {/* KPI */}
        <div
          className="kpi"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 14,
            marginBottom: 22,
          }}
        >
          {[
            {
              l: "Total Enrolled",
              v: stats.total,
              ic: <Users size={18} />,
              ac: P[500],
              n: "All grades",
            },
            {
              l: "Active Students",
              v: stats.active,
              ic: <Activity size={18} />,
              ac: P.green,
              n: `${stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% rate`,
            },
            {
              l: "Fee Outstanding",
              v: stats.owing,
              ic: <DollarSign size={18} />,
              ac: P.rose,
              n: "Needs action",
            },
            {
              l: "Low Attendance",
              v: stats.lowAtt,
              ic: <AlertTriangle size={18} />,
              ac: P.amber,
              n: "Below 70%",
            },
          ].map(({ l, v, ic, ac, n }) => (
            <div
              key={l}
              className="clift"
              style={{
                background: P.card,
                borderRadius: 15,
                padding: "18px 20px",
                boxShadow: `0 1px 4px ${P[200]}`,
                transition: "all 0.2s",
                borderTop: `3px solid ${ac}`,
              }}
            >
              <div
                style={{
                  background: ac + "18",
                  padding: 9,
                  borderRadius: 10,
                  color: ac,
                  width: "fit-content",
                  marginBottom: 12,
                }}
              >
                {ic}
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: P.text,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {v}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: P.text,
                  marginBottom: 2,
                }}
              >
                {l}
              </div>
              <div style={{ fontSize: 11, color: P.muted }}>{n}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div
          className="tb"
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 14,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 180,
              display: "flex",
              alignItems: "center",
              gap: 9,
              background: P.card,
              border: `1.5px solid ${P.border}`,
              borderRadius: 12,
              padding: "9px 14px",
            }}
          >
            <Search size={14} color={P.muted} />
            <input
              style={{
                border: "none",
                outline: "none",
                fontSize: 13,
                color: P.text,
                background: "transparent",
                width: "100%",
                fontFamily: "inherit",
                fontWeight: 500,
              }}
              placeholder="Search name or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: P.muted,
                  display: "flex",
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>
          <select
            value={selG}
            onChange={(e) => setSelG(e.target.value)}
            style={{
              border: `1.5px solid ${P.border}`,
              borderRadius: 12,
              padding: "9px 13px",
              fontSize: 12,
              fontFamily: "inherit",
              background: P.card,
              color: P.text,
              outline: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <option value="All">All Classes</option>
            {allG.map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>
          <select
            value={selS}
            onChange={(e) => setSelS(e.target.value)}
            style={{
              border: `1.5px solid ${P.border}`,
              borderRadius: 12,
              padding: "9px 13px",
              fontSize: 12,
              fontFamily: "inherit",
              background: P.card,
              color: P.text,
              outline: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <option value="All">All Sections</option>
            {allS.map((s) => (
              <option key={s} value={s}>
                Section {s}
              </option>
            ))}
          </select>
          <select
            value={fSt}
            onChange={(e) => setFSt(e.target.value)}
            style={{
              border: `1.5px solid ${P.border}`,
              borderRadius: 12,
              padding: "9px 13px",
              fontSize: 12,
              fontFamily: "inherit",
              background: P.card,
              color: P.text,
              outline: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <option value="All">All Status</option>
            {["Active", "Inactive", "Transferred"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={fFee}
            onChange={(e) => setFFee(e.target.value)}
            style={{
              border: `1.5px solid ${P.border}`,
              borderRadius: 12,
              padding: "9px 13px",
              fontSize: 12,
              fontFamily: "inherit",
              background: P.card,
              color: P.text,
              outline: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <option value="All">All Fees</option>
            {["Paid", "Owing", "Partial"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={() => flash("Exporting…")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 15px",
              background: P.card,
              border: `1.5px solid ${P.border}`,
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              color: P.text,
            }}
          >
            <Download size={13} />
            <span className="hmd">Export</span>
          </button>
          <div
            style={{
              display: "flex",
              background: P.card,
              border: `1.5px solid ${P.border}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {[
              ["table", <List size={14} />],
              ["grid", <Grid size={14} />],
            ].map(([m, ic]) => (
              <button
                key={m}
                onClick={() => setView(m)}
                style={{
                  padding: "9px 12px",
                  background:
                    view === m
                      ? `linear-gradient(135deg,${P[600]},${P[400]})`
                      : "transparent",
                  color: view === m ? "#fff" : P.muted,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.15s",
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE VIEW – grouped by grade → section with per-section pagination */}
        {view === "table" &&
          (filtered.length === 0 ? (
            <div
              style={{
                background: P.card,
                borderRadius: 16,
                padding: 60,
                textAlign: "center",
                boxShadow: `0 1px 4px ${P[100]}`,
              }}
            >
              <Users size={48} color={P[200]} style={{ marginBottom: 14 }} />
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 17,
                  color: P.text,
                  marginBottom: 6,
                }}
              >
                No students found
              </div>
              <div style={{ fontSize: 13, color: P.muted }}>
                Adjust filters or search term
              </div>
            </div>
          ) : (
            grouped.map(([gKey, sections]) => (
              <div key={gKey} style={{ marginBottom: 30 }}>
                {/* Grade heading */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: `linear-gradient(135deg,${P[600]},${P[400]})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{ color: "#fff", fontWeight: 800, fontSize: 11 }}
                    >
                      G{gKey}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: P.text,
                      letterSpacing: -0.3,
                    }}
                  >
                    Grade {gKey}
                  </h2>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: `linear-gradient(to right,${P.border},transparent)`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color: P.muted,
                      fontWeight: 600,
                      background: P[100],
                      padding: "3px 10px",
                      borderRadius: 99,
                    }}
                  >
                    {Object.values(sections).flat().length} students
                  </span>
                </div>

                {/* Sections */}
                {Object.entries(sections)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([sec, sts]) => {
                    const key = `${gKey}-${sec}`;
                    const curPg = pgMap[key] || 1;
                    const totPg = Math.ceil(sts.length / PER);
                    const paged = sts.slice((curPg - 1) * PER, curPg * PER);
                    const avgAtt =
                      sts.length > 0
                        ? Math.round(
                            sts.reduce((a, s) => a + s.att, 0) / sts.length,
                          )
                        : 0;
                    return (
                      <div
                        key={sec}
                        style={{
                          background: P.card,
                          borderRadius: 16,
                          boxShadow: `0 1px 6px ${P[200]}`,
                          overflow: "hidden",
                          marginBottom: 16,
                          border: `1px solid ${P.border}`,
                        }}
                      >
                        {/* Section bar */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "11px 20px",
                            background: `linear-gradient(to right,${P[50]},${P.card})`,
                            borderBottom: `1px solid ${P.border}`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                background: SEC[sec] || P[500],
                                color: "#fff",
                                borderRadius: 8,
                                padding: "4px 12px",
                                fontSize: 11,
                                fontWeight: 800,
                                letterSpacing: 0.5,
                              }}
                            >
                              Section {sec}
                            </div>
                            <span
                              style={{
                                fontSize: 12,
                                color: P.muted,
                                fontWeight: 500,
                              }}
                            >
                              {sts.length} student{sts.length !== 1 ? "s" : ""}
                            </span>
                            {totPg > 1 && (
                              <span
                                style={{
                                  fontSize: 11,
                                  color: P[400],
                                  fontWeight: 600,
                                  background: P[100],
                                  padding: "2px 9px",
                                  borderRadius: 99,
                                }}
                              >
                                pg {curPg}/{totPg}
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span style={{ fontSize: 11, color: P.muted }}>
                              Avg att:
                            </span>
                            <AttPill v={avgAtt} />
                          </div>
                        </div>

                        {/* Table */}
                        <div style={{ overflowX: "auto" }}>
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              minWidth: 680,
                            }}
                          >
                            <thead>
                              <tr style={{ background: P[50] }}>
                                <th style={{ width: 40, padding: "10px 14px" }}>
                                  <button
                                    onClick={() => {
                                      const ids = paged.map((s) => s.id);
                                      const all = ids.every((id) =>
                                        chosen.includes(id),
                                      );
                                      setChosen((c) =>
                                        all
                                          ? c.filter((x) => !ids.includes(x))
                                          : [...new Set([...c, ...ids])],
                                      );
                                    }}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      color: P.muted,
                                      display: "flex",
                                    }}
                                  >
                                    {paged.every((s) =>
                                      chosen.includes(s.id),
                                    ) && paged.length > 0 ? (
                                      <CheckSquare size={14} color={P[500]} />
                                    ) : (
                                      <Square size={14} />
                                    )}
                                  </button>
                                </th>
                                {[
                                  ["name", "Student"],
                                  ["id", "ID"],
                                  ["gpa", "GPA"],
                                  ["gender", "Gender"],
                                  ["att", "Attendance"],
                                  ["fee", "Fee"],
                                  ["status", "Status"],
                                ].map(([col, lbl]) => (
                                  <th
                                    key={col}
                                    onClick={() => doSort(col)}
                                    style={{
                                      padding: "10px 13px",
                                      textAlign: "left",
                                      fontSize: 11,
                                      fontWeight: 700,
                                      color: P.muted,
                                      textTransform: "uppercase",
                                      letterSpacing: 0.5,
                                      cursor: "pointer",
                                      userSelect: "none",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    <span
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                      }}
                                    >
                                      {lbl}
                                      <SI col={col} />
                                    </span>
                                  </th>
                                ))}
                                <th
                                  style={{
                                    padding: "10px 13px",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: P.muted,
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                  }}
                                >
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {paged.map((stu, idx) => (
                                <tr
                                  key={stu.id}
                                  className="rh"
                                  style={{
                                    cursor: "pointer",
                                    transition: "background 0.1s",
                                    borderBottom:
                                      idx < paged.length - 1
                                        ? `1px solid ${P[50]}`
                                        : "none",
                                  }}
                                >
                                  <td
                                    style={{ padding: "12px 14px" }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => toggleOne(stu.id)}
                                      style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: chosen.includes(stu.id)
                                          ? P[500]
                                          : P[200],
                                        display: "flex",
                                      }}
                                    >
                                      {chosen.includes(stu.id) ? (
                                        <CheckSquare size={14} />
                                      ) : (
                                        <Square size={14} />
                                      )}
                                    </button>
                                  </td>
                                  <td
                                    style={{ padding: "12px 13px" }}
                                    onClick={() => {
                                      setActiveS(stu);
                                      setTab("overview");
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                      }}
                                    >
                                      <Avatar
                                        name={stu.name}
                                        sec={stu.section}
                                        size={34}
                                      />
                                      <div>
                                        <div
                                          style={{
                                            fontWeight: 700,
                                            fontSize: 13,
                                            color: P.text,
                                          }}
                                        >
                                          {stu.name}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: 11,
                                            color: P.muted,
                                            marginTop: 1,
                                          }}
                                        >
                                          {stu.parent || "—"}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      padding: "12px 13px",
                                      fontSize: 11,
                                      color: P.muted,
                                      fontWeight: 600,
                                    }}
                                    onClick={() => {
                                      setActiveS(stu);
                                      setTab("overview");
                                    }}
                                  >
                                    {stu.id}
                                  </td>
                                  <td
                                    style={{ padding: "12px 13px" }}
                                    onClick={() => {
                                      setActiveS(stu);
                                      setTab("academic");
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: 800,
                                        fontSize: 14,
                                        color:
                                          stu.gpa >= 3.5
                                            ? P.green
                                            : stu.gpa >= 2.5
                                              ? P.amber
                                              : P.rose,
                                      }}
                                    >
                                      {stu.gpa === 0
                                        ? "N/A"
                                        : stu.gpa.toFixed(1)}
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      padding: "12px 13px",
                                      fontSize: 12,
                                      color: P.muted,
                                    }}
                                    onClick={() => {
                                      setActiveS(stu);
                                      setTab("overview");
                                    }}
                                  >
                                    {stu.gender}
                                  </td>
                                  <td
                                    style={{ padding: "12px 13px" }}
                                    onClick={() => {
                                      setActiveS(stu);
                                      setTab("attendance");
                                    }}
                                  >
                                    <AttPill v={stu.att} />
                                  </td>
                                  <td
                                    style={{ padding: "12px 13px" }}
                                    onClick={() => {
                                      setActiveS(stu);
                                      setTab("fees");
                                    }}
                                  >
                                    <FeePill s={stu.fee} />
                                  </td>
                                  <td
                                    style={{ padding: "12px 13px" }}
                                    onClick={() => {
                                      setActiveS(stu);
                                      setTab("overview");
                                    }}
                                  >
                                    <StatPill s={stu.status} />
                                  </td>
                                  <td style={{ padding: "12px 13px" }}>
                                    <div style={{ display: "flex", gap: 2 }}>
                                      {[
                                        {
                                          ic: <Eye size={13} />,
                                          c: P[500],
                                          fn: () => {
                                            setActiveS(stu);
                                            setTab("overview");
                                          },
                                        },
                                        {
                                          ic: <Edit2 size={13} />,
                                          c: P.green,
                                          fn: () => flash("Edit coming soon"),
                                        },
                                        {
                                          ic: <Trash2 size={13} />,
                                          c: P.rose,
                                          fn: () => setDelT(stu),
                                        },
                                      ].map(({ ic, c, fn }, i) => (
                                        <button
                                          key={i}
                                          className="ibtn"
                                          onClick={fn}
                                          style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 7,
                                            borderRadius: 7,
                                            color: c,
                                            display: "flex",
                                            transition: "all 0.1s",
                                          }}
                                        >
                                          {ic}
                                        </button>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* PAGINATION */}
                        {totPg > 1 && (
                          <div
                            style={{
                              borderTop: `1px solid ${P.border}`,
                              padding: "8px 20px",
                              background: `linear-gradient(to right,${P[50]},${P.card})`,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 8,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 12,
                                  color: P.muted,
                                  fontWeight: 500,
                                }}
                              >
                                Showing {(curPg - 1) * PER + 1}–
                                {Math.min(curPg * PER, sts.length)} of{" "}
                                {sts.length} students in Section {sec}
                              </span>
                              <Pagination
                                current={curPg}
                                total={totPg}
                                onChange={(p) => setPg(key, p)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            ))
          ))}

        {/* GRID VIEW */}
        {view === "grid" &&
          grouped.map(([gKey, sections]) => (
            <div key={gKey} style={{ marginBottom: 26 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    background: `linear-gradient(135deg,${P[600]},${P[400]})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{ color: "#fff", fontWeight: 800, fontSize: 10 }}
                  >
                    G{gKey}
                  </span>
                </div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: P.text }}>
                  Grade {gKey}
                </h2>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: `linear-gradient(to right,${P.border},transparent)`,
                  }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(195px,1fr))",
                  gap: 13,
                }}
              >
                {Object.values(sections)
                  .flat()
                  .map((stu) => (
                    <div
                      key={stu.id}
                      className="clift"
                      onClick={() => {
                        setActiveS(stu);
                        setTab("overview");
                      }}
                      style={{
                        background: P.card,
                        borderRadius: 14,
                        padding: 18,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: `0 1px 4px ${P[100]}`,
                        border: `1px solid ${P.border}`,
                        borderTop: `3px solid ${SEC[stu.section] || P[500]}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 12,
                        }}
                      >
                        <Avatar name={stu.name} sec={stu.section} size={40} />
                        <StatPill s={stu.status} />
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 14,
                          color: P.text,
                          marginBottom: 2,
                        }}
                      >
                        {stu.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: P.muted,
                          marginBottom: 11,
                        }}
                      >
                        {stu.id} · Sec {stu.section}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <AttPill v={stu.att} />
                        <FeePill s={stu.fee} />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingTop: 8,
                          borderTop: `1px solid ${P.border}`,
                        }}
                      >
                        <span style={{ fontSize: 11, color: P.muted }}>
                          GPA
                        </span>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: 13,
                            color:
                              stu.gpa >= 3.5
                                ? P.green
                                : stu.gpa >= 2.5
                                  ? P.amber
                                  : P.rose,
                          }}
                        >
                          {stu.gpa === 0 ? "N/A" : stu.gpa.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>

      {/* DETAIL PANEL */}
      {activeS && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            background: "rgba(45,10,110,0.3)",
            backdropFilter: "blur(3px)",
            animation: "fadeIn 0.2s",
          }}
          onClick={() => setActiveS(null)}
        >
          <div
            className="dp"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: 490,
              background: P.card,
              boxShadow: `-14px 0 50px ${P[800]}22`,
              zIndex: 91,
              overflowY: "auto",
              animation: "slideIn 0.3s cubic-bezier(0.4,0,0.2,1)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg,${P[900]},${SEC[activeS.section] || P[500]})`,
                padding: "26px 22px 20px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Avatar name={activeS.name} sec={activeS.section} size={50} />
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 17,
                        color: "#fff",
                        letterSpacing: -0.3,
                      }}
                    >
                      {activeS.name}
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: 12,
                        marginTop: 3,
                      }}
                    >
                      Grade {activeS.grade} – Section {activeS.section} ·{" "}
                      {activeS.id}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveS(null)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    borderRadius: 9,
                    padding: 7,
                    cursor: "pointer",
                    color: "#fff",
                    display: "flex",
                  }}
                >
                  <X size={15} />
                </button>
              </div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                <StatPill s={activeS.status} />
                <FeePill s={activeS.fee} />
                <AttPill v={activeS.att} />
                <span
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 11,
                    padding: "3px 10px",
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 99,
                    fontWeight: 700,
                  }}
                >
                  GPA {activeS.gpa === 0 ? "N/A" : activeS.gpa.toFixed(1)}
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                borderBottom: `1px solid ${P.border}`,
                flexShrink: 0,
              }}
            >
              {DTABS.map((t) => (
                <button
                  key={t}
                  className="pt"
                  onClick={() => setTab(t)}
                  style={{
                    padding: "11px 14px",
                    fontSize: 12,
                    fontWeight: tab === t ? 700 : 500,
                    color: tab === t ? P[600] : P.muted,
                    borderBottom:
                      tab === t
                        ? `2.5px solid ${P[500]}`
                        : "2.5px solid transparent",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    background: "none",
                    border: "none",
                    borderBottomWidth: 2.5,
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                    textTransform: "capitalize",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
              {tab === "overview" && (
                <div
                  style={{ background: P[50], borderRadius: 13, padding: 16 }}
                >
                  {[
                    ["Full Name", activeS.name],
                    ["Student ID", activeS.id],
                    ["DOB", activeS.dob || "—"],
                    ["Gender", activeS.gender],
                    ["Blood", activeS.blood],
                    [
                      "Grade",
                      "Grade " +
                        activeS.grade +
                        " – Section " +
                        activeS.section,
                    ],
                    ["Enrolled", activeS.enr],
                    ["Address", activeS.addr || "—"],
                  ].map(([l, v]) => (
                    <div
                      key={l}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        borderBottom: `1px solid ${P[100]}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: P.muted,
                          fontWeight: 600,
                        }}
                      >
                        {l}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: P.text,
                          textAlign: "right",
                          maxWidth: "60%",
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {tab === "academic" && (
                <div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    {[
                      [
                        "GPA",
                        activeS.gpa === 0 ? "N/A" : activeS.gpa.toFixed(1),
                      ],
                      ["Subjects", "—"],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        style={{
                          flex: 1,
                          background: P[50],
                          borderRadius: 11,
                          padding: 13,
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 22,
                            color: P[600],
                          }}
                        >
                          {v}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: P.muted,
                            fontWeight: 600,
                            marginTop: 3,
                          }}
                        >
                          {l}
                        </div>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={GRD_D} barSize={24}>
                      <XAxis
                        dataKey="s"
                        tick={{ fontSize: 10, fontFamily: "DM Sans" }}
                      />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="g" fill={P[500]} radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              {tab === "attendance" && (
                <div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    {[
                      ["Present", Math.round(activeS.att * 1.8), P.green],
                      ["Absent", Math.round((100 - activeS.att) * 0.9), P.rose],
                      ["Late", 3, P.amber],
                    ].map(([l, v, c]) => (
                      <div
                        key={l}
                        style={{
                          flex: 1,
                          background: P[50],
                          borderRadius: 11,
                          padding: 13,
                          textAlign: "center",
                          borderTop: `3px solid ${c}`,
                        }}
                      >
                        <div
                          style={{ fontWeight: 800, fontSize: 20, color: c }}
                        >
                          {v}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: P.muted,
                            fontWeight: 600,
                            marginTop: 3,
                          }}
                        >
                          {l}
                        </div>
                      </div>
                    ))}
                  </div>
                  {activeS.att < 70 && (
                    <div
                      style={{
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: 10,
                        padding: "11px 13px",
                        marginBottom: 14,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <AlertTriangle size={14} color={P.rose} />
                      <span
                        style={{ fontSize: 12, fontWeight: 700, color: P.rose }}
                      >
                        Chronic absenteeism — action needed
                      </span>
                    </div>
                  )}
                  <ResponsiveContainer width="100%" height={140}>
                    <LineChart data={ATT_D}>
                      <XAxis dataKey="m" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="p"
                        stroke={P[500]}
                        strokeWidth={2.5}
                        dot={false}
                        name="Present"
                      />
                      <Line
                        type="monotone"
                        dataKey="a"
                        stroke={P.rose}
                        strokeWidth={1.5}
                        dot={false}
                        strokeDasharray="4 4"
                        name="Absent"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              {tab === "parents" && (
                <div>
                  <div
                    style={{
                      background: P[50],
                      borderRadius: 13,
                      padding: 16,
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 15,
                        color: P.text,
                        marginBottom: 12,
                      }}
                    >
                      {activeS.parent || "Parent/Guardian"}
                    </div>
                    {[
                      ["Relationship", "Parent/Guardian"],
                      ["Phone", activeS.pPhone || "—"],
                      ["Email", activeS.pEmail || "—"],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        style={{
                          display: "flex",
                          gap: 10,
                          padding: "9px 0",
                          borderBottom: `1px solid ${P[100]}`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            color: P.muted,
                            fontWeight: 600,
                            minWidth: 100,
                          }}
                        >
                          {l}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: P.text,
                          }}
                        >
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 9 }}>
                    {[
                      ["Call", <Phone size={13} />],
                      ["Email", <Mail size={13} />],
                    ].map(([l, ic]) => (
                      <button
                        key={l}
                        onClick={() => flash(`${l}ing…`)}
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 6,
                          padding: "10px",
                          background: P.card,
                          border: `1.5px solid ${P.border}`,
                          borderRadius: 11,
                          fontWeight: 700,
                          fontSize: 12,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          color: P.text,
                        }}
                      >
                        {ic}
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {tab === "fees" && (
                <div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                    {[
                      ["Total", "$2,400"],
                      [
                        "Paid",
                        activeS.fee === "Paid"
                          ? "$2,400"
                          : activeS.fee === "Partial"
                            ? "$1,200"
                            : "$0",
                      ],
                      [
                        "Balance",
                        activeS.fee === "Paid"
                          ? "$0"
                          : activeS.fee === "Partial"
                            ? "$1,200"
                            : "$2,400",
                      ],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        style={{
                          flex: 1,
                          background: P[50],
                          borderRadius: 11,
                          padding: 13,
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 18,
                            color: P.text,
                          }}
                        >
                          {v}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: P.muted,
                            fontWeight: 600,
                            marginTop: 3,
                          }}
                        >
                          {l}
                        </div>
                      </div>
                    ))}
                  </div>
                  {[
                    ["Term 1", "Sep 2025", "$800", "Paid"],
                    [
                      "Term 2",
                      "Jan 2026",
                      "$800",
                      activeS.fee === "Owing" ? "Owing" : "Paid",
                    ],
                    ["Term 3", "Apr 2026", "$800", "Partial"],
                  ].map(([l, d, a, st]) => (
                    <div
                      key={l}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "11px 0",
                        borderBottom: `1px solid ${P[100]}`,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: P.text,
                          }}
                        >
                          {l} Fee
                        </div>
                        <div
                          style={{ fontSize: 11, color: P.muted, marginTop: 2 }}
                        >
                          {d}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 13,
                            color: P.text,
                            marginBottom: 4,
                          }}
                        >
                          {a}
                        </div>
                        <FeePill s={st} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tab === "behavior" && (
                <div style={{ textAlign: "center", padding: 44 }}>
                  <Shield
                    size={40}
                    color={P[200]}
                    style={{ marginBottom: 12 }}
                  />
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: P.text,
                      marginBottom: 5,
                    }}
                  >
                    Clean record
                  </div>
                  <div style={{ fontSize: 12, color: P.muted }}>
                    No incidents logged
                  </div>
                </div>
              )}
              {tab === "documents" && (
                <div>
                  {[
                    ["Birth Certificate", "PDF · Jan 2024"],
                    ["Transcript 2025", "PDF · Sep 2025"],
                    ["Medical Records", "PDF · Sep 2024"],
                  ].map(([name, meta]) => (
                    <div
                      key={name}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 0",
                        borderBottom: `1px solid ${P[100]}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 11,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            background: P[100],
                            borderRadius: 9,
                            padding: 9,
                          }}
                        >
                          <FileText size={15} color={P[500]} />
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 13,
                              color: P.text,
                            }}
                          >
                            {name}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: P.muted,
                              marginTop: 2,
                            }}
                          >
                            {meta}
                          </div>
                        </div>
                      </div>
                      <button
                        className="ibtn"
                        onClick={() => flash("Downloading…")}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 7,
                          borderRadius: 7,
                          color: P[500],
                          display: "flex",
                        }}
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => flash("Upload coming soon")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "9px 14px",
                      background: P.card,
                      border: `1.5px dashed ${P[200]}`,
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      color: P.muted,
                      marginTop: 14,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Upload size={12} />
                    Upload Document
                  </button>
                </div>
              )}
              {tab === "messages" && (
                <div>
                  <div
                    style={{
                      background: P[50],
                      borderRadius: 12,
                      padding: 14,
                      marginBottom: 14,
                      minHeight: 160,
                    }}
                  >
                    <div style={{ display: "flex", gap: 9, marginBottom: 11 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: `linear-gradient(135deg,${P[700]},${P[400]})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 800,
                          fontSize: 10,
                          flexShrink: 0,
                        }}
                      >
                        AD
                      </div>
                      <div
                        style={{
                          background: `linear-gradient(135deg,${P[700]},${P[500]})`,
                          color: "#fff",
                          borderRadius: "11px 11px 11px 3px",
                          padding: "9px 12px",
                          fontSize: 12,
                          maxWidth: "75%",
                          lineHeight: 1.5,
                        }}
                      >
                        Hello {activeS.parent || "Parent"}, checking in on{" "}
                        {activeS.name}'s progress.
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 9,
                        justifyContent: "flex-end",
                      }}
                    >
                      <div
                        style={{
                          background: "#fff",
                          border: `1px solid ${P.border}`,
                          borderRadius: "11px 11px 3px 11px",
                          padding: "9px 12px",
                          fontSize: 12,
                          maxWidth: "75%",
                          color: P.text,
                          lineHeight: 1.5,
                        }}
                      >
                        Thank you! We'll ensure better attendance.
                      </div>
                      <Avatar
                        name={activeS.parent || "Parent"}
                        sec={activeS.section}
                        size={28}
                      />
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", gap: 9, alignItems: "center" }}
                  >
                    <input
                      style={{ ...inp, flex: 1 }}
                      placeholder="Write a message…"
                    />
                    <button
                      onClick={() => flash("Message sent!")}
                      style={{
                        background: `linear-gradient(135deg,${P[700]},${P[500]})`,
                        border: "none",
                        borderRadius: 11,
                        padding: "10px 13px",
                        cursor: "pointer",
                        color: "#fff",
                        display: "flex",
                        boxShadow: `0 2px 8px ${P[500]}44`,
                      }}
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(45,10,110,0.45)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backdropFilter: "blur(5px)",
          }}
          onClick={() => setShowAdd(false)}
        >
          <div
            style={{
              background: P.card,
              borderRadius: 18,
              width: "100%",
              maxWidth: 520,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: `0 25px 80px ${P[900]}44`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "20px 24px",
                background: `linear-gradient(135deg,${P[900]},${P[600]})`,
                borderRadius: "18px 18px 0 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>
                  Add New Student
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.55)",
                    marginTop: 2,
                  }}
                >
                  Step {step}/4 ·{" "}
                  {
                    ["Personal Info", "Academic", "Guardian", "Review"][
                      step - 1
                    ]
                  }
                </div>
              </div>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 9,
                  padding: 7,
                  cursor: "pointer",
                  color: "#fff",
                  display: "flex",
                }}
              >
                <X size={15} />
              </button>
            </div>
            <div style={{ padding: "16px 24px 0", display: "flex", gap: 6 }}>
              {["Personal", "Academic", "Guardian", "Review"].map((l, i) => (
                <div key={l} style={{ flex: 1, textAlign: "center" }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background:
                        step > i + 1
                          ? P.green
                          : step === i + 1
                            ? P[600]
                            : P[100],
                      color: step >= i + 1 ? "#fff" : P.muted,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 4px",
                      fontWeight: 800,
                      fontSize: 10,
                      transition: "all 0.2s",
                    }}
                  >
                    {step > i + 1 ? <Check size={12} /> : i + 1}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: step === i + 1 ? 700 : 500,
                      color: step === i + 1 ? P[600] : P.muted,
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 24 }}>
              {step === 1 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 13,
                  }}
                >
                  {[
                    ["fn", "First Name", "text"],
                    ["ln", "Last Name", "text"],
                  ].map(([k, l, t]) => (
                    <div key={k}>
                      <label style={lbl}>{l}</label>
                      <input
                        style={inp}
                        type={t}
                        value={newSt[k]}
                        onChange={(e) =>
                          setNewSt((p) => ({ ...p, [k]: e.target.value }))
                        }
                      />
                    </div>
                  ))}
                  {[
                    ["gender", "Gender", ["Female", "Male", "Other"]],
                    [
                      "blood",
                      "Blood Group",
                      ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
                    ],
                  ].map(([k, l, opts]) => (
                    <div key={k}>
                      <label style={lbl}>{l}</label>
                      <select
                        style={inp}
                        value={newSt[k]}
                        onChange={(e) =>
                          setNewSt((p) => ({ ...p, [k]: e.target.value }))
                        }
                      >
                        {opts.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  {[
                    ["dob", "Date of Birth", "date"],
                    ["addr", "Address", "text"],
                  ].map(([k, l, t]) => (
                    <div key={k} style={{ gridColumn: "span 2" }}>
                      <label style={lbl}>{l}</label>
                      <input
                        style={inp}
                        type={t}
                        value={newSt[k]}
                        onChange={(e) =>
                          setNewSt((p) => ({ ...p, [k]: e.target.value }))
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
              {step === 2 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 13,
                  }}
                >
                  <div>
                    <label style={lbl}>Class</label>
                    <select
                      style={inp}
                      value={newSt.grade}
                      onChange={(e) =>
                        setNewSt((p) => ({ ...p, grade: e.target.value }))
                      }
                    >
                      {[1, 2, 3, 4, 5, 6].map((g) => (
                        <option key={g} value={g}>
                          Form {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Section</label>
                    <select
                      style={inp}
                      value={newSt.sec}
                      onChange={(e) =>
                        setNewSt((p) => ({ ...p, sec: e.target.value }))
                      }
                    >
                      {["A", "B", "C", "D"].map((s) => (
                        <option key={s} value={s}>
                          Section {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={lbl}>Enrollment Date</label>
                    <input
                      type="date"
                      style={inp}
                      value={newSt.enr}
                      onChange={(e) =>
                        setNewSt((p) => ({ ...p, enr: e.target.value }))
                      }
                    />
                  </div>
                </div>
              )}
              {step === 3 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 13,
                  }}
                >
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={lbl}>Guardian Name</label>
                    <input
                      style={inp}
                      value={newSt.parent}
                      onChange={(e) =>
                        setNewSt((p) => ({ ...p, parent: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label style={lbl}>Phone</label>
                    <input
                      type="tel"
                      style={inp}
                      value={newSt.pPhone}
                      onChange={(e) =>
                        setNewSt((p) => ({ ...p, pPhone: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label style={lbl}>Email</label>
                    <input
                      type="email"
                      style={inp}
                      value={newSt.pEmail}
                      onChange={(e) =>
                        setNewSt((p) => ({ ...p, pEmail: e.target.value }))
                      }
                    />
                  </div>
                </div>
              )}
              {step === 4 && (
                <div
                  style={{ background: P[50], borderRadius: 13, padding: 16 }}
                >
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 14,
                      color: P.text,
                      marginBottom: 12,
                    }}
                  >
                    Confirm Details
                  </div>
                  {[
                    ["Name", `${newSt.fn} ${newSt.ln}`],
                    ["DOB", newSt.dob || "—"],
                    ["Gender", newSt.gender],
                    ["Grade", `Grade ${newSt.grade} – Section ${newSt.sec}`],
                    ["Guardian", newSt.parent || "—"],
                    ["Phone", newSt.pPhone || "—"],
                    ["Email", newSt.pEmail || "—"],
                  ].map(([l, v]) => (
                    <div
                      key={l}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom: `1px solid ${P[100]}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: P.muted,
                          fontWeight: 600,
                        }}
                      >
                        {l}
                      </span>
                      <span
                        style={{ fontSize: 12, fontWeight: 700, color: P.text }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  gap: 9,
                  justifyContent: "flex-end",
                  marginTop: 20,
                }}
              >
                {step > 1 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    style={{
                      padding: "9px 18px",
                      background: P.card,
                      border: `1.5px solid ${P.border}`,
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      color: P.text,
                    }}
                  >
                    Back
                  </button>
                )}
                {step < 4 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    style={{
                      padding: "9px 18px",
                      background: `linear-gradient(135deg,${P[700]},${P[500]})`,
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      boxShadow: `0 3px 10px ${P[500]}44`,
                    }}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={submitAdd}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "9px 18px",
                      background: `linear-gradient(135deg,${P.green},#10b981)`,
                      color: "#fff",
                      border: "none",
                      borderRadius: 10,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <Check size={13} />
                    Add Student
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {delT && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(45,10,110,0.45)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backdropFilter: "blur(5px)",
          }}
          onClick={() => setDelT(null)}
        >
          <div
            style={{
              background: P.card,
              borderRadius: 18,
              padding: 28,
              width: "100%",
              maxWidth: 380,
              boxShadow: `0 25px 80px ${P[900]}44`,
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 52,
                height: 52,
                background: "#fef2f2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              <Trash2 size={22} color={P.rose} />
            </div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 16,
                color: P.text,
                marginBottom: 8,
              }}
            >
              Remove Student?
            </div>
            <div
              style={{
                fontSize: 13,
                color: P.muted,
                lineHeight: 1.6,
                marginBottom: 22,
              }}
            >
              Remove <strong style={{ color: P.text }}>{delT.name}</strong>?
              This cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 9 }}>
              <button
                onClick={() => setDelT(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: P.card,
                  border: `1.5px solid ${P.border}`,
                  borderRadius: 11,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  color: P.text,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteS(delT.id)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: P.rose,
                  color: "#fff",
                  border: "none",
                  borderRadius: 11,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background:
              toast.t === "ok"
                ? `linear-gradient(135deg,${P[700]},${P[500]})`
                : `linear-gradient(135deg,${P.rose},#f97316)`,
            color: "#fff",
            borderRadius: 12,
            padding: "13px 20px",
            fontWeight: 600,
            fontSize: 13,
            zIndex: 999,
            boxShadow: `0 8px 30px ${P[500]}44`,
            display: "flex",
            alignItems: "center",
            gap: 9,
            animation: "fadeUp 0.3s ease",
          }}
        >
          {toast.t === "ok" ? <Check size={15} /> : <AlertTriangle size={15} />}
          {toast.m}
        </div>
      )}
    </div>
  );
}
