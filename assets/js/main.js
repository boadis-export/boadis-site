document.querySelector('.menu-toggle')?.addEventListener('click',()=>{
  const ul=document.querySelector('.nav ul');if(!ul)return;
  ul.style.display=ul.style.display==='flex'?'none':'flex';
  ul.style.position='absolute';ul.style.top='64px';ul.style.left='0';ul.style.right='0';
  ul.style.background='#fff';ul.style.flexDirection='column';ul.style.padding='14px 18px';
  ul.style.borderBottom='1px solid #e6e9ef';
});
const f=document.querySelector('form');
f?.addEventListener('submit',e=>{
  e.preventDefault();
  alert('已在演示模式：请把 form action 换成你自己的 Formspree 地址后再提交。');
});
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
