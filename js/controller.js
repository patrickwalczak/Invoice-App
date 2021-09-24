import initialView from './initialView.js';
import formView from './formView.js';
import * as model from './model.js';
import addItemView from './addItemView.js';
import invoiceShortView from './invoiceShortView.js';
import invoiceDetailsView from './invoiceDetailsView.js';
import itemRowDetailsView from './itemRowDetailsView.js';
import loadDataButton from './loadDataButton.js';
// ====================================================

// =================================================
// =================================================
// 1. Functions which will be executed while application will be launched. So called, initialization function and event listeners
// =================================================

function init() {
  // Display default view of the application. InitialView contains 'U Invoice' text, filter button, 'new invoice' button, container for invoices and load random data.
  model.getDataFromLocaleStorage();

  initialView.render(
    controlOpeningDetails,
    sortInvoicesByPaid,
    sortInvoicesByPending
  );

  initialView.setHeaderTextValue(model.state.invoiceArray.length);

  initialView.addHandlerToNewInvoiceBtn(formView.render.bind(formView));

  loadDataButton.render(controlLoadingRandomData, checkIfArrayIsEmpty());

  if (!model.state.invoiceArray.length) return;

  model.state.invoiceArray.forEach(inv =>
    invoiceShortView.createInvoiceRow(inv)
  );
}

window.addEventListener('click', e => {
  if (!e.target.closest('.button__add')) return;
  // When 'New Invoice' button is clicked, then the form element is inserted and event listeners can be attached to form's buttons.
  formView.addListenersToForm(
    resetAddedItemsCounter,
    controlSubmitingForm,
    controlAddingItems
  );
  formView.setInvId(model.createInvoiceID.bind(this));
});

window.addEventListener('click', e => {
  if (!e.target.closest('.btn_edit')) return;

  // I want to attach a slightly different callback to save changes in the edited invoice.

  formView.addListenersToForm(
    resetAddedItemsCounter,
    controlSubmitingEditedInvoice,
    controlAddingItems
  );
});

init();

// =================================================
// =================================================

// 2. This function is responsible for providing sample invoices using 'load random data' button in the initialView

function controlLoadingRandomData() {
  // push sample invoices to invoiceArray in the state
  model.addRandomData();

  // before rendering each invoice, clear invoicec container
  invoiceShortView.clear();

  // for each invoice create short view contains id, date, client name, total, status
  model.state.invoiceArray.forEach(inv =>
    invoiceShortView.createInvoiceRow(inv)
  );

  // delete 'load random data' button
  document.querySelector('.loadData').remove();

  // update summary message and information from center, which is displayed when there is no added invoice
  initialView.setHeaderTextValue(model.state.invoiceArray.length);
}

// =================================================
// =================================================

// 3. This function is called after clicking short view of the invoice row and it is responsible for opening details of the clicked invoice
function controlOpeningDetails(clickedInvoiceId) {
  // find invoice in the array and assing it to the state
  const clickedInvoice = model.state.invoiceArray.find(
    inv => inv.id === clickedInvoiceId
  );

  model.state.clickedInvoice = clickedInvoice;

  // This function calculates how many days remain to payment deadline
  const paymentTerm = model.calcPaymentTerm(clickedInvoice);

  // render details view for clicked invoice
  invoiceDetailsView.render(clickedInvoice, paymentTerm);

  // add handlers to invoiceDetailsView's buttons
  invoiceDetailsView.addEventHandlersToButtons(
    controlBackButton,
    controlEditButton,
    controlDeleteButton,
    controlMarkButton
  );

  // render all added items in the invoiceDetailsView
  clickedInvoice.itemsContainer.forEach(item => {
    itemRowDetailsView.render(item);
  });
}

function sortInvoicesByPaid(clickedSortOption, isSorted) {
  if (model.state.invoiceArray.length <= 1) return;

  // by default, isSorted = false;

  // if isSorted = false, then we create shallow copy of the model.state.invoiceArray

  const arrayToSortX = !isSorted
    ? model.state.invoiceArray.slice().sort((a, b) => {
        let fa = a.status.toLowerCase(),
          fb = b.status.toLowerCase();

        const clickedButton = clickedSortOption === 'Paid' ? fa > fb : fa < fb;

        if (clickedButton) {
          return -1;
        }
        if (clickedButton) {
          return 1;
        }
        return 0;
      })
    : '';

  invoiceShortView.clear();
  if (arrayToSortX)
    return arrayToSortX.map(inv => invoiceShortView.createInvoiceRow(inv));

  if (!arrayToSortX) {
    model.state.invoiceArray
      .slice()
      .forEach(inv => invoiceShortView.createInvoiceRow(inv));
  }
}

