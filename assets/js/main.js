document.querySelector('.menu-toggle')?.addEventListener('click',()=>{
  const ul=document.querySelector('.nav ul');if(!ul)return;
  ul.style.display=ul.style.display==='flex'?'none':'flex';
  ul.style.position='absolute';ul.style.top='64px';ul.style.left='0';ul.style.right='0';
  ul.style.background='#fff';ul.style.flexDirection='column';ul.style.padding='14px 18px';
  ul.style.borderBottom='1px solid #e6e9ef';
});
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

// ---- browsing context (A-level analytics, no backend) ----
(function () {
  var KEY = 'boadis_ctx', MAXM = 6, MAXK = 4;
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
  function bump(obj, k) { obj[k] = (obj[k] || 0) + 1; return obj; }
  function trim(obj, max) {
    var ks = Object.keys(obj).sort(function (a, b) { return obj[b] - obj[a]; }).slice(0, max), o = {};
    ks.forEach(function (k) { o[k] = obj[k]; }); return o;
  }
  var c = load(), now = Date.now();
  c.first = c.first || now; c.last = now; c.pv = (c.pv || 0) + 1;
  if (!c.ref && document.referrer) c.ref = document.referrer.slice(0, 120);
  var parts = location.pathname.split('/').filter(Boolean);
  var langs = ['es', 'ar', 'ru', 'fr'];
  if (langs.indexOf(parts[0]) >= 0) { c.lang = parts.shift(); } else { c.lang = c.lang || 'en'; }
  c.lastp = '/' + parts.join('/') + '/';
  if (parts[0] === 'cars') {
    if (parts[1] === 'new' && parts[2]) { c.b = bump(c.b || {}, parts[2]); }
    else if (parts[1] === 'used') { c.u = (c.u || 0) + 1; }
    else if (parts[1]) {
      c.m = bump(c.m || {}, parts[1]);
      c.mn = c.mn || {};
      var h1 = document.querySelector('h1');
      if (h1) { c.mn[parts[1]] = h1.textContent.trim().split(String.fromCharCode(10))[0].slice(0, 40); }
    }
  } else if (parts[0] === 'markets' && parts[1]) {
    c.k = bump(c.k || {}, parts[1]);
    c.kn = c.kn || {};
    var h2 = document.querySelector('h1');
    if (h2) { c.kn[parts[1]] = h2.textContent.trim().split(String.fromCharCode(10))[0].slice(0, 40); }
  } else if (parts[0] === 'contact') {
    c.cv = (c.cv || 0) + 1;
    if (!c.cfirst) { c.cfirst = now; }
  }
  c.m = trim(c.m || {}, MAXM); c.k = trim(c.k || {}, MAXK);
  save(c);

  // 联系页：把上下文写进隐藏字段，并回显已关注的车型/市场
  var fld = document.getElementById('ctx-field');
  if (fld) {
    var models = Object.keys(c.m || {}).map(function (k) { return (c.mn && c.mn[k] ? c.mn[k] : k) + 'x' + c.m[k]; });
    var mkts = Object.keys(c.k || {}).map(function (k) { return (c.kn && c.kn[k] ? c.kn[k] : k) + 'x' + c.k[k]; });
    var mins = c.first ? Math.max(1, Math.round((now - c.first) / 60000)) : 0;
    var d0 = c.first ? new Date(c.first) : new Date();
    var firstDay = d0.getFullYear() + '-' + ('0' + (d0.getMonth() + 1)).slice(-2) + '-' + ('0' + d0.getDate()).slice(-2);
    fld.value = [
      'v1', 'pv=' + c.pv, 'min=' + mins, 'first=' + firstDay, 'lang=' + (c.lang || 'en'),
      'ref=' + (c.ref || 'direct'),
      'models=' + (models.join(',') || '-'),
      'markets=' + (mkts.join(',') || '-'),
      'contact_visits=' + (c.cv || 0),
      'last=' + (c.lastp || '-')
    ].join(' | ');
    var echo = document.getElementById('ctx-echo');
    if (echo && (models.length || mkts.length)) {
      echo.style.display = 'block';
      echo.textContent = 'We have noted your interest: ' + [].concat(models, mkts).join(', ')
        .replace(/x([0-9]+)/g, function (m, n) { return ' (' + n + (n === '1' ? ' view)' : ' views)'); });
    }
  }
})();
