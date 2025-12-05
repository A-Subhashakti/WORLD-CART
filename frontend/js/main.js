
function $qs(s){ return document.querySelector(s); }
function $qsa(s){ return Array.from(document.querySelectorAll(s)); }

function getCurrentUser(){
  try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch(e) { return null; }
}

function formatRupee(n){ return '₹ ' + (Number(n)||0).toLocaleString('en-IN'); }


document.addEventListener('click', (e) => {
  if (e.target && e.target.matches('[data-logout]')) {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    
    location.reload();
  }
});