function sortInvoicesByPending(clickedSortOption, isSorted) {
  if (model.state.invoiceArray.length <= 1) return;

  // by default, isSorted = false;

  // if isSorted = false, then we create shallow copy of the model.state.invoiceArray

  const arrayToSortX = !isSorted
    ? model.state.invoiceArray.slice().sort((a, b) => {
        let fa = a.status.toLowerCase(),
          fb = b.status.toLowerCase();

        const clickedButton =
          clickedSortOption === 'Pending' ? fb > fa : fb < fa;

        if (clickedButton) {
          return -1;
        }
        if (clickedButton) {
          return 1;
        }
        return 0;
      })
    : '';

  invoiceShortView.clear();
  if (arrayToSortX)
    return arrayToSortX.map(inv => invoiceShortView.createInvoiceRow(inv));

  if (!arrayToSortX) {
    model.state.invoiceArray
      .slice()
      .forEach(inv => invoiceShortView.createInvoiceRow(inv));
  }
}

// =======================================
// =======================================

// This function is used by Add New Item button in the form
function controlAddingItems() {
  // create id for each item
  model.createId();

  // render item
  addItemView.render(
    model.state.itemsIdManager.currItemId,
    subtractAddedItemsCounter
  );

  // update the state counter
  model.state.itemsCounter++;
}

// This function is used by Cancel and Add Invoice buttons in the form
function resetAddedItemsCounter() {
  model.cancelSubmitFormResetState();
}

// x button in each item line
// Update itemsCounter when item is removed.
function subtractAddedItemsCounter() {
  model.state.itemsCounter--;
}

function controlSubmitingForm(form_ID, inv_ID, fieldsToCheck) {
  // This function receives 3 arguments.
  // First two are passed to function which create invoice object from input answers.
  // form_ID is an id of the form element to which FormData API should be attached
  // inv_ID is simply a created id for invoice
  // Third argument is an array with input fields that have to be checked
  let isFieldValid = true;

  for (const el of fieldsToCheck) {
    // checkIfValid returns true, if entered data is correct or false if is not
    isFieldValid = model.checkIfValid(el);
    if (!isFieldValid) return false;
  }

  isFieldValid = model.addedItemsDataValidation();

  if (!isFieldValid) return false;

  const newInvoice = model.captureDataFromForm(form_ID, inv_ID);

  model.state.invoiceArray.push(newInvoice);

  // invoiceShortView.createInvoiceRow(newInvoice);

  // initialView.setHeaderTextValue(model.state.invoiceArray.length);

  localStorage.setItem('invoices', JSON.stringify(model.state.invoiceArray));

  init();

  return true;
}

function controlMarkButton() {
  const index = model.state.invoiceArray.indexOf(model.state.clickedInvoice);
  model.state.clickedInvoice.status = 'paid';
  model.state.invoiceArray[index] = model.state.clickedInvoice;
}

function controlDeleteButton() {
  const invoiceArrayCopy = [];

  model.state.invoiceArray.forEach(inv => {
    if (inv.id !== model.state.clickedInvoice.id) invoiceArrayCopy.push(inv);
  });

  model.state.invoiceArray = invoiceArrayCopy;

  model.state.clickedInvoice = '';

  localStorage.setItem('invoices', JSON.stringify(model.state.invoiceArray));

  init();

  initialView.setHeaderTextValue(model.state.invoiceArray.length);
}

function controlEditButton() {
  formView.render(model.state.clickedInvoice);

  // What actions has to be taken to render added items?
  for (const itemArr of model.state.clickedInvoice.itemsContainer) {
    addItemView.render(
      model.state.itemsCounter,
      subtractAddedItemsCounter,
      itemArr
    );

    model.state.itemsCounter++;
  }
}

function controlBackButton() {
  invoiceDetailsView.reverseParentClass();

  model.cancelSubmitFormResetState();

  init();

  model.state.clickedInvoice = '';
}

function checkIfArrayIsEmpty() {
  // If array is empty then returns true
  // is empty? Yes, it is empty. So, true.
  if (!model.state.invoiceArray.length) return true;

  // Otherwise, returns false
  return false;
}

function controlSubmitingEditedInvoice(form_ID, inv_ID, fieldsToCheck) {
  let isFieldValid = true;

  for (const el of fieldsToCheck) {
    // checkIfValid returns true, if entered data is correct or false if is not
    isFieldValid = model.checkIfValid(el);
    if (!isFieldValid) return false;
  }

  isFieldValid = model.addedItemsDataValidation();

  if (!isFieldValid) return false;

  const invoiceArrayCopy = [];

  model.state.invoiceArray.forEach(inv => {
    if (inv.id !== model.state.clickedInvoice.id) invoiceArrayCopy.push(inv);
  });

  const newInvoice = model.captureDataFromForm(
    form_ID,
    model.state.clickedInvoice.id
  );

  // I have to think about cl_invoice_date and payment_term
  newInvoice.cl_invoice_date = model.state.clickedInvoice.cl_invoice_date;

  invoiceArrayCopy.push(newInvoice);

  model.state.invoiceArray = invoiceArrayCopy;

  model.state.clickedInvoice = newInvoice;

  controlOpeningDetails(newInvoice.id);

  localStorage.setItem('invoices', JSON.stringify(model.state.invoiceArray));

  return true;
}
