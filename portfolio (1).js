/* TYPING */
const phrases=["building multi-agent LLM systems","evaluating agents for production reliability","designing LLM observability infrastructure","making AI work beyond the demo"];
let pi=0,ci=0,del=false;
const tel=document.getElementById("typing-el");
function type(){
  const p=phrases[pi];
  if(!del){ci++;if(ci>p.length){del=true;setTimeout(type,1800);return;}}
  else{ci--;if(ci===0){del=false;pi=(pi+1)%phrases.length;}}
  tel.innerHTML=p.slice(0,ci)+'<span class="tblink"></span>';
  setTimeout(type,del?30:60);
}
setTimeout(type,800);

/* REVEAL */
const obs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");x.target.querySelectorAll(".prog-fill").forEach(b=>{setTimeout(()=>{b.style.width=b.dataset.w+"%";},200);});}});},{threshold:0.12});
document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));

/* ACCORDION */
function toggleP(i){
  const c=document.getElementById("pc"+i);
  const was=c.classList.contains("open");
  document.querySelectorAll(".pcard").forEach(x=>x.classList.remove("open"));
  if(!was){
    c.classList.add("open");
    c.querySelectorAll(".prog-fill").forEach(b=>{b.style.width="0%";setTimeout(()=>{b.style.width=b.dataset.w+"%";},100);});
    if(i===1)initAgents();
    if(i===3)initCNN();
  }
}

/* SCREENSHOTS */
function switchSS(el,prefix){
  el.parentElement.querySelectorAll(".ss-thumb").forEach(t=>t.classList.remove("active"));
  el.classList.add("active");
  document.getElementById(prefix+"-main").src=el.dataset.src;
}
function openLb(src){document.getElementById("lb-img").src=src;document.getElementById("lb").classList.add("open");}
function closeLb(){document.getElementById("lb").classList.remove("open");}

/* GUARDIAN DEMO */
function runGD(){
  const prompt=document.getElementById("gd-in").value||"Hello";
  const models=["gpt-4o-mini","gpt-4o","claude-3-sonnet","gpt-3.5-turbo"];
  const m=models[Math.floor(Math.random()*models.length)];
  const lat=Math.floor(Math.random()*2200)+400;
  const pt=Math.floor(prompt.length*1.3)+8;
  const ct=Math.floor(Math.random()*130)+40;
  const rates={"gpt-4o-mini":0.00015,"gpt-4o":0.005,"claude-3-sonnet":0.003,"gpt-3.5-turbo":0.0005};
  const cost=((pt+ct)/1000*(rates[m]||0.001)).toFixed(6);
  const q=(Math.random()*.25+.72).toFixed(2);
  const h=(Math.random()*.18+.04).toFixed(2);
  const alertVal=lat>2200?"LATENCY_HIGH":parseFloat(h)>0.18?"HALLUCINATION_RISK":"null";
  const alertColor=alertVal==="null"?"#a8c4a0":"#e08080";
  let html="";
  html+=`<span style="color:rgba(245,230,227,.25)"># Event logged to AI Guardian</span>\n`;
  html+=`{\n`;
  html+=`  <span style="color:#c9a0a8">"model"</span>: <span style="color:#e8c4c0">"${m}"</span>,\n`;
  html+=`  <span style="color:#c9a0a8">"latency_ms"</span>: <span style="color:#e8c4c0">${lat}</span>,\n`;
  html+=`  <span style="color:#c9a0a8">"tokens"</span>: <span style="color:#e8c4c0">${pt+ct}</span>,\n`;
  html+=`  <span style="color:#c9a0a8">"cost_usd"</span>: <span style="color:#e8c4c0">${cost}</span>,\n`;
  html+=`  <span style="color:#c9a0a8">"quality_score"</span>: <span style="color:#e8c4c0">${q}</span>,\n`;
  html+=`  <span style="color:#c9a0a8">"hallucination_risk"</span>: <span style="color:#e8c4c0">${h}</span>,\n`;
  html+=`  <span style="color:#c9a0a8">"alert"</span>: <span style="color:${alertColor}">${alertVal}</span>\n`;
  html+=`}\n`;
  html+=`<span style="color:#a8c4a0">✓ Stored · Dashboard updated</span>`;
  document.getElementById("gd-out").innerHTML=html;
}

