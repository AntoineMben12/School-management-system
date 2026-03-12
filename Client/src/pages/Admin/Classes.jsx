import { useState, useMemo, useEffect } from "react";
import {
  Search, Plus, Download, Eye, Edit2, Trash2,
  ChevronUp, ChevronDown, X, Check, AlertTriangle,
  Users, GraduationCap, Book, Bell, Settings, Grid, List,
  Loader, ArrowUpDown, CheckSquare, Square, ChevronRight, ChevronLeft
} from "lucide-react";
import { adminAPI } from "../../services/api";

// Palette
const P = {
  900:"#2D0A6E",800:"#3B0F8A",700:"#4C1DA8",600:"#5B21B6",
  500:"#7C3AED",400:"#8B5CF6",300:"#A78BFA",200:"#C4B5FD",100:"#EDE9FE",50:"#F5F3FF",
  green:"#059669",amber:"#D97706",rose:"#F43F5E",sky:"#0284C7",
  bg:"#F3F0FB",card:"#FFFFFF",text:"#1A0E3A",muted:"#6B5B9A",border:"#E4DCFA"
};

const GradeColor = {
  6: "#8B5CF6", 7: "#7C3AED", 8: "#6D28D9", 9: "#5B21B6",
  10: "#4C1DA8", 11: "#3B0F8A", 12: "#2D0A6E"
};

const SectionColor = {
  A: "#10B981", B: "#0EA5E9", C: "#F59E0B", D: "#EF4444"
};

