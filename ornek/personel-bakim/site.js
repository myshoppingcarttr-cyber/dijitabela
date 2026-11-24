const menu=document.querySelector('.navbutton'), nav=document.querySelector('.nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
const form=document.getElementById('request');
if(form){
 const fields=['hizmet','mekan','siklik','not'];
 const update=()=>{for(const key of fields){document.getElementById('s-'+key).textContent=form.elements[key].value.trim()||'—';}};
 for(const event of ['input','change'])form.addEventListener(event,()=>{update();document.getElementById('status').textContent='';});
 const requested=new URLSearchParams(location.search).get('hizmet');
 if([...form.elements.hizmet.options].some(o=>o.value===requested))form.elements.hizmet.value=requested;
 update();
 form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;update();document.getElementById('status').textContent='Önizlemeniz hazır. Bu örnekte talep gönderilmez.';document.getElementById('sonuc').focus();});
}
