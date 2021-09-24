import { randomData } from './randomData';

export const state = {
  itemsCounter: 1,
  itemsIdManager: {
    currItemId: 0,
    IdsArray: [],
  },
  invoiceArray: [],
  clickedInvoice: '',
};

export function getDataFromLocaleStorage() {
  const x = JSON.parse(localStorage.getItem('invoices'));

  if (!x) return;

  state.invoiceArray = x;
}

export function checkIfValid(elIdtoCheck) {
  const formElToVerify = document.querySelector(`#${elIdtoCheck}`);

  const scroolOptions = {
    behavior: 'smooth',
    block: 'end',
    inline: 'nearest',
  };

  const borderStyle = '2px red solid';

  function actionsWhenErrorOccurs(errorMsg) {
    formElToVerify.style.border = borderStyle;
    formElToVerify.scrollIntoView(scroolOptions);
    formElToVerify.focus();
    formElToVerify.value = '';
    formElToVerify.placeholder = errorMsg;
  }

  if (!formElToVerify.value.trim()) {
    actionsWhenErrorOccurs('This field cannot be empty');
    return false;
  }

  if (formElToVerify.value.trim().length <= 2) {
    actionsWhenErrorOccurs('Data is too short!');
    return false;
  }

  formElToVerify.style.border = '';
  return true;
}

export function captureDataFromForm(form_ID, inv_ID) {
  const data = new FormData(form_ID);
  const invoice = Object.fromEntries(data);
  invoice.status = 'pending';
  invoice.cl_invoice_date = invoice.cl_invoice_date || current_date();
  invoice.id = inv_ID;
  invoice.itemsContainer = createItemsContainer(invoice);
  invoice.addedItems = invoice.itemsContainer.length;
  invoice.total = calcTotal(invoice);

  return invoice;
}

export function createInvoiceID() {
  const date_in_num = String(Date.now(new Date()));

  const id = `#INV${date_in_num.slice(6, 9)}X${date_in_num.slice(11, 13)}`;
  return id;
}

export function current_date() {
  const currentDate = new Date();
  const day = `${currentDate.getDate()}`.padStart(2, 0);
  const month = `${currentDate.getMonth() + 1}`.padStart(2, 0);
  const year = currentDate.getFullYear();

  let payment_date = `${day}.${month}.${year}`;

  return payment_date;
}

function createItemsContainer(invoiceObject) {
  const itemsName = Object.entries(invoiceObject)
    .filter(item => item[0].includes('item_name'))
    .map(item => item[1]);
  const itemsQuan = Object.entries(invoiceObject)
    .filter(item => item[0].includes('item_quan'))
    .map(item => item[1]);
  const itemsPrice = Object.entries(invoiceObject)
    .filter(item => item[0].includes('item_price'))
    .map(item => item[1]);
  const itemsTotal = Object.entries(invoiceObject)
    .filter(item => item[0].includes('item_total'))
    .map(item => item[1]);

  const mainArray = [];

  for (let repeat = 0; repeat < itemsName.length; repeat++) {
    mainArray.push([
      itemsName[repeat],
      itemsQuan[repeat],
      itemsPrice[repeat],
      itemsTotal[repeat],
    ]);
  }
  return mainArray;
}

function calcTotal(invoice) {
  const addedItems = invoice.addedItems;
  let repeat = 1;
  const sum = [];
  while (addedItems >= repeat) {
    let value = invoice.itemsContainer[repeat - 1][3];

    sum.push(parseFloat(value));
    repeat++;
  }
  const total = sum.reduce((acc, curr) => acc + curr, 0);
  return total;
}

export function cancelSubmitFormResetState() {
  state.itemsCounter = 1;
  state.itemsIdManager.currItemId = 0;
  state.itemsIdManager.IdsArray = [];
}

export function createId() {
  const idPartOne = Number(Math.trunc(Math.random() * 999));
  const idPartTwo = String(Date.now()).slice(6);
  state.itemsIdManager.currItemId = idPartOne + idPartTwo;

  const checkIfNumberExist = state.itemsIdManager.IdsArray.some(
    el => el === state.itemsIdManager.currItemId
  );

  if (!checkIfNumberExist)
    state.itemsIdManager.IdsArray.push(state.itemsIdManager.currItemId);
  else {
    state.itemsIdManager.IdsArray.push(state.itemsIdManager.currItemId + 999);
    return state.itemsIdManager.currItemId;
  }
  return state.itemsIdManager.currItemId;
}

export function addedItemsDataValidation() {
  // The itemsConArray contains each item that was added by 'Add New Item' button. Every item row element contains item/service name, quantity, price, total and remove button.
  const itemsConArray = new Array(
    ...document.querySelector('.items__container').children
  );

  const itemHtmlElementsArray = [];

  // If itemsConArray is empty, then function ends execution, because there is no data to validate.
  if (!itemsConArray.length) return true;

  // Here, itemsConArray is looped and on every item row element an array (item/service name, quantity, price, total and remove button) will be created.
  itemsConArray.forEach(el => {
    new Array(...el.children).forEach(el => {
      if (el.children[1]) {
        itemHtmlElementsArray.push(el.children[1]);
      }
    });
  });

  // Helper function
  function actionWhenSthIsInvalid(htmlElement, errorMsg) {
    htmlElement.style.border = '2px red solid';
    htmlElement.value = '';
    htmlElement.placeholder = errorMsg;
  }

  for (const inputEl of itemHtmlElementsArray) {
    if (
      (inputEl.id.includes('item_quan') || inputEl.id.includes('item_price')) &&
      (!inputEl.value.trim() || inputEl.value <= 0)
    ) {
      actionWhenSthIsInvalid(inputEl, 'Invalid data');
      return false;
    }

    if (inputEl.id.includes('item_name') && !inputEl.value.trim()) {
      actionWhenSthIsInvalid(inputEl, 'Name too short');
      return false;
    }

    inputEl.style.border = '';
  }

  return true;
}

export function addRandomData() {
  state.invoiceArray.push(...randomData);

  localStorage.setItem('invoices', JSON.stringify(state.invoiceArray));
}

export function calcPaymentTerm(invoice) {
  const paymentDelay =
    invoice.payment_term === undefined ? 30 : invoice.payment_term;

  const date_2 = Date.now() + paymentDelay * 86400000;
  const new_date = new Date(date_2);

  const day = `${new_date.getDate()}`.padStart(2, 0);
  const month = `${new_date.getMonth() + 1}`.padStart(2, 0);
  const year = new_date.getFullYear();

  let payment_date = `${day}.${month}.${year}`;

  return payment_date;
}
