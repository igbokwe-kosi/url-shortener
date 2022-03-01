'use strict';
const links = [];

const form = document.querySelector('.form');
const navContainer = document.querySelector('.nav');
const formInputEl = document.querySelector('.form__input');
const resultContainer = document.querySelector('.result__list');
const btnMenu = document.querySelector('.btn--menu');

const copyToClipboard = str => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText)
    return navigator.clipboard.writeText(str);
  return Promise.reject('The Clipboard API is not available.');
};

function render(array, parentElement) {
  const html = array
    .map(
      item => `
  <li class="result__item">
    <span class="result__link">
      ${item.link}
    </span>
    <span class="result__new-link">${item.newLink}</span>
    <button class="result__btn">Copy</button>
  </li>
  `
    )
    .join('');

  parentElement.innerHTML = html;
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  try {
    formInputEl.classList.remove('error');

    const [errorEl] = [...this.children].filter(child =>
      child.classList.contains('error-message')
    );
    errorEl && this.removeChild(errorEl);
    /*  const testURL = 'https://www.freecodecamp.org/learn/'; */
    const getShortLink = async function (url) {
      if (!url) throw new Error(`Please add valid url`);
      const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
      console.log(res);
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const { result } = data;
      // console.log(result.full_short_link);

      return result;
    };

    const link = formInputEl.value;
    const result = await getShortLink(link);
    const newLink = await result.short_link;
    links.push({ link, newLink });
    console.log(links);
    render(links, resultContainer);
  } catch (error) {
    formInputEl.classList.add('error');
    const errorEl = document.createElement('span');
    // console.log(errorEl);
    errorEl.classList.add('error-message');
    errorEl.textContent = error.message;
    this.append(errorEl);
  }
});

resultContainer.addEventListener('click', function (e) {
  if (!e.target.closest('.result__btn')) return;

  const btn = e.target.closest('.result__btn');
  btn.textContent = 'Copied!';
  btn.classList.add('btn--copied');

  copyToClipboard(btn.previousElementSibling.textContent);
});

btnMenu.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('clicked');
  navContainer.classList.toggle('show');

  if (navContainer.classList.contains('show')) {
    btnMenu.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Close</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>
    `;
  }
  if (!navContainer.classList.contains('show')) {
    btnMenu.innerHTML = `
    <svg
    xmlns="http://www.w3.org/2000/svg"
    class="ionicon"
    viewBox="0 0 512 512"
  >
    <title></title>
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-miterlimit="9"
      stroke-width="32"
      d="M80 160h352M80 256h352M80 352h352"
    />
  </svg>
    `;
  }
});

navContainer.addEventListener('click', function (e) {
  if (!e.target.closest('.nav__link')) return;

  this.classList.remove('show');

  if (navContainer.classList.contains('show')) {
    btnMenu.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Close</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>
    `;
  }
  if (!navContainer.classList.contains('show')) {
    btnMenu.innerHTML = `
    <svg
    xmlns="http://www.w3.org/2000/svg"
    class="ionicon"
    viewBox="0 0 512 512"
  >
    <title></title>
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-miterlimit="9"
      stroke-width="32"
      d="M80 160h352M80 256h352M80 352h352"
    />
  </svg>
    `;
  }
});
