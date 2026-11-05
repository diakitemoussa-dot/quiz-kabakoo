// Quiz multi-espaces Kabakoo — serveur sans dépendance (Node 18+)
const http=require('http'),fs=require('fs'),path=require('path');
const PORT=process.env.PORT||3000,PASS=process.env.HOST_PASSWORD||'kabakoo',T=20,ESP=['Lomé','Bamako','Ségou'];
const Q=require('./questions.json');
let st={phase:'lobby',i:0,t0:0};const teams={};const clients=new Set(),hosts=new Set();
const score=t=>Object.values(t.answers).reduce((s,x)=>s+x.p,0);
function view(host){
  const rv=st.phase==='reveal'||st.phase==='end',q=Q[st.i],show=st.phase==='q'||rv;
  return JSON.stringify({now:Date.now(),T,n:Q.length,phase:st.phase,i:st.i,t0:st.t0,
    q:show?{q:q.q,o:q.o}:null,correct:(rv||(host&&show))?q.a:null,
    ...(host?{online:clients.size}:{}),
    teams:Object.entries(teams).map(([id,t])=>{const a=t.answers[st.i];return{id,name:t.name,espace:t.espace,score:score(t),
      done:!!a,res:rv&&a?a:null,...(host?{c:a?a.c:null,p:a?a.p:null}:{})}})});
}
function push(){const m=`data:${view(false)}

`,h=`data:${view(true)}

`;for(const r of clients)r.write(m);for(const r of hosts)r.write(h)}
function reveal(){if(st.phase==='q'){st.phase='reveal';push()}}
function begin(i){st={phase:'q',i,t0:Date.now()};const t0=st.t0;push();setTimeout(()=>{if(st.phase==='q'&&st.t0===t0)reveal()},T*1000+400)}
const send=(res,c,o)=>{res.writeHead(c,{'Content-Type':'application/json'});res.end(JSON.stringify(o))};
function api(p,b,res){
  const clean=s=>String(s||'').trim().slice(0,30);
  if(p==='join'){const name=clean(b.name);if(!b.id||!name||!ESP.includes(b.espace))return send(res,400,{err:'invalide'});
    teams[b.id]=teams[b.id]||{answers:{}};Object.assign(teams[b.id],{name,espace:b.espace});push();return send(res,200,{ok:1})}
  if(p==='answer'){const t=teams[b.id];if(!t||st.phase!=='q'||b.i!==st.i||t.answers[st.i])return send(res,400,{err:'refusé'});
    const el=(Date.now()-st.t0)/1000;if(el>T+0.5)return send(res,400,{err:'trop tard'});
    const ok=b.c===Q[st.i].a,pts=ok?Math.round(500+500*Math.max(0,1-el/T)):0;
    t.answers[st.i]={c:b.c,p:pts};push();return send(res,200,{ok:1})}
  if(p==='host'){if(b.pass!==PASS)return send(res,403,{err:'pass'});
    if(b.action==='start')begin(0);
    else if(b.action==='reveal')reveal();
    else if(b.action==='next'){if(st.i<Q.length-1)begin(st.i+1);else{st.phase='end';push()}}
    else if(b.action==='reset'){for(const k in teams)delete teams[k];st={phase:'lobby',i:0,t0:0};push()}
    return send(res,200,{ok:1})}
  send(res,404,{});
}
http.createServer((req,res)=>{
  if(req.url.startsWith('/events')){const hp=new URL(req.url,'http://x').searchParams.get('pass');
    if(hp!==null&&hp!==PASS){res.writeHead(403);return res.end()}
    const set=hp!==null?hosts:clients;
    res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive','X-Accel-Buffering':'no'});
    res.write(`data:${view(hp!==null)}

`);set.add(res);if(hp===null)push();req.on('close',()=>{set.delete(res);if(hp===null)push()});return}
  if(req.method==='POST'&&req.url.startsWith('/api/')){let d='';req.on('data',c=>{d+=c;if(d.length>5e3)req.destroy()});
    req.on('end',()=>{let b={};try{b=JSON.parse(d)}catch(e){}api(req.url.slice(5),b,res)});return}
  fs.readFile(path.join(__dirname,'public','index.html'),(e,h)=>{res.writeHead(e?500:200,{'Content-Type':'text/html; charset=utf-8'});res.end(h)});
}).listen(PORT,()=>console.log('Quiz sur http://localhost:'+PORT+' — mot de passe animateur : '+PASS));
setInterval(()=>{for(const r of clients)r.write(':\n\n')},25000);
