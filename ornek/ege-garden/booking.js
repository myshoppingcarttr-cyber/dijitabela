const form = document.querySelector('#booking-form');
const prepared = document.querySelector('.prepared');
const messageElement = document.querySelector('#prepared-message');
const whatsapp = document.querySelector('#send-whatsapp');
const feedback = document.querySelector('#booking-feedback');
const panelFeedback = document.querySelector('#panel-feedback');
const panel = document.querySelector('#panel');
const requestList = document.querySelector('#request-list');
const storageKey = 'ege-garden-v2-requests';
const statuses = { pending: 'Bekliyor', accepted: 'Onaylandı', rejected: 'Reddedildi' };
const istanbulTime = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Istanbul', dateStyle: 'short', timeStyle: 'short'
});
const displayDate = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeZone: 'UTC' });
let draft = null;
let requests = readRequests();

function readRequests() {
  try {
    const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(entries) ? entries.filter(item => item && item.status in statuses) : [];
  } catch {
    return [];
  }
}

function storeRequests(entries) {
  requests = entries;
  try {
    localStorage.setItem(storageKey, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

function makeElement(tag, content, className) {
  const element = document.createElement(tag);
  element.textContent = content;
  if (className) element.className = className;
  return element;
}

function dateLabel(value) {
  return displayDate.format(new Date(value + 'T12:00:00Z'));
}

function renderPanel() {
  requestList.replaceChildren();
  if (!requests.length) {
    requestList.append(makeElement('p', 'Henüz talep yok.', 'form-note'));
    return;
  }
  for (const request of requests) {
    const card = makeElement('article', '', 'request-box');
    card.append(makeElement('h3', dateLabel(request.date) + ' · ' + request.time));
    card.append(makeElement('p', request.guests + ' kişi · ' + request.area));
    if (request.note) card.append(makeElement('p', request.note));
    card.append(makeElement('p', 'Durum: ' + statuses[request.status], 'form-note'));
    if (request.status === 'pending') {
      const actions = makeElement('div', '', 'actions');
      for (const [status, label] of [['accepted', 'Onayla'], ['rejected', 'Reddet']]) {
        const button = makeElement('button', label, 'chip');
        button.type = 'button';
        button.dataset.status = status;
        button.dataset.request = request.id;
        actions.append(button);
      }
      card.append(actions);
    }
    requestList.append(card);
  }
}

function setMinimumDate() {
  form.elements.date.min = istanbulTime.format(new Date()).slice(0, 10);
}

setMinimumDate();
renderPanel();

document.querySelector('a[href="#panel"]').addEventListener('click', () => { panel.open = true; });
window.addEventListener('storage', event => {
  if (event.key !== storageKey) return;
  requests = readRequests();
  renderPanel();
});

form.addEventListener('input', () => {
  form.elements.time.setCustomValidity('');
  prepared.hidden = true;
  draft = null;
});

form.addEventListener('submit', event => {
  event.preventDefault();
  setMinimumDate();
  const { date, time, guests, area, note } = Object.fromEntries(new FormData(form));
  if (date + ' ' + time < istanbulTime.format(new Date())) {
    form.elements.time.setCustomValidity('Bugünden ileri bir tarih ve saat seçin veya bugünün kalan saatlerinden birini girin.');
    form.reportValidity();
    return;
  }
  const cleanNote = note.trim();
  draft = { id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()), date, time, guests, area, note: cleanNote, status: 'pending' };
  const lines = [
    'Merhaba, Ege Garden’da bir masa için uygunluk sorabilir miyim?',
    'Tarih: ' + dateLabel(date),
    'Saat: ' + time,
    'Kişi: ' + guests,
    'Alan tercihi: ' + area
  ];
  if (cleanNote) lines.push('Özel gün notu: ' + cleanNote);
  const message = lines.join('\n');
  messageElement.textContent = message;
  whatsapp.href = 'https://wa.me/' + BOOKING_WHATSAPP + '?text=' + encodeURIComponent(message);
  feedback.textContent = '';
  prepared.hidden = false;
  document.querySelector('#prepared-title').focus();
});

whatsapp.addEventListener('click', () => {
  if (!draft || requests.some(item => item.id === draft.id)) return;
  const saved = storeRequests([draft, ...requests]);
  feedback.textContent = saved
    ? 'Örnek talep bu tarayıcıdaki panele eklendi.'
    : 'Talep panelde açık oturum boyunca görünür. Tarayıcı depolaması kullanılamıyor.';
  renderPanel();
});

requestList.addEventListener('click', event => {
  const button = event.target.closest('button[data-status]');
  if (!button) return;
  const saved = storeRequests(requests.map(item =>
    item.id === button.dataset.request && item.status === 'pending'
      ? { ...item, status: button.dataset.status }
      : item
  ));
  renderPanel();
  panelFeedback.textContent = saved ? statuses[button.dataset.status] + '.' : 'Değişiklik yalnızca bu açık oturumda görünüyor.';
  panelFeedback.tabIndex = -1;
  panelFeedback.focus();
});
