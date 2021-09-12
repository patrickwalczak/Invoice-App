import * as DomElements from './domElements.js';

DomElements.filter.addEventListener('click', () => {
  DomElements.arrow.classList.toggle('down');
  DomElements.block_below.classList.toggle('hidden');
});