/* AGENTS */
const agData={
  sum:{t:"Summarization Agent — BART",lines:['<span style="color:#c9a0a8">model:</span> facebook/bart-large-cnn','<span style="color:#c9a0a8">input:</span> "Attention Is All You Need" (arXiv)','<span style="color:#c9a0a8">chunking:</span> section-aware, 1024 tokens','<span style="color:#a8c4a0">→ Summary: 3 sentences generated</span>','<span style="color:#c9a0a8">ROUGE-1:</span> 0.458  ROUGE-2: 0.192','<span style="color:#c9a0a8">time:</span> 2.3s']},
  cit:{t:"Citation Analysis Agent",lines:['<span style="color:#c9a0a8">method:</span> regex (3 formats) + arXiv API','<span style="color:#c9a0a8">graph:</span> NetworkX directed graph','<span style="color:#a8c4a0">→ 30 references extracted</span>','<span style="color:#a8c4a0">→ Citation graph: 30 nodes, 28 edges</span>','<span style="color:#c9a0a8">top cited:</span> Bahdanau, Hochreiter, LeCun']},
  meth:{t:"Methodology Extractor — spaCy NER",lines:['<span style="color:#c9a0a8">technique:</span> spaCy NER + keyword matching','<span style="color:#a8c4a0">→ Datasets: WMT 2014 EN-DE, EN-FR</span>','<span style="color:#a8c4a0">→ Metrics: BLEU score, perplexity</span>','<span style="color:#a8c4a0">→ Architectures: Transformer, multi-head attention</span>','<span style="color:#c9a0a8">Dataset F1:</span> 0.800  Model F1: 1.000']},
  crit:{t:"Critical Analysis Agent",lines:['<span style="color:#c9a0a8">method:</span> section isolation + pattern matching','<span style="color:#a8c4a0">→ Limitations: 3 found</span>','&nbsp;&nbsp;· No RNN/CNN baseline comparison','&nbsp;&nbsp;· Quadratic attention complexity O(n²)','<span style="color:#a8c4a0">→ Future work: 2 items</span>','&nbsp;&nbsp;· Images, audio, video modalities']},
  eval:{t:"Ablation Study Results",lines:['ROUGE-1: <span style="color:#a8c4a0">0.50</span> vs <span style="color:#e08080">0.19</span>  (+0.31)','ROUGE-2: <span style="color:#a8c4a0">0.31</span> vs <span style="color:#e08080">0.11</span>  (+0.20)','Model F1: <span style="color:#a8c4a0">1.00</span> vs <span style="color:#e08080">0.55</span>  (+0.45)','<span style="color:rgba(245,230,227,.3)">Remove any agent → failure:</span>','&nbsp;&nbsp;-Summarizer → <span style="color:#e08080">ROUGE: 0.000</span>','&nbsp;&nbsp;-Citation → <span style="color:#e08080">refs: 30 → 0</span>']}
};
function initAgents(){showAgent(document.querySelector(".atab.on"),"sum");}
function showAgent(btn,k){
  document.querySelectorAll(".atab").forEach(b=>b.classList.remove("on"));
  btn.classList.add("on");
  const d=agData[k];
  document.getElementById("agent-out").innerHTML=`<span style="color:rgba(245,230,227,.3);font-size:11px">// ${d.t}</span>\n`+d.lines.join("\n");
}

