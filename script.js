
lucide.createIcons();

// ===== TOAST NOTIFICATIONS =====
const toastEl = document.getElementById('toast');
const toastMsgEl = document.getElementById('toastMsg');
let toastTimer;
function showToast(message) {
    toastMsgEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

// ===== PARTICLES =====
(function(){const c=document.getElementById('particles');for(let i=0;i<25;i++){const p=document.createElement('div');p.className='particle';p.style.left=Math.random()*100+'%';p.style.top=(Math.random()*100+100)+'%';p.style.background=Math.random()>.5?'var(--theme-primary)':'var(--theme-secondary)';p.style.opacity=Math.random()*.4+.1;p.style.width=p.style.height=(Math.random()*3+1)+'px';p.style.animation=`particleFloat ${Math.random()*15+10}s linear infinite`;p.style.animationDelay=`-${Math.random()*15}s`;c.appendChild(p)}})();

// ===== LIVE CLOCK =====
function updateClock(){const n=new Date();document.getElementById('liveTime').textContent=n.toLocaleTimeString('en-US',{hour12:true});document.getElementById('liveDate').textContent=n.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})}
updateClock();setInterval(updateClock,1000);

// ===== SCROLL ANIMATIONS =====
const obs=new IntersectionObserver(e=>{e.forEach(en=>{if(en.isIntersecting){en.target.classList.add('visible');en.target.querySelectorAll('.skill-bar-fill').forEach(b=>setTimeout(()=>b.classList.add('animated'),200))}})},{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.slide-up').forEach(el=>obs.observe(el));

// ===== ACTIVE NAV =====
const secs=document.querySelectorAll('section[id]'),navs=document.querySelectorAll('.nav-link');
window.addEventListener('scroll',()=>{let c='';secs.forEach(s=>{if(scrollY>=s.offsetTop-100)c=s.id});navs.forEach(l=>{l.classList.remove('active');if(l.getAttribute('href')==='#'+c)l.classList.add('active')})});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',function(e){e.preventDefault();document.querySelector(this.getAttribute('href'))?.scrollIntoView({behavior:'smooth'})})});

// ===== 3D BUTTON MOUSE TRACKING =====
document.querySelectorAll('.btn-3d,.btn-3d-outline').forEach(btn=>{btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;btn.style.transform=`perspective(600px) rotateX(${-y*15}deg) rotateY(${x*15}deg) translateY(-4px)`;if(!btn.classList.contains('btn-3d-outline'))btn.style.background=`radial-gradient(circle at ${e.clientX-r.left}px ${e.clientY-r.top}px,rgba(var(--theme-primary-rgb),.4),var(--theme-secondary) 60%,#1d4ed8 100%)`;btn.style.boxShadow=`${x*-3}px ${y*3+15}px 40px rgba(var(--theme-primary-rgb),.25),0 0 20px rgba(var(--theme-primary-rgb),.15)`});btn.addEventListener('mouseleave',()=>{btn.style.transform='';btn.style.background=btn.classList.contains('btn-3d')?'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))':'';btn.style.boxShadow=''})});

// ===== 3D CARD MOUSE TRACKING =====
document.querySelectorAll('.card-3d').forEach(c=>{c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();c.style.transform=`rotateY(${((e.clientX-r.left)/r.width-.5)*12}deg) rotateX(${-( (e.clientY-r.top)/r.height-.5)*12}deg) translateZ(20px)`});c.addEventListener('mouseleave',()=>{c.style.transform=''})});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();showToast("Message sent! I'll get back to you soon.");e.target.reset()});

// ===== MOBILE MENU =====
document.getElementById('mobileMenuBtn').addEventListener('click',()=>{document.getElementById('mobileMenu').classList.add('open')});
document.getElementById('mobileMenuClose').addEventListener('click',closeMobileMenu);
function closeMobileMenu(){document.getElementById('mobileMenu').classList.remove('open')}
