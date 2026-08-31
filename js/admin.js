/**
 * admin.js - Admin Authentication & Inline Editing
 * กรมทหารราบ ๙๐๒ รักษาพระองค์
 */
(function () {
  'use strict';

  var ADMIN_PASSWORD = 'r902admin';
  var SESSION_KEY    = 'masterAdminAuth';

  var CSS = [
    '#adminBar{position:fixed;top:0;left:0;right:0;z-index:99999;',
    'background:linear-gradient(135deg,#8B1A28,#B22234);border-bottom:2px solid #C9A84C;',
    'display:none;align-items:center;justify-content:space-between;',
    'padding:0 1.25rem;height:44px;gap:1rem;font-family:Sarabun,sans-serif;',
    'box-shadow:0 2px 12px rgba(0,0,0,.3);}',
    '#adminBar.visible{display:flex;}',
    'body.admin-active{padding-top:44px;}',
    '.abar-left{display:flex;align-items:center;gap:.75rem;color:#fff;font-size:.82rem;font-weight:700;}',
    '.abar-pulse{width:8px;height:8px;border-radius:50%;background:#4cff8f;animation:abPulse 1.5s ease-in-out infinite;}',
    '@keyframes abPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.85)}}',
    '.abar-right{display:flex;gap:.5rem;}',
    '.abar-btn{padding:.3rem .85rem;border-radius:999px;font-size:.78rem;font-weight:600;cursor:pointer;border:none;transition:all .15s;font-family:Sarabun,sans-serif;text-decoration:none;display:inline-flex;align-items:center;gap:.3rem;}',
    '.abar-btn-ghost{background:rgba(255,255,255,.15);color:#fff;}',
    '.abar-btn-ghost:hover{background:rgba(255,255,255,.28);color:#fff;}',
    '.abar-btn-white{background:rgba(255,255,255,.9);color:#8B1A28;}',
    '.abar-btn-white:hover{background:#fff;}',
    '.admin-edit-btn{display:none;align-items:center;gap:.35rem;padding:.35rem .9rem;background:rgba(178,34,52,.1);border:1.5px dashed #B22234;border-radius:8px;color:#8B1A28;font-size:.78rem;font-weight:700;cursor:pointer;transition:all .15s;font-family:Sarabun,sans-serif;}',
    'body.admin-active .admin-edit-btn{display:inline-flex;}',
    '.admin-edit-btn:hover{background:#B22234;color:#fff;border-color:#B22234;}',
    '.admin-section-controls{display:none;justify-content:flex-end;gap:.5rem;padding:.6rem 0;margin-bottom:.75rem;flex-wrap:wrap;}',
    'body.admin-active .admin-section-controls{display:flex;}',
    '#adminLoginModal{position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;}',
    '#adminLoginModal.open{display:flex;}',
    '.alm-card{background:#fff;border-radius:20px;padding:2.5rem 2rem;max-width:380px;width:90%;box-shadow:0 40px 100px rgba(0,0,0,.35);text-align:center;animation:almSlide .35s cubic-bezier(.4,0,.2,1);position:relative;}',
    '@keyframes almSlide{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}',
    '.alm-logo{width:68px;height:68px;object-fit:contain;margin-bottom:1rem;}',
    '.alm-badge{display:inline-block;background:#FBE9EC;color:#8B1A28;border-radius:999px;padding:.25rem .8rem;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.75rem;}',
    '.alm-title{font-size:1.15rem;font-weight:800;color:#1A2332;margin-bottom:.25rem;font-family:Sarabun,sans-serif;}',
    '.alm-sub{font-size:.82rem;color:#5A6478;margin-bottom:1.5rem;line-height:1.5;font-family:Sarabun,sans-serif;}',
    '.alm-input{width:100%;border:2px solid #DDE1E7;border-radius:12px;padding:.8rem 1rem;font-size:1rem;font-family:Sarabun,sans-serif;text-align:center;letter-spacing:.2em;outline:none;background:#F5F6F8;transition:border-color .2s,box-shadow .2s;box-sizing:border-box;}',
    '.alm-input:focus{border-color:#B22234;background:#fff;box-shadow:0 0 0 3px rgba(178,34,52,.1);}',
    '.alm-input.error{border-color:#DC3545;animation:almShake .35s;}',
    '@keyframes almShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}',
    '.alm-btn{width:100%;padding:.85rem;margin-top:.75rem;background:linear-gradient(135deg,#8B1A28,#B22234);color:#fff;border:none;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;font-family:Sarabun,sans-serif;transition:transform .15s,box-shadow .15s;}',
    '.alm-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(178,34,52,.4);}',
    '.alm-err{color:#DC3545;font-size:.8rem;margin-top:.5rem;min-height:1.2em;font-weight:600;font-family:Sarabun,sans-serif;}',
    '.alm-close{position:absolute;top:.75rem;right:.75rem;width:32px;height:32px;background:rgba(0,0,0,.08);border:none;border-radius:50%;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;transition:background .15s;}',
    '.alm-close:hover{background:rgba(0,0,0,.15);}',
    '.nav-admin-btn{padding:.35rem .9rem;border-radius:999px;font-size:.78rem;font-weight:700;cursor:pointer;border:1.5px solid rgba(178,34,52,.35);background:rgba(178,34,52,.07);color:#8B1A28;font-family:Sarabun,sans-serif;transition:all .15s;display:inline-flex;align-items:center;gap:.3rem;}',
    '.nav-admin-btn:hover{background:#B22234;color:#fff;border-color:#B22234;}',
    '.nav-admin-btn.logged-in{background:rgba(40,167,69,.1);border-color:rgba(40,167,69,.4);color:#1a7a2e;}',
    '.nav-admin-btn.logged-in:hover{background:#28A745;color:#fff;border-color:#28A745;}',
    '#adminEditModal{position:fixed;inset:0;z-index:999998;background:rgba(0,0,0,.5);backdrop-filter:blur(3px);display:none;align-items:center;justify-content:center;padding:1rem;}',
    '#adminEditModal.open{display:flex;}',
    '.aem-card{background:#fff;border-radius:20px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 40px 100px rgba(0,0,0,.3);animation:almSlide .35s cubic-bezier(.4,0,.2,1);}',
    '.aem-header{background:linear-gradient(135deg,#8B1A28,#B22234);padding:1.1rem 1.5rem;border-radius:20px 20px 0 0;display:flex;align-items:center;justify-content:space-between;}',
    '.aem-title{color:#fff;font-size:.95rem;font-weight:700;font-family:Sarabun,sans-serif;}',
    '.aem-close{background:rgba(255,255,255,.15);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:background .15s;}',
    '.aem-close:hover{background:rgba(255,255,255,.3);}',
    '.aem-body{padding:1.5rem;}',
    '.aem-group{margin-bottom:1rem;}',
    '.aem-label{display:block;font-size:.72rem;font-weight:700;color:#5A6478;margin-bottom:.35rem;text-transform:uppercase;letter-spacing:.05em;font-family:Sarabun,sans-serif;}',
    '.aem-input,.aem-textarea{width:100%;border:2px solid #DDE1E7;border-radius:10px;padding:.6rem .9rem;font-size:.9rem;font-family:Sarabun,sans-serif;outline:none;transition:border-color .2s;color:#1A2332;box-sizing:border-box;}',
    '.aem-input:focus,.aem-textarea:focus{border-color:#B22234;box-shadow:0 0 0 3px rgba(178,34,52,.08);}',
    '.aem-textarea{resize:vertical;min-height:80px;}',
    '.aem-footer{padding:1rem 1.5rem;border-top:1px solid #EEE;display:flex;gap:.5rem;justify-content:flex-end;}',
    '.aem-save{padding:.6rem 1.5rem;background:linear-gradient(135deg,#8B1A28,#B22234);color:#fff;border:none;border-radius:10px;font-size:.88rem;font-weight:700;cursor:pointer;font-family:Sarabun,sans-serif;transition:transform .15s;}',
    '.aem-save:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(178,34,52,.35);}',
    '.aem-cancel{padding:.6rem 1.25rem;background:#F5F6F8;color:#5A6478;border:1.5px solid #DDE1E7;border-radius:10px;font-size:.88rem;font-weight:600;cursor:pointer;font-family:Sarabun,sans-serif;}',
    '.aem-cancel:hover{background:#ECEEF2;}',
    '#adminToast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(80px);background:#1A2332;color:#fff;padding:.7rem 1.5rem;border-radius:999px;font-size:.85rem;font-weight:600;z-index:9999999;transition:transform .3s;font-family:Sarabun,sans-serif;white-space:nowrap;}',
    '#adminToast.show{transform:translateX(-50%) translateY(0);}',
    '#adminToast.ok{background:#28A745;}',
    '#adminToast.err{background:#DC3545;}'
  ].join('');

  var _editCallback = null;

  function isAdmin() { return sessionStorage.getItem(SESSION_KEY) === '1'; }

  function doLogin(pw) {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      sessionStorage.setItem('newsAdminAuth', '1');
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('newsAdminAuth');
    location.reload();
  }

  function getLogoPath() {
    var p = window.location.pathname;
    return (p.indexOf('/pages/') !== -1 || p.indexOf('/admin/') !== -1)
      ? '../images/logo 902.png' : 'images/logo 902.png';
  }

  function getAdminPath() {
    var p = window.location.pathname;
    if (p.indexOf('/pages/') !== -1) return '../admin/';
    if (p.indexOf('/admin/') !== -1) return '';
    return 'admin/';
  }

  function injectCSS() {
    var s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function buildLoginModal() {
    var m = document.createElement('div');
    m.id = 'adminLoginModal';
    m.innerHTML =
      '<div class="alm-card">' +
        '<button class="alm-close" onclick="window._adm.closeLogin()"><i class="fa-solid fa-xmark"></i></button>' +
        '<img src="' + getLogoPath() + '" class="alm-logo" alt="Logo">' +
        '<div class="alm-badge">&#x1F512; Admin Only</div>' +
        '<div class="alm-title">&#x0E40;&#x0E02;&#x0E49;&#x0E32;&#x0E2A;&#x0E39;&#x0E48;&#x0E23;&#x0E30;&#x0E1A;&#x0E1A;&#x0E1C;&#x0E39;&#x0E49;&#x0E14;&#x0E39;&#x0E41;&#x0E25;</div>' +
        '<div class="alm-sub">&#x0E01;&#x0E23;&#x0E21;&#x0E17;&#x0E2B;&#x0E32;&#x0E23;&#x0E23;&#x0E32;&#x0E1A; &#x0E59;&#x0E50;&#x0E52; &#x0E23;&#x0E31;&#x0E01;&#x0E29;&#x0E32;&#x0E1E;&#x0E23;&#x0E30;&#x0E2D;&#x0E07;&#x0E04;&#x0E4C;<br>&#x0E40;&#x0E09;&#x0E1E;&#x0E32;&#x0E30;&#x0E1C;&#x0E39;&#x0E49;&#x0E14;&#x0E39;&#x0E41;&#x0E25;&#x0E23;&#x0E30;&#x0E1A;&#x0E1A;&#x0E17;&#x0E35;&#x0E48;&#x0E44;&#x0E14;&#x0E49;&#x0E23;&#x0E31;&#x0E1A;&#x0E2D;&#x0E19;&#x0E38;&#x0E0D;&#x0E32;&#x0E15;</div>' +
        '<input type="password" id="almPwdInput" class="alm-input" placeholder="&#x0E23;&#x0E2B;&#x0E31;&#x0E2A;&#x0E1C;&#x0E48;&#x0E32;&#x0E19; Admin" maxlength="30" autocomplete="current-password" onkeydown="if(event.key===\'Enter\')window._adm.submitLogin()">' +
        '<button class="alm-btn" onclick="window._adm.submitLogin()">&#x1F513; &#x0E40;&#x0E02;&#x0E49;&#x0E32;&#x0E2A;&#x0E39;&#x0E48;&#x0E23;&#x0E30;&#x0E1A;&#x0E1A;</button>' +
        '<div class="alm-err" id="almErr"></div>' +
      '</div>';
    document.body.appendChild(m);
    m.addEventListener('click', function(e){ if(e.target===m) window._adm.closeLogin(); });
  }

  function buildAdminBar() {
    var bar = document.createElement('div');
    bar.id = 'adminBar';
    bar.innerHTML =
      '<div class="abar-left"><div class="abar-pulse"></div>' +
      '<span><i class="fa-solid fa-shield-halved"></i> &#x0E42;&#x0E2B;&#x0E21;&#x0E14;&#x0E41;&#x0E01;&#x0E49;&#x0E44;&#x0E02; Admin</span></div>' +
      '<div class="abar-right">' +
      '<a href="' + getAdminPath() + 'news.html" class="abar-btn abar-btn-ghost">&#x1F4F0; &#x0E08;&#x0E31;&#x0E14;&#x0E01;&#x0E32;&#x0E23;&#x0E02;&#x0E48;&#x0E32;&#x0E27;</a>' +
      '<a href="' + getAdminPath() + 'index.html" class="abar-btn abar-btn-ghost">&#x2699;&#xFE0F; Admin</a>' +
      '<button class="abar-btn abar-btn-white" onclick="window._adm.logout()">&#x0E2D;&#x0E2D;&#x0E01;&#x0E08;&#x0E32;&#x0E01;&#x0E23;&#x0E30;&#x0E1A;&#x0E1A;</button>' +
      '</div>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function buildEditModal() {
    var m = document.createElement('div');
    m.id = 'adminEditModal';
    m.innerHTML =
      '<div class="aem-card">' +
        '<div class="aem-header">' +
          '<div class="aem-title" id="aemTitle">&#x0E41;&#x0E01;&#x0E49;&#x0E44;&#x0E02;&#x0E02;&#x0E49;&#x0E2D;&#x0E21;&#x0E39;&#x0E25;</div>' +
          '<button class="aem-close" onclick="window._adm.closeEdit()"><i class="fa-solid fa-xmark"></i></button>' +
        '</div>' +
        '<div class="aem-body" id="aemBody"></div>' +
        '<div class="aem-footer">' +
          '<button class="aem-cancel" onclick="window._adm.closeEdit()"><i class="fa-solid fa-xmark"></i> ยกเลิก</button>' +
          '<button class="aem-save" onclick="window._adm.saveEdit()"><i class="fa-solid fa-floppy-disk"></i> บันทึก</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);
    m.addEventListener('click', function(e){ if(e.target===m) window._adm.closeEdit(); });
  }

  function buildToast() {
    var t = document.createElement('div');
    t.id = 'adminToast';
    document.body.appendChild(t);
  }

  function buildNavBtn() {
    var navInner = document.querySelector('.navbar-inner');
    if (!navInner) return;
    var btn = document.createElement('button');
    btn.id = 'navAdminBtn';
    btn.className = 'nav-admin-btn';
    btn.style.marginLeft = '.75rem';
    btn.onclick = function() { if(isAdmin()) logout(); else window._adm.openLogin(); };
    updateNavBtn(btn);
    navInner.appendChild(btn);
  }

  function updateNavBtn(btn) {
    btn = btn || document.getElementById('navAdminBtn');
    if (!btn) return;
    if (isAdmin()) {
      btn.className = 'nav-admin-btn logged-in';
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Admin &nbsp;|&nbsp; ออก';
    } else {
      btn.className = 'nav-admin-btn';
      btn.innerHTML = '<i class="fa-solid fa-key"></i> เข้าสู่ระบบ';
    }
  }

  function openLogin() {
    var m = document.getElementById('adminLoginModal');
    if (m) { m.classList.add('open'); setTimeout(function(){ var i=document.getElementById('almPwdInput'); if(i) i.focus(); }, 120); }
  }

  function closeLogin() {
    var m = document.getElementById('adminLoginModal');
    if (m) m.classList.remove('open');
    var i = document.getElementById('almPwdInput'); if(i) i.value = '';
    var e = document.getElementById('almErr'); if(e) e.textContent = '';
  }

  function submitLogin() {
    var inp = document.getElementById('almPwdInput');
    if (!inp) return;
    if (doLogin(inp.value)) {
      closeLogin();
      activateAdminMode();
      showToast('OK', 'ok');
    } else {
      inp.classList.add('error');
      var e = document.getElementById('almErr');
      if (e) e.textContent = 'รหัสผ่านไม่ถูกต้อง';
      setTimeout(function(){ inp.classList.remove('error'); }, 400);
      inp.value = ''; inp.focus();
    }
  }

  function activateAdminMode() {
    document.body.classList.add('admin-active');
    var bar = document.getElementById('adminBar'); if (bar) bar.classList.add('visible');
    updateNavBtn();
  }

  function openEdit(title, fields, onSave) {
    document.getElementById('aemTitle').textContent = title;
    var body = document.getElementById('aemBody');
    body.innerHTML = '';
    fields.forEach(function(f) {
      var g = document.createElement('div'); g.className = 'aem-group';
      var lbl = document.createElement('label'); lbl.className = 'aem-label'; lbl.textContent = f.label;
      g.appendChild(lbl);
      var el;
      if (f.type === 'textarea') {
        el = document.createElement('textarea'); el.className = 'aem-textarea'; el.rows = f.rows || 4;
      } else {
        el = document.createElement('input'); el.type = f.type || 'text'; el.className = 'aem-input';
      }
      el.id = 'aemF_' + f.key; el.value = f.value || '';
      if (f.placeholder) el.placeholder = f.placeholder;
      g.appendChild(el); body.appendChild(g);
    });
    _editCallback = function() {
      var r = {};
      fields.forEach(function(f) { var el=document.getElementById('aemF_'+f.key); if(el) r[f.key]=el.value.trim(); });
      onSave(r);
    };
    document.getElementById('adminEditModal').classList.add('open');
  }

  function closeEdit() { document.getElementById('adminEditModal').classList.remove('open'); _editCallback = null; }
  function saveEdit() { if (_editCallback) { _editCallback(); closeEdit(); } }

  function showToast(msg, type) {
    var t = document.getElementById('adminToast'); if (!t) return;
    t.textContent = msg; t.className = 'show' + (type ? ' '+type : '');
    clearTimeout(t._tid); t._tid = setTimeout(function(){ t.className = ''; }, 3000);
  }

  /* Firebase helpers */
  function isFirebaseOK() {
    var c = window.FIREBASE_CONFIG || {};
    return c.apiKey && !c.apiKey.startsWith('YOUR_');
  }

  function fsLoad(docId, cb) {
    if (!isFirebaseOK()) { if(cb) cb(null); return; }
    Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
    ]).then(function(m) {
      var app; try { app=m[0].getApp('_adm'); } catch(e) { app=m[0].initializeApp(window.FIREBASE_CONFIG,'_adm'); }
      var db=m[1].getFirestore(app);
      m[1].getDoc(m[1].doc(db,'siteContent',docId)).then(function(snap){ 
        if(cb) cb(snap.exists() ? snap.data() : null); 
      }).catch(function(){ if(cb) cb(null); });
    }).catch(function(){ if(cb) cb(null); });
  }

  function fsSave(docId, data, cb) {
    if (!isFirebaseOK()) { showToast('ตั้งค่า Firebase ก่อน', 'err'); return; }
    Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
    ]).then(function(m) {
      var app; try { app=m[0].getApp('_adm'); } catch(e) { app=m[0].initializeApp(window.FIREBASE_CONFIG,'_adm'); }
      var db=m[1].getFirestore(app);
      data._updatedAt = m[1].serverTimestamp();
      m[1].setDoc(m[1].doc(db,'siteContent',docId), data, {merge:true})
        .then(function(){ showToast('บันทึกสำเร็จ ✓', 'ok'); if(cb) cb(); })
        .catch(function(e){ showToast('บันทึกไม่สำเร็จ: '+e.message,'err'); });
    });
  }

  function addEditBtn(labelText, fn, container, prepend) {
    var ctrl = document.createElement('div'); ctrl.className = 'admin-section-controls';
    var btn  = document.createElement('button'); btn.className = 'admin-edit-btn';
    btn.innerHTML = '<i class="fa-solid fa-pen"></i> ' + labelText; btn.onclick = fn;
    ctrl.appendChild(btn);
    if (!container) container = document.querySelector('.section .container') || document.querySelector('.container');
    if (!container) return;
    if (prepend) container.insertBefore(ctrl, container.firstChild);
    else container.appendChild(ctrl);
  }

  /* ── PAGE: INDEX ─────────────────────────────── */
  function initIndex() {
    var newsSection = document.querySelector('#news-section') || document.querySelector('.section');
    addEditBtn('จัดการข่าวสาร', function(){ window.location.href = getAdminPath()+'news.html'; }, newsSection ? newsSection.querySelector('.container') : null, true);
  }

  /* ── PAGE: COMMANDERS ────────────────────────── */
  function initCommanders() {
    var cmdGrid = document.getElementById('cmdGrid');
    if (!cmdGrid) return;
    
    if (isAdmin() && !window.Sortable) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js';
      document.head.appendChild(script);
    }

    fsLoad('commanders', function(data) {
      var list = [];
      if (data && data.list && data.list.length > 0) {
        list = data.list;
      } else {
        document.querySelectorAll('.commander-card').forEach(function(c) {
          var rk=c.querySelector('.commander-rank'),nm=c.querySelector('.commander-name'),ps=c.querySelector('.commander-position'),im=c.querySelector('img');
          list.push({
            rank: rk?rk.textContent.trim():'',
            name: nm?nm.textContent.trim():'',
            position: ps?ps.textContent.trim():'',
            image: im?im.getAttribute('src'):''
          });
        });
      }
      renderCommanders(list);
    });

    function renderCommanders(list) {
      cmdGrid.innerHTML = '';
      list.forEach(function(d, i) {
        var card = document.createElement('div');
        card.className = 'commander-card';
        if (i === 0) card.classList.add('featured');
        card.innerHTML = 
          '<div class="commander-img-wrap"><img src="'+(d.image||'../images/default-avatar.png')+'" alt="'+(d.name||'ผู้บังคับบัญชา')+'"></div>' +
          '<div class="commander-order">'+(i+1)+'</div>' +
          '<div class="commander-body">' +
            '<div class="commander-rank">'+(d.rank||'')+'</div>' +
            '<div class="commander-name">'+(d.name||'')+'</div>' +
            '<div class="commander-position">'+(d.position||'')+'</div>' +
          '</div>';
          
        if (isAdmin()) {
          card.style.cursor = 'grab';
          var ctrl = document.createElement('div');
          ctrl.className = 'admin-section-controls';
          ctrl.style.marginTop = '1rem';
          ctrl.style.justifyContent = 'center';
          
          var editBtn = document.createElement('button');
          editBtn.className = 'admin-edit-btn';
          editBtn.innerHTML = '<i class="fa-solid fa-pen"></i> แก้ไข';
          editBtn.onclick = function() {
            var defaultImg = d.image || '';
            if (defaultImg.startsWith('..')) defaultImg = ''; 
            var fields = [
              {key:'img',label:'ลิงก์รูปภาพ URL',value:d.image&&d.image.includes('http')?d.image:defaultImg,placeholder:'https://...'},
              {key:'r',label:'ยศ',value:d.rank||''},
              {key:'n',label:'ชื่อ',value:d.name||''},
              {key:'p',label:'ตำแหน่ง',value:d.position||''}
            ];
            openEdit('แก้ไขข้อมูลผู้บังคับบัญชา', fields, function(res){
              list[i] = { rank: res.r, name: res.n, position: res.p, image: res.img };
              fsSave('commanders', {list: list}, function(){ renderCommanders(list); });
            });
          };
          
          var delBtn = document.createElement('button');
          delBtn.className = 'admin-edit-btn';
          delBtn.style.color = '#dc3545';
          delBtn.style.borderColor = 'rgba(220,53,69,0.5)';
          delBtn.style.background = 'rgba(220,53,69,0.1)';
          delBtn.innerHTML = '<i class="fa-solid fa-trash"></i> ลบ';
          delBtn.onclick = function() {
            if (confirm('ต้องการลบข้อมูลนี้หรือไม่?')) {
              list.splice(i, 1);
              fsSave('commanders', {list: list}, function(){ renderCommanders(list); });
            }
          };
          
          ctrl.appendChild(editBtn);
          ctrl.appendChild(delBtn);
          card.appendChild(ctrl);
        }
        cmdGrid.appendChild(card);
      });
      
      if (isAdmin()) {
        var addWrap = document.createElement('div');
        addWrap.style.gridColumn = '1 / -1';
        addWrap.style.textAlign = 'center';
        addWrap.style.marginTop = '1.5rem';
        
        var addBtn = document.createElement('button');
        addBtn.className = 'admin-edit-btn';
        addBtn.style.padding = '0.8rem 2rem';
        addBtn.style.fontSize = '1rem';
        addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> เพิ่มผู้บังคับบัญชา';
        addBtn.onclick = function() {
          var fields = [
            {key:'img',label:'ลิงก์รูปภาพ URL',value:'',placeholder:'https://...'},
            {key:'r',label:'ยศ',value:''},
            {key:'n',label:'ชื่อ',value:''},
            {key:'p',label:'ตำแหน่ง',value:''}
          ];
          openEdit('เพิ่มผู้บังคับบัญชา', fields, function(res){
            list.push({ rank: res.r, name: res.n, position: res.p, image: res.img });
            fsSave('commanders', {list: list}, function(){ renderCommanders(list); });
          });
        };
        addWrap.appendChild(addBtn);
        cmdGrid.appendChild(addWrap);
        
        var initSort = function() {
          if (window.Sortable) {
            if (cmdGrid._sortable) cmdGrid._sortable.destroy();
            cmdGrid._sortable = new Sortable(cmdGrid, {
              animation: 150,
              draggable: '.commander-card',
              filter: 'button',
              preventOnFilter: false,
              onEnd: function (evt) {
                if (evt.oldIndex === evt.newIndex) return;
                var movedItem = list.splice(evt.oldIndex, 1)[0];
                list.splice(evt.newIndex, 0, movedItem);
                fsSave('commanders', {list: list}, function(){ renderCommanders(list); });
              }
            });
          } else {
            setTimeout(initSort, 100);
          }
        };
        initSort();
      }
    }
  }

  /* ── PAGE: COMMANDERS HISTORY ────────────────── */
  function initCommandersHistory() {
    var historyContent = document.getElementById('historyContent');
    if (!historyContent) return;

    if (isAdmin() && !window.Sortable) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js';
      document.head.appendChild(script);
    }

    fsLoad('commandersHistory', function(data) {
      var eras = [];
      if (data && data.eras && data.eras.length > 0) {
        eras = data.eras;
      } else {
        var domEras = document.querySelectorAll('.history-era');
        var flatIndex = 0;
        domEras.forEach(function(eraEl) {
          var titleEl = eraEl.querySelector('.history-era-title');
          var title = titleEl ? titleEl.textContent.trim() : 'ยุคอดีต';
          var eraData = { title: title, commanders: [] };
          eraEl.querySelectorAll('.commander-card').forEach(function(c) {
            var rk=c.querySelector('.commander-rank'),nm=c.querySelector('.commander-name'),ps=c.querySelector('.commander-position'),im=c.querySelector('img');
            var d = (data && data.list && data.list[flatIndex]) ? data.list[flatIndex] : null;
            eraData.commanders.push({
              rank: d ? d.rank : (rk?rk.textContent.trim():''),
              name: d ? d.name : (nm?nm.textContent.trim():''),
              position: d ? d.position : (ps?ps.textContent.trim():''),
              image: d ? d.image : (im?im.getAttribute('src'):'')
            });
            flatIndex++;
          });
          eras.push(eraData);
        });
      }
      renderHistory(eras);
    });

    function renderHistory(eras) {
      historyContent.innerHTML = '';
      
      eras.forEach(function(era, eIdx) {
        var eraDiv = document.createElement('div');
        eraDiv.className = 'history-era';
        
        var title = document.createElement('h2');
        title.className = 'history-era-title';
        title.textContent = era.title;
        eraDiv.appendChild(title);
        
        var grid = document.createElement('div');
        grid.className = 'commanders-grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill,minmax(250px,1fr))';
        
        era.commanders.forEach(function(d, i) {
          var card = document.createElement('div');
          card.className = 'commander-card';
          if (eIdx === eras.length - 1 && i === era.commanders.length - 1) {
            card.classList.add('featured');
          }
          
          card.innerHTML = 
            '<div class="commander-img-wrap"><img src="'+(d.image||'../images/default-avatar.png')+'" alt="'+(d.name||'ผู้บังคับบัญชา')+'"></div>' +
            '<div class="commander-order">'+(i+1)+'</div>' +
            '<div class="commander-body">' +
              '<div class="commander-rank">'+(d.rank||'')+'</div>' +
              '<div class="commander-name">'+(d.name||'')+'</div>' +
              '<div class="commander-position">'+(d.position||'')+'</div>' +
            '</div>';
            
          if (isAdmin()) {
            card.style.cursor = 'grab';
            var ctrl = document.createElement('div');
            ctrl.className = 'admin-section-controls';
            ctrl.style.marginTop = '1rem';
            ctrl.style.justifyContent = 'center';
            
            var editBtn = document.createElement('button');
            editBtn.className = 'admin-edit-btn';
            editBtn.innerHTML = '<i class="fa-solid fa-pen"></i> แก้ไข';
            editBtn.onclick = function() {
              var defaultImg = d.image || '';
              if (defaultImg.startsWith('..')) defaultImg = ''; 
              var fields = [
                {key:'img',label:'ลิงก์รูปภาพ URL',value:d.image&&d.image.includes('http')?d.image:defaultImg,placeholder:'https://...'},
                {key:'r',label:'ยศ',value:d.rank||''},
                {key:'n',label:'ชื่อ',value:d.name||''},
                {key:'p',label:'วาระ',value:d.position||''}
              ];
              openEdit('แก้ไขอดีตผู้บังคับการ', fields, function(res){
                era.commanders[i] = { rank: res.r, name: res.n, position: res.p, image: res.img };
                fsSave('commandersHistory', {eras: eras}, function(){ renderHistory(eras); });
              });
            };
            
            var delBtn = document.createElement('button');
            delBtn.className = 'admin-edit-btn';
            delBtn.style.color = '#dc3545';
            delBtn.style.borderColor = 'rgba(220,53,69,0.5)';
            delBtn.style.background = 'rgba(220,53,69,0.1)';
            delBtn.innerHTML = '<i class="fa-solid fa-trash"></i> ลบ';
            delBtn.onclick = function() {
              if (confirm('ต้องการลบข้อมูลนี้หรือไม่?')) {
                era.commanders.splice(i, 1);
                fsSave('commandersHistory', {eras: eras}, function(){ renderHistory(eras); });
              }
            };
            
            ctrl.appendChild(editBtn);
            ctrl.appendChild(delBtn);
            card.appendChild(ctrl);
          }
          grid.appendChild(card);
        });
        
        eraDiv.appendChild(grid);
        
        if (isAdmin()) {
          var addWrap = document.createElement('div');
          addWrap.style.gridColumn = '1 / -1';
          addWrap.style.textAlign = 'center';
          addWrap.style.marginTop = '1.5rem';
          
          var addBtn = document.createElement('button');
          addBtn.className = 'admin-edit-btn';
          addBtn.style.padding = '0.6rem 1.5rem';
          addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> เพิ่มผู้บังคับการ (' + era.title + ')';
          addBtn.onclick = function() {
            var fields = [
              {key:'img',label:'ลิงก์รูปภาพ URL',value:'',placeholder:'https://...'},
              {key:'r',label:'ยศ',value:''},
              {key:'n',label:'ชื่อ',value:''},
              {key:'p',label:'วาระ',value:''}
            ];
            openEdit('เพิ่มอดีตผู้บังคับการ', fields, function(res){
              era.commanders.push({ rank: res.r, name: res.n, position: res.p, image: res.img });
              fsSave('commandersHistory', {eras: eras}, function(){ renderHistory(eras); });
            });
          };
          addWrap.appendChild(addBtn);
          grid.appendChild(addWrap);
          
          var initSort = function() {
            if (window.Sortable) {
              if (grid._sortable) grid._sortable.destroy();
              grid._sortable = new Sortable(grid, {
                animation: 150,
                draggable: '.commander-card',
                filter: 'button',
                preventOnFilter: false,
                onEnd: function (evt) {
                  if (evt.oldIndex === evt.newIndex) return;
                  var movedItem = era.commanders.splice(evt.oldIndex, 1)[0];
                  era.commanders.splice(evt.newIndex, 0, movedItem);
                  fsSave('commandersHistory', {eras: eras}, function(){ renderHistory(eras); });
                }
              });
            } else {
              setTimeout(initSort, 100);
            }
          };
          initSort();
        }
        
        historyContent.appendChild(eraDiv);
      });
    }
  }

  /* ── PAGE: ABOUT ─────────────────────────────── */
  function initAbout() {
    fsLoad('about',function(data){
      if(data.heading){ var h=document.querySelector('.about-intro h2'); if(h) h.textContent=data.heading; }
      if(data.body){ var b=document.querySelector('.about-intro>div>p'); if(b) b.textContent=data.body; }
      if(data.mission){ var mp=document.querySelector('.mission-p'); if(mp) mp.textContent=data.mission; }
      
      if(data.timeline){
        var items = document.querySelectorAll('.timeline-item');
        data.timeline.forEach(function(d,i){
          if(!items[i]) return;
          var y=items[i].querySelector('.timeline-year'), t=items[i].querySelector('.timeline-title'), dc=items[i].querySelector('.timeline-desc');
          if(y&&d.year) y.innerHTML=d.year;
          if(t&&d.title) t.textContent=d.title;
          if(dc&&d.desc) dc.innerHTML=d.desc;
        });
      }
    });

    addEditBtn('แก้ไขข้อมูลหน่วย', function(){
      var h=document.querySelector('.about-intro h2'), b=document.querySelector('.about-intro>div>p'), mp=document.querySelector('.mission-p');
      openEdit('แก้ไขข้อมูลหน่วย',[
        {key:'heading',label:'ชื่อหน่วย/หัวเรื่อง',value:h?h.textContent.trim():''},
        {key:'body',label:'คำอธิบายหน่วย',value:b?b.textContent.trim():'',type:'textarea',rows:5},
        {key:'mission',label:'ภารกิจหลัก',value:mp?mp.textContent.trim():'',type:'textarea',rows:4}
      ],function(d){
        if(h) h.textContent=d.heading; if(b) b.textContent=d.body; if(mp) mp.textContent=d.mission;
        fsSave('about',d,null);
      });
    },null,true);

    var timelineContainer = document.querySelector('.timeline');
    if (timelineContainer) {
      addEditBtn('แก้ไขเส้นทางประวัติศาสตร์หน่วย', function(){
        var items=document.querySelectorAll('.timeline-item'), fields=[];
        items.forEach(function(c,i){
          var y=c.querySelector('.timeline-year'),t=c.querySelector('.timeline-title'),dc=c.querySelector('.timeline-desc');
          fields.push({key:'y'+i,label:'ปี (#'+(i+1)+')',value:y?y.innerHTML.trim():''});
          fields.push({key:'t'+i,label:'เหตุการณ์ (#'+(i+1)+')',value:t?t.textContent.trim():''});
          fields.push({key:'d'+i,label:'รายละเอียด (#'+(i+1)+')',value:dc?dc.innerHTML.trim():'',type:'textarea',rows:3});
        });
        openEdit('แก้ไขเส้นทางประวัติศาสตร์หน่วย',fields,function(d){
          var list=[];
          items.forEach(function(c,i){
            var y=c.querySelector('.timeline-year'),t=c.querySelector('.timeline-title'),dc=c.querySelector('.timeline-desc');
            if(y) y.innerHTML=d['y'+i]; if(t) t.textContent=d['t'+i]; if(dc) dc.innerHTML=d['d'+i];
            list.push({year:d['y'+i],title:d['t'+i],desc:d['d'+i]});
          });
          fsLoad('about',function(ex){ var c=ex||{}; c.timeline=list; fsSave('about',c,null); });
        });
      }, timelineContainer.parentElement, false);
    }
  }

  /* ── PAGE: CONTACT ───────────────────────────── */
  function initContact() {
    fsLoad('contact',function(data){
      var items=document.querySelectorAll('.contact-item');
      if(data.address&&items[0]){ var d=items[0].querySelector('[style*="875rem"]'); if(d) d.innerHTML=data.address; }
      if(data.phone1&&items[1]){ var a=items[1].querySelector('a:first-of-type'); if(a){a.textContent=data.phone1;a.href='tel:'+data.phone1.replace(/[^0-9]/g,'');} }
      if(data.phone2&&items[1]){ var a2=items[1].querySelectorAll('a'); if(a2[1]){a2[1].textContent=data.phone2;a2[1].href='tel:'+data.phone2.replace(/[^0-9]/g,'');} }
      if(data.fax&&items[2]){ var f=items[2].querySelector('[style*="875rem"]'); if(f) f.textContent=data.fax; }
      if(data.email&&items[3]){ var em=items[3].querySelector('a'); if(em){em.textContent=data.email;em.href='mailto:'+data.email;} }
    });
    addEditBtn('แก้ไขข้อมูลติดต่อ',function(){
      var items=document.querySelectorAll('.contact-item');
      var addr=items[0]?items[0].querySelector('[style*="875rem"]'):null;
      var ph1=items[1]?items[1].querySelector('a:first-of-type'):null;
      var ph2el=items[1]?items[1].querySelectorAll('a'):null;
      var ph2=ph2el&&ph2el[1]?ph2el[1]:null;
      var fax=items[2]?items[2].querySelector('[style*="875rem"]'):null;
      var em=items[3]?items[3].querySelector('a'):null;
      openEdit('แก้ไขข้อมูลติดต่อ',[
        {key:'address',label:'ที่อยู่',value:addr?addr.innerText.replace(/\n/g,' '):'',type:'textarea',rows:3},
        {key:'phone1',label:'โทรศัพท์ 1 (กองบังคับการ)',value:ph1?ph1.textContent.trim():''},
        {key:'phone2',label:'โทรศัพท์ 2 (ประชาสัมพันธ์)',value:ph2?ph2.textContent.trim():''},
        {key:'fax',label:'โทรสาร',value:fax?fax.textContent.trim():''},
        {key:'email',label:'อีเมล',value:em?em.textContent.trim():'',type:'email'}
      ],function(d){
        if(addr) addr.innerHTML=d.address.replace(/\n/g,'<br>');
        if(ph1){ph1.textContent=d.phone1;ph1.href='tel:'+d.phone1.replace(/[^0-9]/g,'');}
        if(ph2){ph2.textContent=d.phone2;ph2.href='tel:'+d.phone2.replace(/[^0-9]/g,'');}
        if(fax) fax.textContent=d.fax;
        if(em){em.textContent=d.email;em.href='mailto:'+d.email;}
        fsSave('contact',d,null);
      });
    },null,true);
  }
  function initQueensTiger() {
    fsLoad('queensTiger', function(data) {
      var qtData = data || {
        banner: '',
        phases: [
          { title: '๑. ภาคปรับสภาพร่างกายและจิตใจ (๔ สัปดาห์)', image: '' },
          { title: '๒. ภาคป่า-ภูเขา (๔ สัปดาห์)', image: '' },
          { title: '๓. ภาคทะเล (๓ สัปดาห์)', image: '' },
          { title: '๔. ภาคปฏิบัติการในเมือง (๓ สัปดาห์)', image: '' },
          { title: '๕. ภาคอากาศ (๒ สัปดาห์)', image: '' }
        ],
        youtube: [
          { code: '' },
          { code: '' },
          { code: '' }
        ]
      };
      if (!qtData.youtube) qtData.youtube = [{code:''},{code:''},{code:''}];
      if (!qtData.phases || qtData.phases.length !== 5) {
        qtData.phases = [
          { title: '๑. ภาคปรับสภาพร่างกายและจิตใจ (๔ สัปดาห์)', image: '' },
          { title: '๒. ภาคป่า-ภูเขา (๔ สัปดาห์)', image: '' },
          { title: '๓. ภาคทะเล (๓ สัปดาห์)', image: '' },
          { title: '๔. ภาคปฏิบัติการในเมือง (๓ สัปดาห์)', image: '' },
          { title: '๕. ภาคอากาศ (๒ สัปดาห์)', image: '' }
        ];
      } else {
        qtData.phases[0].title = '๑. ภาคปรับสภาพร่างกายและจิตใจ (๔ สัปดาห์)';
        qtData.phases[1].title = '๒. ภาคป่า-ภูเขา (๔ สัปดาห์)';
        qtData.phases[2].title = '๓. ภาคทะเล (๓ สัปดาห์)';
        qtData.phases[3].title = '๔. ภาคปฏิบัติการในเมือง (๓ สัปดาห์)';
        qtData.phases[4].title = '๕. ภาคอากาศ (๒ สัปดาห์)';
      }
      renderQueensTiger(qtData);
    });
  }

  function renderQueensTiger(data) {
    var banner = document.getElementById('qt-banner');
    var phasesC = document.getElementById('qt-phases-container');
    var youtubeC = document.getElementById('qt-youtube-container');
    if (!banner || !phasesC || !youtubeC) return;

    // Render Banner
    banner.style.backgroundImage = "url('" + (data.banner || '') + "')";
    banner.innerHTML = '';
    if (!data.banner) {
      banner.innerHTML = '<i class="fa-solid fa-image" style="font-size:3.5rem;margin-bottom:1rem;color:rgba(255,255,255,0.3);"></i><span style="font-size:1.2rem;font-weight:600;margin-bottom:0.5rem;">[ รูปแบนเนอร์หลักสูตร ]</span>';
    }
    if (isAdmin()) {
      var editBannerBtn = document.createElement('button');
      editBannerBtn.className = 'admin-edit-btn';
      editBannerBtn.style.position = 'absolute';
      editBannerBtn.style.top = '10px';
      editBannerBtn.style.right = '10px';
      editBannerBtn.innerHTML = '<i class="fa-solid fa-pen"></i> แก้ไขแบนเนอร์';
      editBannerBtn.onclick = function() {
        openEdit('แก้ไขแบนเนอร์', [{key:'banner',label:'URL รูปแบนเนอร์',value:data.banner||''}], function(r){
          data.banner = r.banner;
          fsSave('queensTiger', data, function(){ renderQueensTiger(data); });
        });
      };
      banner.appendChild(editBannerBtn);
    }

    // Render Phases
    phasesC.innerHTML = '';
    if (isAdmin()) {
      var phaseAdmin = document.createElement('div');
      phaseAdmin.style.position = 'absolute'; phaseAdmin.style.top = '-40px'; phaseAdmin.style.right = '0';
      var editPhasesBtn = document.createElement('button');
      editPhasesBtn.className = 'admin-edit-btn';
      editPhasesBtn.innerHTML = '<i class="fa-solid fa-pen"></i> แก้ไขภาพทั้ง 5 ภาค';
      editPhasesBtn.onclick = function() {
        var fields = [];
        data.phases.forEach(function(p, i) {
          fields.push({key:'p'+i, label:'ภาพ ' + p.title, value:p.image||''});
        });
        openEdit('แก้ไขภาพการฝึก', fields, function(r){
          data.phases.forEach(function(p, i) { p.image = r['p'+i]; });
          fsSave('queensTiger', data, function(){ renderQueensTiger(data); });
        });
      };
      phaseAdmin.appendChild(editPhasesBtn);
      phasesC.appendChild(phaseAdmin);
    }
    data.phases.forEach(function(p) {
      var div = document.createElement('div');
      div.style.cssText = 'background:#fff; border:1px solid var(--color-border); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-sm);';
      var imgDiv = document.createElement('div');
      imgDiv.style.cssText = 'width:100%; height:180px; background:#e2e8f0; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#64748b; text-align:center; padding:1rem; background-size:cover; background-position:center; background-image:url(\''+(p.image||'')+'\');';
      if (!p.image) imgDiv.innerHTML = '<i class="fa-solid fa-image" style="font-size:2rem; margin-bottom:.75rem; opacity:0.5;"></i><span style="font-size:.9rem; font-weight:600;">[ ไม่มีรูปภาพ ]</span>';
      var titleDiv = document.createElement('div');
      titleDiv.style.cssText = 'padding:1.25rem; text-align:center;';
      titleDiv.innerHTML = '<h4 style="color:var(--color-text-dark); margin:0; font-size:1.1rem;">'+p.title+'</h4>';
      div.appendChild(imgDiv);
      div.appendChild(titleDiv);
      phasesC.appendChild(div);
    });

    // Render YouTube
    youtubeC.innerHTML = '';
    if (isAdmin()) {
      var ytAdmin = document.createElement('div');
      ytAdmin.style.position = 'absolute'; ytAdmin.style.top = '-40px'; ytAdmin.style.right = '0';
      var editYtBtn = document.createElement('button');
      editYtBtn.className = 'admin-edit-btn';
      editYtBtn.innerHTML = '<i class="fa-solid fa-pen"></i> แก้ไขวิดีโอ';
      editYtBtn.onclick = function() {
        var fields = [];
        data.youtube.forEach(function(y, i) {
          fields.push({key:'y'+i, label:'ลิงก์ YouTube ที่ ' + (i+1), value:y.code||'', type:'textarea', rows:2});
        });
        openEdit('แก้ไขวิดีโอ YouTube', fields, function(r){
          data.youtube.forEach(function(y, i) { y.code = r['y'+i]; });
          fsSave('queensTiger', data, function(){ renderQueensTiger(data); });
        });
      };
      ytAdmin.appendChild(editYtBtn);
      youtubeC.appendChild(ytAdmin);
    }
    data.youtube.forEach(function(y, i) {
      var div = document.createElement('div');
      div.style.cssText = 'background:#fff; border:1px solid var(--color-border); border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-sm);';
      var frameDiv = document.createElement('div');
      frameDiv.style.cssText = 'width:100%; aspect-ratio:16/9; background:#1A2332; display:flex; flex-direction:column; align-items:center; justify-content:center; color:rgba(255,255,255,0.7); text-align:center; overflow:hidden;';
      if (y.code) {
        var videoId = null;
        var code = y.code.trim();
        if (code.toLowerCase().indexOf('<iframe') !== -1) {
           frameDiv.innerHTML = code;
        } else {
           var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
           var match = code.match(regExp);
           if (match && match[2].length === 11) {
               videoId = match[2];
           } else if (code.length === 11) {
               videoId = code;
           }
           if (videoId) {
               frameDiv.innerHTML = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + videoId + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="border:none;"></iframe>';
           } else {
               frameDiv.innerHTML = '<div style="padding:1rem;word-break:break-all;">' + code + '</div>';
           }
        }
        var iframe = frameDiv.querySelector('iframe');
        if (iframe) { iframe.style.width = '100%'; iframe.style.height = '100%'; iframe.style.maxWidth = '100%'; iframe.style.border = 'none'; }
      } else {
        frameDiv.innerHTML = '<i class="fa-brands fa-youtube" style="font-size:3.5rem; margin-bottom:1rem; color:rgba(255,0,0,0.7);"></i><span style="font-size:1.1rem; font-weight:600;">[ วิดีโอที่ '+(i+1)+' ]</span>';
      }
      div.appendChild(frameDiv);
      youtubeC.appendChild(div);
    });
  }

  function init() {
    injectCSS();
    buildLoginModal();
    buildAdminBar();
    buildEditModal();
    buildToast();
    buildNavBtn();
    if (isAdmin()) activateAdminMode();

    var path = window.location.pathname;
    if      (path.indexOf('commanders-history.html')!=-1) initCommandersHistory();
    else if (path.indexOf('commanders.html')!=-1 && path.indexOf('history')==-1) initCommanders();
    else if (path.indexOf('about.html')!=-1) initAbout();
    else if (path.indexOf('contact.html')!=-1) initContact();
    else if (path.indexOf('queens-tiger.html')!=-1) initQueensTiger();
    else if (path.indexOf('index.html')!=-1 || path.endsWith('/') || path==='' || path.endsWith('/902 Project/')) initIndex();
  }

  window._adm = {
    openLogin:  function(){ openLogin(); },
    closeLogin: function(){ closeLogin(); },
    submitLogin:function(){ submitLogin(); },
    logout:     function(){ logout(); },
    closeEdit:  function(){ closeEdit(); },
    saveEdit:   function(){ saveEdit(); },
    showToast:  function(m,t){ showToast(m,t); },
    isAdmin:    function(){ return isAdmin(); }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