/* CNN */
const arabicChars=["ا","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ط","ظ","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي"];
function initCNN(){
  const c=document.getElementById("cnn-chars");
  if(c.children.length)return;
  arabicChars.forEach(ch=>{
    const el=document.createElement("div");
    el.style.cssText="width:34px;height:34px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(232,196,192,.2);font-size:1.1rem;cursor:pointer;transition:all .2s;background:rgba(255,255,255,.04);color:rgba(245,230,227,.7);";
    el.textContent=ch;
    el.onmouseenter=()=>{if(!el.classList.contains("sel")){el.style.background="var(--rose)";el.style.color="var(--ink)";}};
    el.onmouseleave=()=>{if(!el.classList.contains("sel")){el.style.background="rgba(255,255,255,.04)";el.style.color="rgba(245,230,227,.7)";}};
    el.onclick=()=>runCNN(ch,el);
    c.appendChild(el);
  });
}
function runCNN(ch,el){
  document.querySelectorAll("#cnn-chars div").forEach(d=>{d.classList.remove("sel");d.style.background="rgba(255,255,255,.04)";d.style.color="rgba(245,230,227,.7)";});
  el.classList.add("sel");el.style.background="var(--rose)";el.style.color="var(--ink)";
  const conf=(Math.random()*.1+.88).toFixed(3);
  const r2=(Math.random()*.05+.03).toFixed(3);
  const r3=(Math.random()*.02+.005).toFixed(3);
  const w1=Math.round(parseFloat(conf)*100);
  const w2=Math.round(parseFloat(r2)*100);
  const w3=Math.round(parseFloat(r3)*100);
  let html="";
  html+=`<span style="color:#c9a0a8">char:</span> <span style="color:#e8c4c0">${ch}</span>  <span style="color:#c9a0a8">prediction:</span> <span style="color:#a8c4a0">${ch} ✓</span>\n\n`;
  html+=`<span style="color:rgba(245,230,227,.35)">top-3 confidence:</span>\n`;
  html+=`  ${ch}  <span style="display:inline-block;height:7px;background:var(--rose);width:${w1}px;vertical-align:middle"></span> <span style="color:#e8c4c0">${conf}</span>\n`;
  html+=`  ·   <span style="display:inline-block;height:7px;background:rgba(232,196,192,.25);width:${w2}px;vertical-align:middle"></span> <span style="color:rgba(245,230,227,.35)">${r2}</span>\n`;
  html+=`  ·   <span style="display:inline-block;height:7px;background:rgba(232,196,192,.12);width:${w3}px;vertical-align:middle"></span> <span style="color:rgba(245,230,227,.25)">${r3}</span>\n\n`;
  html+=`<span style="color:#a8c4a0">✓ Classified · 92% test accuracy · PyTorch CNN</span>`;
  document.getElementById("cnn-out").innerHTML=html;
}

