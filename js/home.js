/* ============================================================
   home.js — Homepage Firebase Logic (Banners, Pride, News, Modals)
   กรมทหารราบ ๙๐๒ รักษาพระองค์
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


/* ── Firebase Initialization ─────────────────────────────── */

const firebaseConfig = window.FIREBASE_CONFIG;
let app, db, storage;

if (!firebaseConfig.apiKey.startsWith('YOUR_')) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);

    await loadBanners(db);
    await loadPride(db);
    await loadNews(db);

  } catch (e) {
    console.error("Firebase Initialization Error:", e);
    const skeleton = document.getElementById('prSkeleton');
    if (skeleton) {
      skeleton.textContent = 'ไม่สามารถโหลดข้อมูลได้ (ตั้งค่า Firebase ไม่ถูกต้อง)';
    }
  }
}


/* ── 1. Load Banners ─────────────────────────────────────── */

async function loadBanners(db) {
  const bannersRef = doc(db, 'siteContent', 'banners');
  const snap = await getDoc(bannersRef);

  if (!snap.exists()) return;

  const data = snap.data();
  ['banner-1', 'banner-2', 'banner-3'].forEach(id => {
    if (!data[id]) return;
    const b = data[id];
    const imgEl = document.getElementById(id + '-img');
    const linkEl = document.getElementById(id + '-link');
    if (imgEl && b.imageUrl) imgEl.src = b.imageUrl;
    if (linkEl && b.targetUrl) linkEl.href = b.targetUrl;
  });
}


/* ── 2. Load Pride Section ───────────────────────────────── */

async function loadPride(db) {
  const prideRef = doc(db, 'siteContent', 'pride');
  const snap = await getDoc(prideRef);

  if (!snap.exists()) return;

  const data = snap.data();
  ['pride-1', 'pride-2', 'pride-3', 'pride-4'].forEach(id => {
    if (!data[id]) return;
    const p = data[id];
    const frameEl = document.getElementById(id + '-frame');
    const imgEl = document.getElementById(id + '-img');

    if (p.imageUrl) {
      if (p.imageUrl.includes('youtube.com/embed/')) {
        if (frameEl) { frameEl.src = p.imageUrl; frameEl.style.display = 'block'; }
        if (imgEl) { imgEl.style.display = 'none'; }
      } else {
        if (imgEl) { imgEl.src = p.imageUrl; imgEl.style.display = 'block'; }
        if (frameEl) { frameEl.style.display = 'none'; }
      }
    }
  });
}


/* ── 3. Load PR News ─────────────────────────────────────── */

async function loadNews(db) {
  const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'), limit(20));
  const snap = await getDocs(q);

  document.getElementById('prSkeleton').style.display = 'none';

  if (snap.empty) {
    document.getElementById('prList').outerHTML =
      '<div style="text-align:center;color:#666;">ยังไม่มีข่าวประชาสัมพันธ์</div>';
    return;
  }

  window._homeNewsData = {};
  let prHtml = '';
  let count = 0;

  snap.forEach(docSnap => {
    const n = { id: docSnap.id, ...docSnap.data() };
    const fullDt = n.publishedAt?.toDate
      ? n.publishedAt.toDate().toLocaleDateString('th-TH', {
          day: 'numeric', month: 'long', year: 'numeric'
        })
      : (n.date || '');

    n.formattedDate = fullDt;
    window._homeNewsData[n.id] = n;

    prHtml += `
      <div class="news-4col-item" onclick="openNewsModal('${n.id}')" style="cursor:pointer;">
        ${n.imageUrl ? `<img src="${n.imageUrl}" class="news-4col-thumb" alt="news thumbnail">` : ''}
        <div class="news-4col-title" title="${n.title}">${n.title}</div>
        <div class="news-4col-date">${fullDt}</div>
      </div>
    `;
    count++;
  });

  if (count === 0) {
    prHtml = '<div style="text-align:center;color:#666;">ยังไม่มีข่าวประชาสัมพันธ์</div>';
  }

  const prListElem = document.getElementById('prList');
  if (prListElem) {
    prListElem.innerHTML = prHtml;
    prListElem.style.display = 'grid';
  }
}


/* ── 4. Media Edit Modal Logic ───────────────────────────── */

