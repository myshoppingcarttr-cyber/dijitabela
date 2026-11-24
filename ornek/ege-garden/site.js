const languageButton = document.querySelector('#language');
const translations = [
  ['data-en', 'textContent'],
  ['data-alt-en', 'alt'],
  ['data-aria-en', 'ariaLabel']
].flatMap(([attribute, property]) =>
  Array.from(document.querySelectorAll('[' + attribute + ']'), element => ({
    element, property, tr: element[property], en: element.getAttribute(attribute)
  }))
);
let english = false;
const mapHolder = document.querySelector('.map');
const mapButton = document.querySelector('#load-map');
document.querySelector('#quick-whatsapp').href = 'https://wa.me/' + BOOKING_WHATSAPP;

languageButton.addEventListener('click', () => {
  english = !english;
  document.documentElement.lang = english ? 'en' : 'tr';
  document.title = english ? 'Ege Garden · Akçay, Türkiye' : 'Ege Garden · Akçay';
  for (const { element, property, tr, en } of translations) element[property] = english ? en : tr;
  languageButton.firstElementChild.innerHTML = english ? 'TR / <b>EN</b>' : '<b>TR</b> / EN';
  languageButton.ariaLabel = english ? 'Türkçeye geç' : 'Switch to English';
  const map = mapHolder.querySelector('iframe');
  if (map) map.title = english ? 'Ege Garden on Google Maps' : 'Google Haritalar’da Ege Garden';
});

mapButton.addEventListener('click', () => {
  const map = document.createElement('iframe');
  map.title = english ? 'Ege Garden on Google Maps' : 'Google Haritalar’da Ege Garden';
  map.referrerPolicy = 'strict-origin-when-cross-origin';
  map.allowFullscreen = true;
  map.src = 'https://www.google.com/maps?q=Ege%20Cafe%20Restaurant%20Ak%C3%A7ay&output=embed';
  mapButton.replaceWith(map);
  map.focus();
});
