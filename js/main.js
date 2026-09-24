/* client logos: fall back to the name if a logo can't load */
document.querySelectorAll('.client-logo').forEach(img=>{const fb=()=>{img.hidden=true;img.nextElementSibling.hidden=false};if(img.complete&&img.naturalWidth===0)fb();else img.addEventListener('error',fb)});

/* mobile menu */
const mb=document.getElementById('menuBtn'),mm=document.getElementById('mobileMenu');
mb.addEventListener('click',()=>{const o=mm.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
mm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mm.classList.remove('open');mb.setAttribute('aria-expanded',false)}));

/* FAQ */
const faqs=[
 ['Bagaimana cara mengajukan demo penggunaan aplikasi?','Isi formulir di bagian bawah halaman ini, atau hubungi kami di (021) 8431 1636, email marketing@pkp.co.id, dan WhatsApp 0811-1568-477.'],
 ['Bagaimana jika belum punya Facebook Business Manager?','Kami bisa bantu registrasi Facebook Business Manager dengan biaya tambahan.'],
 ['Apakah ada training untuk penggunaan aplikasi?','Ya, kami menyediakan training bagi pengguna — dan pendampingan sampai go-live.'],
 ['Apakah BeeZap bisa menyediakan nomor telepon untuk WhatsApp?','Bisa. Kami bisa bantu menyediakan nomor telepon dengan biaya tambahan.'],
 ['Apa saja persyaratan integrasi BeeZap?','Memiliki Facebook Business Manager, website dan email domain, serta memenuhi persyaratan legalitas.'],
 ['Berapa lama proses verifikasi WA Official?','Proses verifikasi WhatsApp Official bergantung pada kebijakan Meta. Tim kami akan mendampingi prosesnya.'],
 ['Apa saja persyaratan legalitas yang harus dipenuhi?','Melampirkan dokumen NPWP dan Surat Izin Usaha.'],
 ['Berapa lama waktu yang dibutuhkan dalam proses integrasi?','Maksimal 8 minggu jika sudah memiliki Facebook Business Manager.']
];
const grid=document.getElementById('faqGrid');
const colA=document.createElement('div'),colB=document.createElement('div');colA.className=colB.className='faq-col';
faqs.forEach(([q,a],i)=>{
  const d=document.createElement('details');d.className='qa';d.id='faq-'+i;
  d.innerHTML='<summary><span></span><span class="pm"><svg width="16" height="16"><use href="#i-plus"/></svg></span></summary><div class="ans-wrap"><div class="ans"></div></div>';
  d.querySelector('summary span').textContent=q;d.querySelector('.ans').textContent=a;
  (i%2?colB:colA).appendChild(d);
});
grid.append(colA,colB);
/* smooth accordion: animate height + fade/slide, interruptible */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE='cubic-bezier(.23,1,.32,1)';
function setOpen(d,open){
  const wrap=d.querySelector('.ans-wrap'),ans=d.querySelector('.ans');
  if(d._anim){d._anim.cancel();d._fade&&d._fade.cancel()}
  const from=wrap.getBoundingClientRect().height;
  if(open){d.open=true;d.classList.add('is-open')}else{d.classList.remove('is-open')}
  if(reduce){if(!open)d.open=false;return}
  const to=open?ans.getBoundingClientRect().height:0;
  d._anim=wrap.animate([{height:from+'px'},{height:to+'px'}],{duration:open?380:280,easing:EASE});
  d._fade=ans.animate(open?[{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'none'}]:[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-4px)'}],{duration:open?380:200,easing:EASE,fill:'both'});
  d._anim.onfinish=()=>{d._anim=null;d._fade&&d._fade.cancel();if(!open)d.open=false};
}
grid.querySelectorAll('details.qa').forEach(d=>{
  d.querySelector('summary').addEventListener('click',e=>{
    e.preventDefault();const willOpen=!d.classList.contains('is-open');
    if(willOpen)grid.querySelectorAll('details.qa.is-open').forEach(o=>{if(o!==d)setOpen(o,false)});
    setOpen(d,willOpen);
  });
});


/* form: inline validation + honest preview state */
const form=document.getElementById('demoForm'),msg=document.getElementById('formMsg'),sb=document.getElementById('submitBtn');
const rules={'f-nama':v=>v.trim().length>1||'Isi nama lengkap Anda.','f-perusahaan':v=>v.trim().length>1||'Isi nama perusahaan Anda.','f-hp':v=>/^(\+62|0)8\d{7,12}$/.test(v.replace(/[\s-]/g,''))||'Gunakan format 08xxxxxxxxxx atau +628xxxxxxxxx.','f-email':v=>/^\S+@\S+\.\S+$/.test(v)||'Masukkan email yang valid, cth. nama@perusahaan.co.id.','f-kebutuhan':v=>!!v||'Pilih kebutuhan utama Anda.'};
function check(id){const i=document.getElementById(id),e=document.getElementById(id+'-err'),r=rules[id](i.value);
  if(r===true){i.removeAttribute('aria-invalid');e.hidden=true;return true}
  i.setAttribute('aria-invalid','true');e.textContent=r;e.hidden=false;return false}
Object.keys(rules).forEach(id=>{const i=document.getElementById(id);i.addEventListener('blur',()=>{if(i.value)check(id)});i.addEventListener('change',()=>{if(i.getAttribute('aria-invalid'))check(id)});i.addEventListener('input',()=>{if(i.getAttribute('aria-invalid'))check(id)})});
form.addEventListener('submit',e=>{
  e.preventDefault();msg.hidden=true;
  const bad=Object.keys(rules).filter(id=>!check(id));
  if(bad.length){document.getElementById(bad[0]).focus();return}
  const label=sb.innerHTML;sb.disabled=true;sb.innerHTML='<span class="spin"></span> Memeriksa data…';
  setTimeout(()=>{sb.disabled=false;sb.innerHTML=label;msg.hidden=false;
    const v=id=>document.getElementById(id).value.trim();
    const text=`Halo BeeZap, saya ingin request demo.\nNama: ${v('f-nama')}\nPerusahaan: ${v('f-perusahaan')}\nEmail: ${v('f-email')}\nNo. WhatsApp: ${v('f-hp')}\nKebutuhan: ${v('f-kebutuhan')}`+(v('f-tanya')?`\nPesan: ${v('f-tanya')}`:'');
    msg.innerHTML='';const t=document.createElement('div');t.textContent='Data lengkap. Form ini belum tersambung ke sistem, jadi data belum terkirim otomatis. Kirim lewat WhatsApp agar tim kami langsung menerimanya:';
    const a=document.createElement('a');a.className='btn btn-green';a.target='_blank';a.rel='noopener';a.href='https://wa.me/628111568477?text='+encodeURIComponent(text);a.textContent='Kirim via WhatsApp';msg.append(t,a)},600);
});

/* sticky mobile CTA after hero */
const sticky=document.getElementById('stickyCta'),hero=document.querySelector('.hero'),contact=document.getElementById('kontak');
if('IntersectionObserver' in window){let heroOut=false,contactIn=false;const upd=()=>{const on=heroOut&&!contactIn;sticky.classList.toggle('show',on);sticky.setAttribute('aria-hidden',!on);sticky.querySelectorAll('a').forEach(a=>a.tabIndex=on?0:-1)};
  new IntersectionObserver(([en])=>{heroOut=!en.isIntersecting;upd()}).observe(hero);
  new IntersectionObserver(([en])=>{contactIn=en.isIntersecting;upd()}).observe(contact);}

/* smooth scroll (Lenis) + anchor offset */
let lenis=null;
if(!reduce&&window.Lenis){lenis=new Lenis({duration:1.15,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true});
  (function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(performance.now());}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const id=a.getAttribute('href');if(id.length<2&&id!=='#top')return;const t=id==='#top'?0:document.querySelector(id);if(t===null)return;
  e.preventDefault();const off=-76;
  if(lenis)lenis.scrollTo(t,{offset:off,duration:1.3});
  else{const y=t===0?0:t.getBoundingClientRect().top+scrollY+off;scrollTo({top:y,behavior:reduce?'auto':'smooth'})}
}));