window.openMediaEdit = function (mediaId, collectionName, titleText) {
  document.getElementById('editMediaId').value = mediaId;
  document.getElementById('editMediaCollection').value = collectionName;
  document.getElementById('mediaEditTitle').textContent = titleText || 'แก้ไขสื่อ';
  document.getElementById('editMediaFile').value = '';
  document.getElementById('editMediaUrl').value = '';
  document.getElementById('editMediaLink').value = '';

  // Pre-fill existing data
  const imgEl = document.getElementById(mediaId + '-img');
  const frameEl = document.getElementById(mediaId + '-frame');
  const linkEl = document.getElementById(mediaId + '-link');

  if (frameEl && frameEl.style.display !== 'none' && frameEl.src) {
    document.getElementById('editMediaUrl').value = frameEl.src;
  } else if (imgEl && imgEl.src && !imgEl.src.includes('images/banner-') && !imgEl.src.includes('images/pride-')) {
    document.getElementById('editMediaUrl').value = imgEl.src;
  }

  if (linkEl && linkEl.href && linkEl.getAttribute('href') !== '#') {
    document.getElementById('editMediaLink').value = linkEl.getAttribute('href');
  }

  document.getElementById('mediaEditModal').style.display = 'flex';
};

window.closeMediaEdit = function () {
  document.getElementById('mediaEditModal').style.display = 'none';
};

function convertToEmbedUrl(url) {
  if (!url) return url;
  const youtubeMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  return url;
}

window.saveMediaEdit = async function () {
  if (!db) {
    alert("Firebase is not initialized.");
    return;
  }

  const btn = document.getElementById('saveMediaBtn');
  btn.textContent = 'กำลังบันทึก...';
  btn.disabled = true;

  try {
    const mediaId = document.getElementById('editMediaId').value;
    const collName = document.getElementById('editMediaCollection').value || 'banners';
    const fileInput = document.getElementById('editMediaFile');
    let finalUrl = document.getElementById('editMediaUrl').value;
    const targetLink = document.getElementById('editMediaLink').value;

    // Handle File Upload
    if (fileInput.files && fileInput.files.length > 0 && storage) {
      const file = fileInput.files[0];
      const ext = file.name.split('.').pop();
      const path = `${collName}/${mediaId}_${Date.now()}.${ext}`;
      const storageRef = ref(storage, path);

      const uploadTask = uploadBytes(storageRef, file);
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Upload timeout (Storage might not be enabled)')), 10000)
      );
      await Promise.race([uploadTask, timeout]);
      finalUrl = await getDownloadURL(storageRef);
    }

    if (!finalUrl) {
      alert("กรุณาอัปโหลดรูปหรือใส่ลิงก์ URL");
      btn.textContent = 'บันทึกข้อมูล';
      btn.disabled = false;
      return;
    }

    // Convert YouTube links to embed format
    finalUrl = convertToEmbedUrl(finalUrl);

    // Save to Firestore
    const mediaRef = doc(db, 'siteContent', collName);
    await setDoc(mediaRef, {
      [mediaId]: {
        imageUrl: finalUrl,
        targetUrl: targetLink,
        updatedAt: serverTimestamp()
      }
    }, { merge: true });

    // Update DOM
    const imgEl = document.getElementById(mediaId + '-img');
    const frameEl = document.getElementById(mediaId + '-frame');
    const linkEl = document.getElementById(mediaId + '-link');

    if (finalUrl.includes('youtube.com/embed/')) {
      if (frameEl) { frameEl.src = finalUrl; frameEl.style.display = 'block'; }
      if (imgEl) { imgEl.style.display = 'none'; }
    } else {
      if (imgEl) { imgEl.src = finalUrl; imgEl.style.display = 'block'; }
      if (frameEl) { frameEl.style.display = 'none'; }
    }

    if (linkEl) linkEl.href = targetLink || '#';

    window.closeMediaEdit();
    if (window._adm) window._adm.showToast('บันทึกสำเร็จ', 'ok');

  } catch (e) {
    console.error("Error saving media:", e);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + e.message);
  } finally {
    btn.textContent = 'บันทึกข้อมูล';
    btn.disabled = false;
  }
};


/* ── 5. News Modal Logic ─────────────────────────────────── */

window.openNewsModal = function (id) {
  const n = window._homeNewsData[id];
  if (!n) return;

  const img = document.getElementById('modalImg');
  if (n.imageUrl) {
    img.src = n.imageUrl;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }

  document.getElementById('modalCat').textContent = n.category || 'ข่าวหน่วย';
  document.getElementById('modalDate').textContent = ` ${n.formattedDate}`;
  document.getElementById('modalTitle').textContent = n.title || '';
  document.getElementById('modalText').textContent = n.content || '';

  const link = document.getElementById('modalLink');
  if (n.link) {
    link.href = n.link;
    link.style.display = 'inline-flex';
  } else {
    link.style.display = 'none';
  }

  const modal = document.getElementById('newsModal');
  modal.style.opacity = '1';
  modal.style.pointerEvents = 'auto';
  document.getElementById('newsModalContent').style.transform = 'translateY(0)';
  document.body.style.overflow = 'hidden';
};

window.closeNewsModal = function () {
  const modal = document.getElementById('newsModal');
  modal.style.opacity = '0';
  modal.style.pointerEvents = 'none';
  document.getElementById('newsModalContent').style.transform = 'translateY(20px)';
  document.body.style.overflow = '';
};
