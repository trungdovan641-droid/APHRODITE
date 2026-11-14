const CFG={
  date:'2026-11-29',   // NGÀY SỰ KIỆN (năm-tháng-ngày): đổi ở đây, cả trang tự cập nhật
  email:'aphroditeclinic@gmail.com',
  endpoint:'https://script.google.com/macros/s/AKfycbzAmt_Oacyr5aFE1wo9b22GE__1bM_eeXUxQuwiD1uCirAa7RU1K6_k_5AnitLAVgs/exec'
};
const $=s=>document.querySelector(s),root=document.documentElement,clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const pad=n=>String(n).padStart(2,'0');
// ngày sự kiện -> toàn bộ trang
const D=new Date(CFG.date+'T09:00:00'),dd=D.getDate(),mm=D.getMonth()+1,yy=D.getFullYear();
const WD=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'][D.getDay()],dstr=`${pad(dd)}.${pad(mm)}.${yy}`;
$('#day').dataset.to=dd;$('#day').textContent=pad(dd);$('#mo').textContent=`Tháng ${mm} · ${yy}`;$('#wd').textContent=WD;
document.querySelectorAll('.dtx').forEach(e=>e.textContent=dstr);
// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;t.classList.add('in');
  t.querySelectorAll('.ln').forEach(l=>l.classList.add('in'));
  if(t.id==='day')count(t);io.unobserve(t)}),{threshold:.3,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv,.rule,.hl,h2').forEach(el=>io.observe(el));
function count(el){const to=+el.dataset.to,t0=performance.now();
  (function f(t){const k=Math.min((t-t0)/1600,1);el.textContent=pad(Math.round(to*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(f)})(t0)}
// scroll liền mạch: mọi chuyển động dùng chung một vòng nội suy
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const S={p:0,pp:0,ph:0,tp:0},T={p:0,pp:0,ph:0,tp:0},phEl=$('.ph'),tl=$('.tl'),secs=[...document.querySelectorAll('section')];
let raf=0;
function measure(){const H=innerHeight,h=root.scrollHeight-H;
  T.p=scrollY/H;T.pp=h>0?clamp(scrollY/h):0;
  let r=phEl.getBoundingClientRect();T.ph=clamp((H*.95-r.top)/(H*.55));
  r=tl.getBoundingClientRect();T.tp=clamp((H*.72-r.top)/r.height);
  for(const s of secs){const b=s.getBoundingClientRect();if(b.top<=H*.5&&b.bottom>H*.5){document.body.dataset.t=s.dataset.s;break}}
  if(!raf)raf=requestAnimationFrame(step)}
function step(){raf=0;let busy=false;
  for(const k in S){const d=T[k]-S[k];if(RM||Math.abs(d)<.0005)S[k]=T[k];else{S[k]+=d*.1;busy=true}}
  root.style.setProperty('--p',S.p.toFixed(4));root.style.setProperty('--pp',S.pp.toFixed(4));
  phEl.style.setProperty('--ph',S.ph.toFixed(4));tl.style.setProperty('--tp',S.tp.toFixed(4));
  if(busy)raf=requestAnimationFrame(step)}
addEventListener('scroll',measure,{passive:true});addEventListener('resize',measure);measure();
// xác nhận tham dự
const dlg=$('#dlg'),isUrl=CFG.endpoint.startsWith('https');
$('#rsvp').onclick=()=>dlg.showModal();
['#cl','#cl2'].forEach(s=>$(s).onclick=()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
$('#f').onsubmit=async e=>{e.preventDefault();
  const b=$('#f button[type=submit]'),d={name:$('#n').value.trim(),phone:$('#ph').value.trim(),guests:$('#g').value,event:`Lễ ra mắt cơ sở mới - 9:00 sáng ${pad(dd)}/${pad(mm)}/${yy}`};
  b.disabled=true;b.textContent='Đang gửi…';$('#err').hidden=true;
  try{
    if(isUrl)await fetch(CFG.endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(d)});
    $('#nm').textContent=d.name||'Quý khách';dlg.classList.add('done');
    const r=$('#rsvp');r.textContent='Đã xác nhận tham dự ✓';r.disabled=true;
    if(!isUrl&&CFG.email)location.href='mailto:'+CFG.email+'?subject='+encodeURIComponent('Xác nhận tham dự - '+d.event)+'&body='+encodeURIComponent(`Họ và tên: ${d.name}\nSố điện thoại: ${d.phone}\nSố khách: ${d.guests}`);
  }catch(_){b.disabled=false;b.textContent='Gửi xác nhận';$('#err').hidden=false}};
