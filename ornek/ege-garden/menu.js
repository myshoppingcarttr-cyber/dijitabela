const categories = document.querySelector('#categories');
const search = document.querySelector('#menu-search');
const dishList = document.querySelector('#dishes');
const result = document.querySelector('#menu-result');
const dialog = document.querySelector('#cart');
const cartLines = document.querySelector('#cart-lines');
const cartHeading = document.querySelector('#cart-heading');
const cartTotal = document.querySelector('#cart-total');
const waiter = document.querySelector('#waiter');
const cartButtons = document.querySelectorAll('[data-open-cart]');
const cartSummary = document.querySelectorAll('[data-cart-summary]');
const announcement = document.querySelector('#cart-announcement');
const money = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 2, minimumFractionDigits: 0 });
const cart = new Map();
let activeCategory = -1;
let waiterMode = false;

function normalize(value) {
  return value.trim().toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function button(label, className) {
  const node = element('button', label, className);
  node.type = 'button';
  return node;
}

const catalog = MENU_CATALOG.flatMap((category, categoryIndex) => category.items.map(([title, price, flags, available, options], index) => ({
  id: categoryIndex + '-' + index,
  category: category.name,
  categoryIndex,
  title,
  choices: (options.length ? options : [['', price, available, []]]).map(([label, amount, inStock, tags], optionIndex) => ({
    id: categoryIndex + '-' + index + '-' + optionIndex,
    title: label ? title + ' · ' + label : title,
    label,
    price: amount,
    available: inStock,
    flags: [...new Set([...flags, ...tags])]
  }))
})));
const products = new Map(catalog.flatMap(item => item.choices.map(choice => [choice.id, choice])));
const selectedChoices = new Map();

const flagIcons = {
  spicy: 'M12 22a7 7 0 0 0 7-7c0-3.5-2.5-6-4-7 .1 2-1 3-2 3 0-4-3-7-5-8 1 4-.8 6-2 8-1 1.5-1 3-1 4a7 7 0 0 0 7 7Z',
  allergen: 'M12 8v5m0 3v.2M10.4 4.2 2.8 17.5A1.7 1.7 0 0 0 4.3 20h15.4a1.7 1.7 0 0 0 1.5-2.5L13.6 4.2a1.8 1.8 0 0 0-3.2 0Z'
};

function flagBadge(flag) {
  const kind = flag === 'Acı' ? 'spicy' : 'allergen';
  const badge = element('span', flag);
  const ns = 'http://www.w3.org/2000/svg';
  const icon = document.createElementNS(ns, 'svg');
  const path = document.createElementNS(ns, 'path');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('aria-hidden', 'true');
  path.setAttribute('d', flagIcons[kind]);
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.8');
  path.setAttribute('fill', 'none');
  icon.append(path);
  badge.prepend(icon);
  return badge;
}

function renderProducts() {
  const terms = normalize(search.value).split(/\s+/);
  const matches = catalog.filter(item =>
    (activeCategory === -1 || item.categoryIndex === activeCategory) &&
    terms.every(term => normalize(item.title + ' ' + item.category).includes(term))
  );
  const fragment = document.createDocumentFragment();
  for (const item of matches) {
    const article = element('article', '', 'dish');
    const details = document.createElement('div');
    details.append(element('small', item.category), element('h3', item.title));
    const price = element('span', '', 'dish-price');
    const meta = element('div', '', 'dish-meta');
    const add = button('+ Ekle', 'chip');
    const syncChoice = choice => {
      add.dataset.add = choice.id;
      add.disabled = !choice.available;
      add.textContent = choice.available ? '+ Ekle' : 'Tükendi';
      add.ariaLabel = choice.title + (choice.available ? ' ekle' : ' tükendi');
      price.textContent = choice.price === null ? 'QR menüde' : money.format(choice.price);
      meta.replaceChildren(...choice.flags.map(flagBadge));
      meta.hidden = !choice.flags.length;
    };
    if (item.choices.length > 1) {
      const select = element('select', '', 'portion');
      select.ariaLabel = item.title + ' seçeneği';
      for (const choice of item.choices) {
        const option = element('option', choice.label);
        option.value = choice.id;
        select.append(option);
      }
      select.value = selectedChoices.get(item.id) ?? item.choices[0].id;
      select.addEventListener('change', () => {
        selectedChoices.set(item.id, select.value);
        syncChoice(products.get(select.value));
      });
      details.append(select);
    }
    details.append(price, meta);
    syncChoice(products.get(selectedChoices.get(item.id)) ?? item.choices[0]);
    article.append(details, add);
    fragment.append(article);
  }
  dishList.replaceChildren(fragment);
  result.textContent = matches.length ? matches.length + ' ürün' : 'Bu aramaya uyan ürün bulunamadı.';
}

for (const [index, name] of ['Tümü', ...MENU_CATALOG.map(category => category.name)].entries()) {
  const chip = button(name, 'chip');
  chip.setAttribute('aria-pressed', String(index === 0));
  chip.setAttribute('aria-controls', 'dishes');
  chip.dataset.category = String(index - 1);
  categories.append(chip);
}

function updateCart() {
  let count = 0;
  let total = 0;
  let hasUnpriced = false;
  const focused = document.activeElement;
  cartLines.replaceChildren();
  for (const [id, quantity] of cart) {
    const item = products.get(id);
    count += quantity;
    total += (item.price ?? 0) * quantity;
    hasUnpriced ||= item.price === null;
    const row = document.createElement('li');
    const details = element('div', item.title);
    details.append(element('span', item.price === null ? 'QR menüde' : money.format(item.price * quantity), 'dish-price'));
    const controls = element('div', '', 'quantity');
    const remove = button('−', 'icon-button');
    remove.ariaLabel = item.title + ' azalt';
    remove.dataset.change = '-1';
    remove.dataset.id = id;
    const add = button('+', 'icon-button');
    add.ariaLabel = item.title + ' artır';
    add.dataset.change = '1';
    add.dataset.id = id;
    controls.append(remove, element('span', String(quantity)), add);
    row.append(details, controls);
    cartLines.append(row);
  }
  if (!count) cartLines.append(element('li', 'Listeniz boş.'));
  const cost = hasUnpriced ? 'Fiyatı belli ürünler ' + money.format(total) : money.format(total);
  for (const summary of cartSummary) summary.textContent = count + ' ürün' + (count && !hasUnpriced ? ' · ' + cost : '');
  for (const open of cartButtons) open.disabled = !count;
  cartTotal.textContent = 'Toplam · ' + cost;
  waiter.disabled = !count;
  if (focused?.dataset.change && dialog.open) {
    const next = Array.from(cartLines.querySelectorAll('button')).find(node =>
      node.dataset.id === focused.dataset.id && node.dataset.change === focused.dataset.change
    );
    (next ?? dialog.querySelector('.icon-button')).focus();
  }
}

function changeQuantity(id, delta) {
  const quantity = (cart.get(id) ?? 0) + delta;
  if (quantity > 0) cart.set(id, quantity);
  else cart.delete(id);
  updateCart();
}

function setWaiterMode(value) {
  waiterMode = value;
  dialog.classList.toggle('waiter-mode', value);
  cartHeading.textContent = value ? 'Garsona göster' : 'Masa listesi';
  waiter.textContent = value ? 'Listeyi düzenle' : 'Garsona göster';
}

categories.addEventListener('click', event => {
  const chip = event.target.closest('button[data-category]');
  if (!chip) return;
  categories.querySelector('[aria-pressed="true"]').setAttribute('aria-pressed', 'false');
  chip.setAttribute('aria-pressed', 'true');
  activeCategory = Number(chip.dataset.category);
  renderProducts();
});
search.addEventListener('input', renderProducts);
dishList.addEventListener('click', event => {
  const add = event.target.closest('button[data-add]');
  if (!add) return;
  const id = add.dataset.add;
  changeQuantity(id, 1);
  announcement.textContent = products.get(id).title + ' listeye eklendi. Bu üründen ' + cart.get(id) + ' adet.';
});
cartLines.addEventListener('click', event => {
  const control = event.target.closest('button[data-change]');
  if (control) changeQuantity(control.dataset.id, Number(control.dataset.change));
});
for (const open of cartButtons) open.addEventListener('click', () => {
  setWaiterMode(false);
  dialog.showModal();
});
waiter.addEventListener('click', () => setWaiterMode(!waiterMode));
renderProducts();