function Pagination({current,total,onChange}){
  if(total<=1)return null;
  return(
    <div style={{display:"flex",alignItems:"center",gap:5,justifyContent:"center",padding:"10px 0 2px"}}>
      <button onClick={()=>onChange(current-1)} disabled={current===1}
        style={{width:30,height:30,borderRadius:8,border:`1.5px solid ${P.border}`,background:current===1?P[50]:"#fff",color:current===1?P.muted:P[600],cursor:current===1?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
        <ChevronLeft size={14}/>
      </button>
      {Array.from({length:Math.min(total, 5)},(_,i)=>i+1).map(p=>(
        <button key={p} onClick={()=>onChange(p)}
          style={{width:30,height:30,borderRadius:8,border:`1.5px solid ${p===current?P[500]:P.border}`,background:p===current?`linear-gradient(135deg,${P[600]},${P[400]})`:"#fff",color:p===current?"#fff":P.muted,fontWeight:p===current?800:500,fontSize:13,cursor:"pointer",transition:"all 0.15s",boxShadow:p===current?`0 2px 8px ${P[500]}55`:"none",fontFamily:"inherit"}}>
          {p}
        </button>
      ))}
      <button onClick={()=>onChange(current+1)} disabled={current===total}
        style={{width:30,height:30,borderRadius:8,border:`1.5px solid ${P.border}`,background:current===total?P[50]:"#fff",color:current===total?P.muted:P[600],cursor:current===total?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
        <ChevronRight size={14}/>
      </button>
    </div>
  );
}

const PER=8;

export default function AdminClasses(){
  const [classes,setClasses]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [selG,setSelG]=useState("All");
  const [sCol,setSCol]=useState("grade");
  const [sDir,setSDir]=useState("asc");
  const [view,setView]=useState("table");
  const [chosen,setChosen]=useState([]);
  const [activeC,setActiveC]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [delT,setDelT]=useState(null);
  const [toast,setToast]=useState(null);
  const [currentPage,setCurrentPage]=useState(1);
  const [stats,setStats]=useState({total:0,avgStudents:0,totalStudents:0});
  const [grades,setGrades]=useState([]);
  const [newCl,setNewCl]=useState({name:"",grade:6,section:"A",teacher:""});

  const flash=(m,t="ok")=>{setToast({m,t});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    fetchData();
  },[]);

  const fetchData=async ()=>{
    setLoading(true);
    try {
      const classesData = await adminAPI.getAllClasses();
      setClasses(classesData || []);

      // Extract unique grades
      const uniqueGrades = [...new Set(classesData?.map(c => c.grade) || [])].sort((a,b) => a-b);
      setGrades(uniqueGrades);

      // Calculate stats
      const total = classesData?.length || 0;
      const totalStudents = classesData?.reduce((sum, c) => sum + (c.student_count || 0), 0) || 0;
      setStats({
        total,
        avgStudents: total > 0 ? Math.round(totalStudents / total) : 0,
        totalStudents
      });
    } catch (error) {
      flash(error.message || "Failed to load classes", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered=useMemo(()=>{
    let d=classes.filter(c=>{
      const q=search.toLowerCase();
      return(!q||c.name.toLowerCase().includes(q))
        &&(selG==="All"||c.grade===Number(selG));
    });
    d.sort((a,b)=>{let av=a[sCol],bv=b[sCol];if(typeof av==="string"){av=av.toLowerCase();bv=bv.toLowerCase();}return sDir==="asc"?(av>bv?1:-1):(av<bv?1:-1);});
    return d;
  },[classes,search,selG,sCol,sDir]);

  const totalPages=Math.ceil(filtered.length/PER);
  const paged=filtered.slice((currentPage-1)*PER,currentPage*PER);

  const doSort=col=>{if(sCol===col)setSDir(d=>d==="asc"?"desc":"asc");else{setSCol(col);setSDir("asc");}};
  const SI=({col})=>sCol===col?(sDir==="asc"?<ChevronUp size={12}/>:<ChevronDown size={12}/>):<ArrowUpDown size={11} style={{opacity:0.3}}/>;
  const toggleOne=id=>setChosen(c=>c.includes(id)?c.filter(x=>x!==id):[...c,id]);

  const deleteC=async (id)=>{
    try {
      await adminAPI.deleteClass(id);
      setClasses(c=>c.filter(x=>x.id!==id));
      setDelT(null);
      if(activeC?.id===id)setActiveC(null);
      flash("Class removed successfully.");
    } catch (error) {
      flash(error.message || "Failed to delete class", "error");
    }
  };

  const submitAdd=async ()=>{
    if(!newCl.name.trim()){
      flash("Class name is required", "error");
      return;
    }
    try {
      const classData = {
        name: newCl.name,
        grade: Number(newCl.grade),
        section: newCl.section,
        class_teacher_id: newCl.teacher || null
      };

      await adminAPI.createClass(classData);
      setShowAdd(false);
      setNewCl({name:"",grade:6,section:"A",teacher:""});
      flash("Class added successfully!");
      await fetchData();
    } catch (error) {
      flash(error.message || "Failed to add class", "error");
    }
  };

  const inp={width:"100%",border:`1.5px solid ${P.border}`,borderRadius:10,padding:"9px 13px",fontSize:13,fontFamily:"inherit",outline:"none",background:"#FAF8FF",color:P.text};
  const lbl={fontSize:10,fontWeight:700,color:P.muted,marginBottom:5,display:"block",textTransform:"uppercase",letterSpacing:0.5};

  if(loading) return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:P.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
        <Loader size={40} color={P[500]} style={{animation:"spin 1s linear infinite"}}/>
        <div style={{color:P.text,fontWeight:700}}>Loading classes...</div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:P.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:${P.bg};}::-webkit-scrollbar-thumb{background:${P[200]};border-radius:10px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .rh:hover td{background:${P[50]}!important;}
        .ibtn:hover{background:${P[100]}!important;color:${P[600]}!important;}
        .clift:hover{box-shadow:0 10px 36px ${P[500]}22!important;transform:translateY(-2px);}
        @media(max-width:900px){.kpi{grid-template-columns:1fr 1fr!important;}.hmd{display:none!important;}}
        @media(max-width:600px){.kpi{grid-template-columns:1fr!important;}.pp{padding:12px 14px!important;}.tb{flex-wrap:wrap!important;}}
      `}</style>

      {/* NAV */}
      <nav style={{background:`linear-gradient(135deg,${P[900]},${P[700]})`,height:58,display:"flex",alignItems:"center",padding:"0 24px",justifyContent:"space-between",flexShrink:0,boxShadow:`0 2px 20px ${P[900]}66`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,background:"rgba(255,255,255,0.18)",backdropFilter:"blur(8px)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid rgba(255,255,255,0.25)"}}>
            <GraduationCap size={18} color="#fff"/>
          </div>
          <span style={{color:"#fff",fontWeight:800,fontSize:15,letterSpacing:-0.4}}>EduAdmin</span>
          <ChevronRight size={13} color="rgba(255,255,255,0.3)"/>
          <span style={{color:"rgba(255,255,255,0.65)",fontSize:13,fontWeight:500}}>Classes</span>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <button className="ibtn" onClick={()=>flash("No new notifications")} style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.15)",cursor:"pointer",padding:8,borderRadius:9,color:"rgba(255,255,255,0.75)",display:"flex",transition:"all 0.15s"}}><Bell size={16}/></button>
          <button className="ibtn" style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.15)",cursor:"pointer",padding:8,borderRadius:9,color:"rgba(255,255,255,0.75)",display:"flex",transition:"all 0.15s"}}><Settings size={16}/></button>
          <div style={{width:34,height:34,background:"rgba(255,255,255,0.2)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12,cursor:"pointer",border:"1px solid rgba(255,255,255,0.3)"}}>AD</div>
        </div>
      </nav>

      {/* BODY */}
      <div className="pp" style={{flex:1,padding:"24px 28px"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:22,gap:12,flexWrap:"wrap"}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,color:P.text,letterSpacing:-0.6}}>Classes Management</h1>
            <p style={{fontSize:13,color:P.muted,marginTop:3,fontWeight:500}}>{classes.length} classes · {stats.totalStudents} total students</p>
          </div>
          <button onClick={()=>setShowAdd(true)} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 20px",background:`linear-gradient(135deg,${P[700]},${P[400]})`,color:"#fff",border:"none",borderRadius:12,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 16px ${P[500]}44`,flexShrink:0}}>
            <Plus size={15}/> Add Class
          </button>
        </div>

        {/* KPI */}
        <div className="kpi" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
          {[{l:"Total Classes",v:stats.total,ic:<Book size={18}/>,ac:P[500],n:"All grades"},{l:"Total Students",v:stats.totalStudents,ic:<Users size={18}/>,ac:P.green,n:`Across all classes`},{l:"Avg Per Class",v:stats.avgStudents,ic:<GraduationCap size={18}/>,ac:P.amber,n:"Students per class"}].map(({l,v,ic,ac,n})=>(
            <div key={l} className="clift" style={{background:P.card,borderRadius:15,padding:"18px 20px",boxShadow:`0 1px 4px ${P[200]}`,transition:"all 0.2s",borderTop:`3px solid ${ac}`}}>
              <div style={{background:ac+"18",padding:9,borderRadius:10,color:ac,width:"fit-content",marginBottom:12}}>{ic}</div>
              <div style={{fontSize:30,fontWeight:800,color:P.text,lineHeight:1,marginBottom:4}}>{v}</div>
              <div style={{fontSize:13,fontWeight:700,color:P.text,marginBottom:2}}>{l}</div>
              <div style={{fontSize:11,color:P.muted}}>{n}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="tb" style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:180,display:"flex",alignItems:"center",gap:9,background:P.card,border:`1.5px solid ${P.border}`,borderRadius:12,padding:"9px 14px"}}>
            <Search size={14} color={P.muted}/>
            <input style={{border:"none",outline:"none",fontSize:13,color:P.text,background:"transparent",width:"100%",fontFamily:"inherit",fontWeight:500}} placeholder="Search class name…" value={search} onChange={e=>setSearch(e.target.value)}/>
            {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:P.muted,display:"flex"}}><X size={12}/></button>}
          </div>
          <select value={selG} onChange={e=>setSelG(e.target.value)} style={{border:`1.5px solid ${P.border}`,borderRadius:12,padding:"9px 13px",fontSize:12,fontFamily:"inherit",background:P.card,color:P.text,outline:"none",fontWeight:600,cursor:"pointer"}}>
            <option value="All">All Grades</option>
            {grades.map(g=><option key={g} value={g}>Grade {g}</option>)}
          </select>
          <button onClick={()=>flash("Exporting…")} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 15px",background:P.card,border:`1.5px solid ${P.border}`,borderRadius:12,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",color:P.text}}><Download size={13}/><span className="hmd">Export</span></button>
          <div style={{display:"flex",background:P.card,border:`1.5px solid ${P.border}`,borderRadius:12,overflow:"hidden"}}>
            {[["table",<List size={14}/>],["grid",<Grid size={14}/>]].map(([m,ic])=>(
              <button key={m} onClick={()=>setView(m)} style={{padding:"9px 12px",background:view===m?`linear-gradient(135deg,${P[600]},${P[400]})`:"transparent",color:view===m?"#fff":P.muted,border:"none",cursor:"pointer",display:"flex",alignItems:"center",transition:"all 0.15s"}}>{ic}</button>
            ))}
          </div>
        </div>

        {/* TABLE VIEW */}
        {view==="table"&&(
          filtered.length===0
            ?<div style={{background:P.card,borderRadius:16,padding:60,textAlign:"center",boxShadow:`0 1px 4px ${P[100]}`}}>
               <Book size={48} color={P[200]} style={{marginBottom:14}}/>
               <div style={{fontWeight:800,fontSize:17,color:P.text,marginBottom:6}}>No classes found</div>
               <div style={{fontSize:13,color:P.muted}}>Adjust filters or create a new class</div>
             </div>
            :<div style={{background:P.card,borderRadius:16,boxShadow:`0 1px 6px ${P[200]}`,overflow:"hidden",border:`1px solid ${P.border}`}}>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
                  <thead>
                    <tr style={{background:P[50]}}>
                      <th style={{width:40,padding:"10px 14px"}}>
                        <button onClick={()=>{const ids=paged.map(c=>c.id);const all=ids.every(id=>chosen.includes(id));setChosen(c=>all?c.filter(x=>!ids.includes(x)):[...new Set([...c,...ids])]);}} style={{background:"none",border:"none",cursor:"pointer",color:P.muted,display:"flex"}}>
                          {paged.every(c=>chosen.includes(c.id))&&paged.length>0?<CheckSquare size={14} color={P[500]}/>:<Square size={14}/>}
                        </button>
                      </th>
                      {[["name","Class Name"],["grade","Grade"],["section","Section"],["student_count","Students"]].map(([col,lbl])=>(
                        <th key={col} onClick={()=>doSort(col)} style={{padding:"10px 13px",textAlign:"left",fontSize:11,fontWeight:700,color:P.muted,textTransform:"uppercase",letterSpacing:0.5,cursor:"pointer",userSelect:"none",whiteSpace:"nowrap"}}>
                          <span style={{display:"flex",alignItems:"center",gap:4}}>{lbl}<SI col={col}/></span>
                        </th>
                      ))}
                      <th style={{padding:"10px 13px",fontSize:11,fontWeight:700,color:P.muted,textTransform:"uppercase",letterSpacing:0.5}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((cls,idx)=>(
                      <tr key={cls.id} className="rh" style={{cursor:"pointer",transition:"background 0.1s",borderBottom:idx<paged.length-1?`1px solid ${P[50]}`:"none"}}>
                        <td style={{padding:"12px 14px"}} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>toggleOne(cls.id)} style={{background:"none",border:"none",cursor:"pointer",color:chosen.includes(cls.id)?P[500]:P[200],display:"flex"}}>
                            {chosen.includes(cls.id)?<CheckSquare size={14}/>:<Square size={14}/>}
                          </button>
                        </td>
                        <td style={{padding:"12px 13px"}} onClick={()=>setActiveC(cls)}>
                          <div style={{fontWeight:700,fontSize:13,color:P.text}}>{cls.name}</div>
                        </td>
                        <td style={{padding:"12px 13px"}} onClick={()=>setActiveC(cls)}>
                          <span style={{background:GradeColor[cls.grade]||P[500],color:"#fff",borderRadius:99,padding:"3px 11px",fontWeight:700,fontSize:12}}>Grade {cls.grade}</span>
                        </td>
                        <td style={{padding:"12px 13px"}} onClick={()=>setActiveC(cls)}>
                          <span style={{background:SectionColor[cls.section]||P[500],color:"#fff",borderRadius:99,padding:"3px 11px",fontWeight:700,fontSize:12}}>Section {cls.section}</span>
                        </td>
                        <td style={{padding:"12px 13px",fontSize:12,color:P.muted,fontWeight:600}} onClick={()=>setActiveC(cls)}>{cls.student_count || 0}</td>
                        <td style={{padding:"12px 13px"}}>
                          <div style={{display:"flex",gap:2}}>
                            {[{ic:<Eye size={13}/>,c:P[500],fn:()=>setActiveC(cls)},{ic:<Edit2 size={13}/>,c:P.green,fn:()=>flash("Edit coming soon")},{ic:<Trash2 size={13}/>,c:P.rose,fn:()=>setDelT(cls)}].map(({ic,c,fn},i)=>(
                              <button key={i} className="ibtn" onClick={fn} style={{background:"none",border:"none",cursor:"pointer",padding:7,borderRadius:7,color:c,display:"flex",transition:"all 0.1s"}}>{ic}</button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {totalPages>1&&(
                <div style={{borderTop:`1px solid ${P.border}`,padding:"8px 20px",background:`linear-gradient(to right,${P[50]},${P.card})`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                    <span style={{fontSize:12,color:P.muted,fontWeight:500}}>
                      Showing {(currentPage-1)*PER+1}–{Math.min(currentPage*PER,filtered.length)} of {filtered.length} classes
                    </span>
                    <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage}/>
                  </div>
                </div>
              )}
            </div>
        )}

        {/* GRID VIEW */}
        {view==="grid"&&(
          filtered.length===0
            ?<div style={{background:P.card,borderRadius:16,padding:60,textAlign:"center",boxShadow:`0 1px 4px ${P[100]}`}}>
               <Book size={48} color={P[200]} style={{marginBottom:14}}/>
               <div style={{fontWeight:800,fontSize:17,color:P.text,marginBottom:6}}>No classes found</div>
             </div>
            :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:13}}>
              {paged.map(cls=>(
                <div key={cls.id} className="clift" onClick={()=>setActiveC(cls)} style={{background:P.card,borderRadius:14,padding:18,cursor:"pointer",transition:"all 0.2s",boxShadow:`0 1px 4px ${P[100]}`,border:`1px solid ${P.border}`,borderTop:`4px solid ${GradeColor[cls.grade]||P[500]}`}}>
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    <span style={{background:GradeColor[cls.grade]||P[500],color:"#fff",borderRadius:99,padding:"4px 12px",fontSize:11,fontWeight:800}}>G{cls.grade}</span>
                    <span style={{background:SectionColor[cls.section]||P[500],color:"#fff",borderRadius:99,padding:"4px 12px",fontSize:11,fontWeight:800}}>S{cls.section}</span>
                  </div>
                  <div style={{fontWeight:800,fontSize:15,color:P.text,marginBottom:4}}>{cls.name}</div>
                  <div style={{fontSize:12,color:P.muted,marginBottom:12}}>{cls.student_count || 0} students</div>
                  <div style={{display:"flex",gap:6,paddingTop:12,borderTop:`1px solid ${P.border}`}}>
                    <button onClick={(e)=>{e.stopPropagation();setActiveC(cls)}} className="ibtn" style={{flex:1,background:P[50],border:`1.5px solid ${P.border}`,borderRadius:8,padding:7,cursor:"pointer",color:P[500],display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.1s",fontSize:12,fontWeight:600}}><Eye size={12}/></button>
                    <button onClick={(e)=>{e.stopPropagation();flash("Edit coming soon")}} className="ibtn" style={{flex:1,background:P[50],border:`1.5px solid ${P.border}`,borderRadius:8,padding:7,cursor:"pointer",color:P.green,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.1s",fontSize:12,fontWeight:600}}><Edit2 size={12}/></button>
                    <button onClick={(e)=>{e.stopPropagation();setDelT(cls)}} className="ibtn" style={{flex:1,background:P[50],border:`1.5px solid ${P.border}`,borderRadius:8,padding:7,cursor:"pointer",color:P.rose,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.1s",fontSize:12,fontWeight:600}}><Trash2 size={12}/></button>
                  </div>
                </div>
              ))}
            </div>
        )}
      </div>

      {/* DETAIL PANEL */}
      {activeC&&(
        <div style={{position:"fixed",inset:0,zIndex:90,background:"rgba(45,10,110,0.3)",backdropFilter:"blur(3px)",animation:"fadeIn 0.2s"}} onClick={()=>setActiveC(null)}>
          <div onClick={e=>e.stopPropagation()} style={{position:"fixed",top:0,right:0,height:"100vh",width:420,background:P.card,boxShadow:`-14px 0 50px ${P[800]}22`,zIndex:91,overflowY:"auto",animation:"slideIn 0.3s cubic-bezier(0.4,0,0.2,1)",display:"flex",flexDirection:"column"}}>
            <div style={{background:`linear-gradient(135deg,${GradeColor[activeC.grade]||P[500]},${SectionColor[activeC.section]||P[400]})`,padding:"26px 22px 20px",flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                <div>
                  <div style={{fontWeight:800,fontSize:20,color:"#fff",letterSpacing:-0.3}}>{activeC.name}</div>
                  <div style={{color:"rgba(255,255,255,0.7)",fontSize:13,marginTop:3}}>Grade {activeC.grade} • Section {activeC.section}</div>
                </div>
                <button onClick={()=>setActiveC(null)} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:9,padding:7,cursor:"pointer",color:"#fff",display:"flex"}}><X size={15}/></button>
              </div>
              <div style={{display:"flex",gap:8}}>
                <div style={{flex:1,background:"rgba(255,255,255,0.2)",borderRadius:11,padding:12,textAlign:"center"}}>
                  <div style={{fontWeight:800,fontSize:20,color:"#fff"}}>{activeC.student_count || 0}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.8)",marginTop:3}}>Students</div>
                </div>
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:22}}>
              <div style={{background:P[50],borderRadius:13,padding:16}}>
                <div style={{fontWeight:700,fontSize:14,color:P.text,marginBottom:14}}>Class Details</div>
                {[["Class Name",activeC.name],["Grade Level",`Grade ${activeC.grade}`],["Section",activeC.section],["Total Students",activeC.student_count || "0"],["Class ID",activeC.id]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:`1px solid ${P[100]}`}}><span style={{fontSize:12,color:P.muted,fontWeight:600}}>{l}</span><span style={{fontSize:13,fontWeight:700,color:P.text}}>{v}</span></div>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAdd&&(
        <div style={{position:"fixed",inset:0,background:"rgba(45,10,110,0.45)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(5px)"}} onClick={()=>setShowAdd(false)}>
          <div style={{background:P.card,borderRadius:18,width:"100%",maxWidth:450,boxShadow:`0 25px 80px ${P[900]}44`}} onClick={e=>e.stopPropagation()}>
            <div style={{padding:"20px 24px",background:`linear-gradient(135deg,${P[900]},${P[600]})`,borderRadius:"18px 18px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontWeight:800,fontSize:16,color:"#fff"}}>Add New Class</div></div>
              <button onClick={()=>setShowAdd(false)} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:9,padding:7,cursor:"pointer",color:"#fff",display:"flex"}}><X size={15}/></button>
            </div>
            <div style={{padding:24}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13,marginBottom:16}}>
                <div>
                  <label style={lbl}>Class Name</label>
                  <input style={inp} type="text" placeholder="e.g., 10-A" value={newCl.name} onChange={e=>setNewCl(p=>({...p,name:e.target.value}))}/>
                </div>
                <div>
                  <label style={lbl}>Grade</label>
                  <select style={inp} value={newCl.grade} onChange={e=>setNewCl(p=>({...p,grade:e.target.value}))}>
                    {[6,7,8,9,10,11,12].map(g=><option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13,marginBottom:20}}>
                <div>
                  <label style={lbl}>Section</label>
                  <select style={inp} value={newCl.section} onChange={e=>setNewCl(p=>({...p,section:e.target.value}))}>
                    {["A","B","C","D"].map(s=><option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Class Teacher (Optional)</label>
                  <input style={inp} type="text" placeholder="Teacher name or ID" value={newCl.teacher} onChange={e=>setNewCl(p=>({...p,teacher:e.target.value}))}/>
                </div>
              </div>
              <div style={{display:"flex",gap:9,justifyContent:"flex-end"}}>
                <button onClick={()=>setShowAdd(false)} style={{padding:"9px 18px",background:P.card,border:`1.5px solid ${P.border}`,borderRadius:10,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",color:P.text}}>Cancel</button>
                <button onClick={submitAdd} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 18px",background:`linear-gradient(135deg,${P.green},#10b981)`,color:"#fff",border:"none",borderRadius:10,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}><Check size={13}/>Add Class</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {delT&&(
        <div style={{position:"fixed",inset:0,background:"rgba(45,10,110,0.45)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(5px)"}} onClick={()=>setDelT(null)}>
          <div style={{background:P.card,borderRadius:18,padding:28,width:"100%",maxWidth:380,boxShadow:`0 25px 80px ${P[900]}44`,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:52,height:52,background:"#fef2f2",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Trash2 size={22} color={P.rose}/></div>
            <div style={{fontWeight:800,fontSize:16,color:P.text,marginBottom:8}}>Remove Class?</div>
            <div style={{fontSize:13,color:P.muted,lineHeight:1.6,marginBottom:22}}>Remove <strong style={{color:P.text}}>{delT.name}</strong>? This cannot be undone.</div>
            <div style={{display:"flex",gap:9}}>
              <button onClick={()=>setDelT(null)} style={{flex:1,padding:"10px",background:P.card,border:`1.5px solid ${P.border}`,borderRadius:11,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",color:P.text}}>Cancel</button>
              <button onClick={()=>deleteC(delT.id)} style={{flex:1,padding:"10px",background:P.rose,color:"#fff",border:"none",borderRadius:11,fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast&&(
        <div style={{position:"fixed",bottom:24,right:24,background:toast.t==="ok"?`linear-gradient(135deg,${P[700]},${P[500]})`:`linear-gradient(135deg,${P.rose},#f97316)`,color:"#fff",borderRadius:12,padding:"13px 20px",fontWeight:600,fontSize:13,zIndex:999,boxShadow:`0 8px 30px ${P[500]}44`,display:"flex",alignItems:"center",gap:9,animation:"fadeUp 0.3s ease"}}>
          {toast.t==="ok"?<Check size={15}/>:<AlertTriangle size={15}/>}{toast.m}
        </div>
      )}
    </div>
  );
}