/* scroll-driven motion: WhatsApp icons, dashboard tilt */
const fx={
  right:p=>({x:-34*p,y:-110*p,r:-20*p,s:1+.08*(1-Math.min(1,Math.abs(p)))}),
  left:p=>({x:28*p,y:90*p,r:16*p,s:1+.07*(1-Math.min(1,Math.abs(p)))}),
  cta1:p=>({x:-10*p,y:-40*p,r:-14*p,s:1}),
  cta2:p=>({x:10*p,y:44*p,r:12*p,s:1})
};
const wa=[...document.querySelectorAll('.wa[data-fx]')],base=document.querySelector('#phoneScene .base'),dash=document.getElementById('dashShot');
function progress(el){const r=el.getBoundingClientRect(),vh=innerHeight;return Math.max(-1,Math.min(1,((r.top+r.height/2)-vh/2)/(vh/2+r.height/2)))}
let ticking=false;
function update(){ticking=false;if(reduce)return;
  wa.forEach(el=>{const p=progress(el.closest('.phone-scene,.cta-art')),v=fx[el.dataset.fx](p);
    el.style.setProperty('--x',v.x.toFixed(1)+'px');el.style.setProperty('--y',v.y.toFixed(1)+'px');el.style.setProperty('--r',v.r.toFixed(2)+'deg');el.style.setProperty('--s',v.s.toFixed(3))});
  if(base)base.style.setProperty('--py',(progress(base.closest('.phone-scene'))*-24).toFixed(1)+'px');
  if(dash){const p=progress(dash),k=Math.max(0,p);dash.style.setProperty('--tilt',(k*16).toFixed(2)+'deg');dash.style.setProperty('--sc',(1-k*.06).toFixed(3))}
}
const req=()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}};
if(lenis)lenis.on('scroll',req);addEventListener('scroll',req,{passive:true});addEventListener('resize',req);update();

/* active nav link */
const links=[...document.querySelectorAll('.nav-links a')];
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+en.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
  ['kenapa','fitur','use-case','cara-mulai','faq'].forEach(id=>{const el=document.getElementById(id);if(el)io.observe(el)});}