/* CHATBOT */
let chatMode="about";
const aboutSugs=["What projects have you built?","What is AI Guardian?","What are you looking for?","Tell me about your experience"];
const guardianSugs=["Track a fast gpt-4o-mini call","Simulate a high latency alert","What does quality score mean?","Show a hallucination warning"];
const kb={
  "projects":"Siham has built 4 main projects: AI Guardian (LLM observability platform with FastAPI + PostgreSQL + React), Scientific Paper Analysis Agents (5-agent NLP pipeline evaluated with ROUGE), Nexus-AI (facial recognition attendance system, senior thesis, departmental Honors), and Arabic Handwriting CNN (92% accuracy, full Arabic alphabet).",
  "ai guardian":"AI Guardian is an event-driven LLM observability platform. A Python SDK wraps any LLM call and captures latency, token usage, cost, quality scores, and hallucination risk in real time. Built with FastAPI, PostgreSQL, React, and Vite.",
  "guardian":"AI Guardian is an event-driven LLM observability platform with a Python SDK that tracks latency, token usage, cost, quality scores, and hallucination risk in real time.",
  "nexus":"Nexus-AI is a real-time facial recognition attendance system built as Siham's senior thesis. It uses dlib HOG + 128D face embeddings, has 3 dashboards (Admin, Professor, Student), an AI-powered absence chatbot, and automated attendance reports. Awarded departmental Honors.",
  "cnn":"The Arabic Handwriting CNN was trained from scratch on 13,440 labeled images to classify all 28 Arabic characters. Built with PyTorch, achieved 92% test accuracy. Addresses a real gap in Arabic OCR tooling.",
  "agents":"The Scientific Paper Analysis System has 5 specialized agents: Summarization (BART), Citation Analysis (NetworkX), Methodology Extractor (spaCy NER), Critical Analysis, and Coordinator. Achieved +0.31 ROUGE-1 over single-model baseline with ablation studies.",
  "experience":"Siham worked at Schneider Electric (summer 2024) building and evaluating multi-agent LLM pipelines with AutoGen, LangChain, and LlamaIndex. She also worked as a Business Analyst at CaffeBerry.co, Web Developer at Vivi Dynamics, and Data Analyst at Preflet.",
  "schneider":"At Schneider Electric (May-July 2024), Siham built multi-agent LLM pipelines using AutoGen, LangChain, and LlamaIndex with GPT-4, Claude, and Gemini. She designed role-specific agents and evaluated frameworks across accuracy, latency, and reasoning depth.",
  "looking":"Siham is actively seeking an AI/ML co-op or internship in Boston/Cambridge. Open to applied AI engineering, LLM systems, multi-agent architecture, and ML infrastructure roles.",
  "skills":"Core skills: LangChain, AutoGen, LlamaIndex, OpenAI API, HuggingFace, BART, PyTorch, spaCy, FastAPI, PostgreSQL, React, ROUGE evaluation, ablation studies, hallucination detection. Languages: Python, SQL, JavaScript, R.",
  "education":"Siham is pursuing an M.S. in AI at Northeastern University Khoury College (ML concentration, expected 2027). She holds a B.A. in Computer Science and Data Science from The College of Wooster, graduating with departmental Honors.",
  "contact":"You can reach Siham via LinkedIn (linkedin.com/in/siham-boumalak-11014b210) or GitHub (github.com/boumalaksiham). She is actively open to AI/ML co-op opportunities.",
  "hello":"Hi! I know all about Siham's work. Ask me about her projects, experience, or what she is looking for.",
  "hi":"Hi! Ask me about Siham's projects, experience, skills, or what she is looking for."
};
function getAboutResponse(msg){
  const m=msg.toLowerCase();
  for(const [k,v] of Object.entries(kb)){if(m.includes(k))return v;}
  return "I can tell you about Siham's projects, experience, skills, or what she is looking for. What would you like to know?";
}
function getGuardianResponse(msg){
  const m=msg.toLowerCase();
  const models=["gpt-4o-mini","gpt-4o","claude-3-sonnet"];
  const model=models[Math.floor(Math.random()*models.length)];
  const lat=m.includes("latency")||m.includes("slow")?Math.floor(Math.random()*2000)+5000:Math.floor(Math.random()*1500)+400;
  const pt=Math.floor(Math.random()*80)+20;
  const ct=Math.floor(Math.random()*120)+30;
  const rates={"gpt-4o-mini":0.00015,"gpt-4o":0.005,"claude-3-sonnet":0.003};
  const cost=((pt+ct)/1000*(rates[model]||0.001)).toFixed(6);
  const halluc=m.includes("hallucin")?(Math.random()*.15+0.75).toFixed(2):(Math.random()*.12+.04).toFixed(2);
  const q=(Math.random()*.2+.72).toFixed(2);
  const alertStr=lat>5000?"LATENCY_HIGH":parseFloat(halluc)>0.7?"HALLUCINATION_RISK":"none";
  return `AI Guardian event tracked:\n• model: ${model}\n• latency: ${lat}ms${lat>5000?" [ALERT]":""}\n• tokens: ${pt+ct} (prompt: ${pt}, completion: ${ct})\n• cost: $${cost}\n• quality: ${q}\n• hallucination risk: ${halluc}${parseFloat(halluc)>0.7?" [ALERT]":""}\n• alert: ${alertStr}`;
}
function switchTab(el,mode){
  chatMode=mode;
  document.querySelectorAll(".ctab").forEach(t=>t.classList.remove("on"));
  el.classList.add("on");
  document.getElementById("chat-msgs").innerHTML="";
  const sugs=document.getElementById("chat-sugs");
  sugs.innerHTML="";
  const list=mode==="about"?aboutSugs:guardianSugs;
  list.forEach(s=>{
    const btn=document.createElement("button");
    btn.className="sug";btn.textContent=s;
    btn.onclick=()=>{document.getElementById("chat-input").value=s;sendChat();};
    sugs.appendChild(btn);
  });
  addMsg("bot",mode==="about"?"Hi! Ask me anything about Siham — her projects, experience, skills, or what she is looking for.":"AI Guardian is live. Send any message and I will simulate tracking it as an LLM event.");
}
function addMsg(role,text){
  const msgs=document.getElementById("chat-msgs");
  const div=document.createElement("div");
  div.className="msg "+role;
  div.textContent=text;
  msgs.appendChild(div);
  msgs.scrollTop=msgs.scrollHeight;
}
function sendChat(){
  const input=document.getElementById("chat-input");
  const msg=input.value.trim();
  if(!msg)return;
  addMsg("user",msg);
  input.value="";
  const thinking=document.createElement("div");
  thinking.className="msg bot thinking";
  thinking.textContent="thinking...";
  const msgs=document.getElementById("chat-msgs");
  msgs.appendChild(thinking);
  msgs.scrollTop=msgs.scrollHeight;
  setTimeout(()=>{
    thinking.remove();
    addMsg("bot",chatMode==="about"?getAboutResponse(msg):getGuardianResponse(msg));
  },600+Math.random()*400);
}
window.addEventListener("load",()=>{
  switchTab(document.querySelector(".ctab.on"),"about");
  initCNN();
});
