import * as DomElements from './domElements.js';
import * as RandomDataArray from './randomData.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

class App {
  constructor() {
    this.addedItemsCounter = 1;
    this.invoiceObject;
    this.invoicesArray = [];
    this.curr_date = new Date();
    this.clickedInvoice;
    this.clickedInvoiceIndex;
    this.btn_add_item = document.querySelector('.add_item_button');

    this.init();

    this.checkLSandFillArray();

    DomElements.btnNewInvoice.addEventListener(
      'click',
      this.clickedNewInvoice.bind(this)
    );

    DomElements.btn_cancel.addEventListener(
      'click',
      this.btnCancelActions.bind(this)
    );

    DomElements.loadDataBtn.addEventListener(
      'click',
      this.loadRandomData.bind(this)
    );

    DomElements.invoicesContainer.addEventListener(
      'click',
      this.openInvoiceDetails.bind(this)
    );

    DomElements.filter.addEventListener('click', () => {
      DomElements.arrow.classList.toggle('down');
      DomElements.block_below.classList.toggle('hidden');
    });

    // Ascending order - A-Z
    document
      .querySelector('.filter_pending')
      .addEventListener('click', this.sortInvoices.bind(this));

    // Descending order Z-A
    document
      .querySelector('.filter_paid')
      .addEventListener('click', this.sortInvoices.bind(this));

    DomElements.btnSaveChanges.addEventListener(
      'click',
      this.btnSaveChangesActions.bind(this)
    );

    if (this.btn_add_item !== null) {
      this.btn_add_item.addEventListener(
        'click',
        this.addItemActions.bind(this)
      );
    }

    if (!document.querySelector('.plus_inside_dot_center')) return;
    document
      .querySelector('.plus_inside_dot_center')
      .addEventListener('click', this.clickedNewInvoice.bind(this));
  }

  btnCancelActions(e) {
    e.preventDefault();

    DomElements.items_container.innerHTML = '';

    this.addedItemsCounter = 1;

    DomElements.overlay.classList.add('hidden');

    DomElements.form_container.classList.add('hidden');

    this.resetAndSetValues();
  }

  addItemActions(e) {
    e.preventDefault();

    this.addItem(this.addedItemsCounter);

    this.addedItemsCounter++;
  }

  // Actions which have to happen after 'New Invoice' button is clicked
  clickedNewInvoice() {
    DomElements.form_container.classList.remove('hidden');

    document.querySelector('#street').focus();
    document.querySelector('#street').scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });

    document.querySelector('#cl_invoice_date').value = this.current_date();

    DomElements.overlay.classList.remove('hidden');

    DomElements.invTitleID.innerHTML = this.createID(this.curr_date);

    DomElements.btnNewInvoice.style.display = 'flex';

    if (!document.querySelector('.plus_inside_dot_center')) return;
    document.querySelector('.plus_inside_dot_center').remove();
    document.querySelector('.center_text').remove();
  }

  checkLSandFillArray() {
    if (localStorage.length > 0) {
      const x = JSON.parse(localStorage.getItem(`invoices`));
      if (!x) return;
      x.map(item => this.invoicesArray.push(item));
    }
  }

  btnSaveChangesActions(e) {
    e.preventDefault();

    const itemsContainerChildren = DomElements.items_container.children;
    const itemValuesArray = [];
    const itemHtmlElementsArray = [];

    if (document.querySelector('.main__section_detail')) {
      const { id } = this.invoicesArray[this.clickedInvoiceIndex];

      this.invoicesArray[this.clickedInvoiceIndex] = this.catchDataFromForm();

      this.invoicesArray[this.clickedInvoiceIndex].id = id;

      this.checkIfemptyInput();

      if (this.checkIfemptyInput() === false) return;

      this.checkItemFields(
        itemsContainerChildren,
        itemValuesArray,
        itemHtmlElementsArray
      );

      if (
        this.checkItemFields(
          itemsContainerChildren,
          itemValuesArray,
          itemHtmlElementsArray
        ) === false
      )
        return;

      localStorage.setItem('invoices', JSON.stringify(this.invoicesArray));

      location.reload();
    } else {
      this.checkIfemptyInput();

      if (this.checkIfemptyInput() === false) return;

      this.checkItemFields(
        itemsContainerChildren,
        itemValuesArray,
        itemHtmlElementsArray
      );

      if (
        this.checkItemFields(
          itemsContainerChildren,
          itemValuesArray,
          itemHtmlElementsArray
        ) === false
      )
        return;

      this.invoicesArray.push(this.catchDataFromForm());
      localStorage.setItem('invoices', JSON.stringify(this.invoicesArray));

      if (DomElements.invoicesContainer.childElementCount === 0) {
        this.init();
      } else {
        DomElements.invoicesContainer.innerHTML = '';
        this.init();
      }

      DomElements.form_container.classList.add('hidden');

      DomElements.overlay.classList.add('hidden');

      this.addedItemsCounter = 1;

      this.resetAndSetValues();

      document.querySelector('.items__container').innerHTML = '';
    }
  }

  checkItemFields(containerChildren, itemFieldValues, itemHtmlElements) {
    if (containerChildren.length >= 1) {
      containerChildren.forEach(element => {
        element.children.forEach(element => {
          if (element.children[1]) {
            itemHtmlElements.push(element.children[1]);
            itemFieldValues.push(element.children[1].value);
          }
        });
      });

      const testLength = itemFieldValues.includes('');

      const sorthtml = itemHtmlElements.filter(
        el => el.id.includes('item_quan') || el.id.includes('item_price')
      );

      sorthtml.forEach(el => {
        if (Number(el.value) <= 0) {
          el.value = '';
          el.style.border = '2px red solid';
        }
      });

      itemHtmlElements.forEach(element => {
        element.style.border = '';
      });

      if (testLength) {
        const emptyInputIndex = itemFieldValues.indexOf('');

        if (itemHtmlElements[emptyInputIndex].id.includes('item_name')) {
          itemHtmlElements[emptyInputIndex].placeholder =
            'Please, fill in this field.';
          itemHtmlElements[emptyInputIndex].style.border = '2px red solid';
          return false;
        } else {
          itemHtmlElements[emptyInputIndex].style.border = '';
        }

        if (
          itemHtmlElements[emptyInputIndex].id.includes('item_quan') ||
          itemHtmlElements[emptyInputIndex].id.includes('item_price')
        ) {
          itemHtmlElements[emptyInputIndex].style.border = '2px red solid';
          itemHtmlElements[emptyInputIndex].placeholder = 'Invalid value';
          return false;
        } else {
          itemHtmlElements[emptyInputIndex].style.border = '';
        }
      }
    }
  }

  checkIfemptyInput() {
    const scroolOptions = {
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    };

    const borderStyle = '2px red solid';

    const errMsg = 'This field cannot be empty';

    if (!DomElements.name_input.value) {
      DomElements.name_input.style.border = borderStyle;
      DomElements.name_input.scrollIntoView(scroolOptions);
      DomElements.name_input.focus();
      DomElements.name_input.value = '';
      DomElements.name_input.placeholder = errMsg;

      return false;
    } else {
      DomElements.name_input.style.border = '';
    }

    if (DomElements.name_input.value.length > 32) {
      DomElements.name_input.style.border = borderStyle;
      DomElements.name_input.scrollIntoView(scroolOptions);
      DomElements.name_input.focus();
      DomElements.name_input.value = '';
      DomElements.name_input.placeholder =
        "Client's or company name cannot be longer than 32 characters";

      return false;
    } else {
      DomElements.name_input.style.border = '';
    }

    if (!DomElements.clientStreet.value) {
      DomElements.clientStreet.style.border = borderStyle;
      DomElements.clientStreet.scrollIntoView(scroolOptions);
      DomElements.clientStreet.focus();
      DomElements.clientStreet.value = '';
      DomElements.clientStreet.placeholder = errMsg;
      return false;
    } else {
      DomElements.clientStreet.style.border = '';
    }

    if (!DomElements.clientCity.value) {
      DomElements.clientCity.style.border = borderStyle;
      DomElements.clientCity.scrollIntoView(scroolOptions);
      DomElements.clientCity.focus();
      DomElements.clientCity.value = '';
      DomElements.clientCity.placeholder = errMsg;
      return false;
    } else {
      DomElements.clientCity.style.border = '';
    }

    if (!DomElements.clientPostCode.value) {
      DomElements.clientPostCode.style.border = borderStyle;
      DomElements.clientPostCode.scrollIntoView(scroolOptions);
      DomElements.clientPostCode.focus();
      DomElements.clientPostCode.value = '';
      DomElements.clientPostCode.placeholder = errMsg;
      return false;
    } else {
      DomElements.clientPostCode.style.border = '';
    }

    if (!DomElements.clientCountry.value) {
      DomElements.clientCountry.style.border = borderStyle;
      DomElements.clientCountry.scrollIntoView(scroolOptions);
      DomElements.clientCountry.focus();
      DomElements.clientCountry.value = '';
      DomElements.clientCountry.placeholder = errMsg;
      return false;
    } else {
      DomElements.clientCountry.style.border = '';
    }
  }

  init() {
    const arrayFromLocalStorage = JSON.parse(localStorage.getItem(`invoices`));

    this.howManyInv(arrayFromLocalStorage);

    if (
      arrayFromLocalStorage === null ||
      arrayFromLocalStorage[0] === undefined
    ) {
      DomElements.btnNewInvoice.style.display = 'none';
      return this.renderStartingButton();
    }

    if (DomElements.loadDataBtn !== null) {
      DomElements.loadDataBtn.remove();
    }

    DomElements.btnNewInvoice.style.display = 'flex';

    arrayFromLocalStorage.map(item => this.createInvoiceRow(item));
  }

  loadRandomData() {
    this.invoicesArray.push(...RandomDataArray.randomData);

    localStorage.setItem('invoices', JSON.stringify(this.invoicesArray));

    if (document.querySelector('.plus_inside_dot_center') !== null) {
      document.querySelector('.plus_inside_dot_center').remove();
      document.querySelector('.center_text').remove();
    }

    DomElements.loadDataBtn.remove();

    this.init();
  }

  renderStartingButton() {
    const html = `
      <span class="plus_inside_dot_center">+</span>
      <p class="center_text">Click to add first invoice</p>
      `;
    DomElements.container.insertAdjacentHTML('beforeend', html);
  }

  createInvoiceRow(item) {
    const new_invoice = `
    <div class="invoice__row" title="Click to see details" data-id="${item.id}">
      <div class="invoice__number">${item.id}</div>
      <div class="invoice__date">${item.cl_invoice_date}</div>
      <div class="invoice__client">${
        item.cl_name === '' ? 'No name' : item.cl_name
      }</div>
      <div class="invoice__value">${
        item.total === null || item.total === undefined
          ? '0'
          : item.total.toFixed(2)
      }$</div>
      <div class="invoice__status__button">
        <button class="invoice__status ${item.status}">
        <span class="dot"></span> ${
          item.status === 'pending' ? 'Pending' : 'Paid'
        } 
          </button>
      </div>

    </div>
   
    `;

    DomElements.invoicesContainer.insertAdjacentHTML('afterbegin', new_invoice);
  }

  createID(date) {
    const date_in_num = String(Date.now(date));

    const id = `#INV${date_in_num.slice(7, 9)}X${date_in_num.slice(11, 13)}`;
    return id;
  }

  catchDataFromForm() {
    const data = new FormData(DomElements.form);
    this.invoiceObject = Object.fromEntries(data);
    this.invoiceObject.status = 'pending';
    this.invoiceObject.cl_invoice_date = this.current_date();
    this.invoiceObject.id = DomElements.invTitleID.innerHTML;
    this.invoiceObject.itemsContainer = this.createItemsContainer(
      this.invoiceObject
    );
    this.invoiceObject.addedItems = this.invoiceObject.itemsContainer.length;

    this.invoiceObject.total = this.calcTotal(this.invoiceObject);
    return this.invoiceObject;
  }

  createItemsContainer(invoiceObject) {
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

  current_date() {
    const day = `${this.curr_date.getDate()}`.padStart(2, 0);
    const month = `${this.curr_date.getMonth() + 1}`.padStart(2, 0);
    const year = this.curr_date.getFullYear();

    let payment_date = `${day}.${month}.${year}`;

    return payment_date;
  }

  insta_calc_total(quan, price, total) {
    quan.addEventListener(
      'keyup',
      () => (total.value = `${quan.value * price.value}$`)
    );

    price.addEventListener(
      'keyup',
      () => (total.value = `${quan.value * price.value}$`)
    );
  }

  openInvoiceDetails(e) {
    const clickedInvoiceRow = e.target.closest('.invoice__row');
    if (clickedInvoiceRow === null) return;
    const idfOfClickedInvoice = clickedInvoiceRow.dataset.id;

    this.clickedInvoice = this.invoicesArray.find(
      item => item.id === idfOfClickedInvoice
    );
    this.clickedInvoiceIndex = this.invoicesArray.indexOf(this.clickedInvoice);

    DomElements.main_section.classList.add('hidden');

    this.btn_add_item.remove();

    DomElements.btnSaveChanges.remove();

    new ClickedInvoiceDetails(this.clickedInvoice, this.clickedInvoiceIndex);
  }

  resetAndSetValues(object) {
    document.querySelector('#street').value = `${
      object?.street === undefined ? '' : object.street
    }`;
    document.querySelector('#city').value = `${
      object?.city === undefined ? '' : object.city
    }`;
    document.querySelector('#post_code').value = `${
      object?.post_code === undefined ? '' : object.post_code
    }`;
    document.querySelector('#country').value = `${
      object?.country === undefined ? '' : object.country
    }`;
    document.querySelector('#cl_name').value = `${
      object?.cl_name === undefined ? '' : object.cl_name
    }`;
    document.querySelector('#cl_email').value = `${
      object?.cl_email === undefined ? '' : object.cl_email
    }`;
    document.querySelector('#cl_street').value = `${
      object?.cl_street === undefined ? '' : object.cl_street
    }`;
    document.querySelector('#cl_city').value = `${
      object?.cl_city === undefined ? '' : object.cl_city
    }`;
    document.querySelector('#cl_post_code').value = `${
      object?.cl_post_code === undefined ? '' : object.cl_post_code
    }`;
    document.querySelector('#cl_country').value = `${
      object?.cl_country === undefined ? '' : object.cl_country
    }`;
    document.querySelector('#cl_invoice_date').value = `${
      object?.cl_invoice_date === undefined ? '' : object.cl_invoice_date
    }`;
    document.querySelector('#payment_term').value = `${
      object?.payment_term === undefined ? '' : object.payment_term
    }`;
    document.querySelector('#project_descrip').value = `${
      object?.project_descrip === undefined ? '' : object.project_descrip
    }`;
  }

  addItem(counter, invoice) {
    const inv_row = document.createElement('div');
    inv_row.classList.add(`item`);
    inv_row.classList.add(`item_num_${counter}`);

    inv_row.innerHTML = `
      <div class="item__name">
        <label for="item_name_${counter}">Item/Service Name<sup>*</sup></label>
        <input
        type="text"
        id="item_name_${counter}"
        name="item_name_${counter}"
        required
        maxlength="25"

        />
      </div>
      <div class="item__quantity">
        <label for="item_quan_${counter}">Qty.<sup>*</sup></label>
        <input
          type="number"
          min="1"
          max="10000"
          maxlength="7"
          id="item_quan_${counter}"
          name="item_quan_${counter}"
          required

        />
      </div>
      <div class="item__price">
      <label for="item_price_${counter}">Price<sup>*</sup></label>
      <input
          id="item_price_${counter}"
          name="item_price_${counter}"
          required
          type="number"
          step="1"
          max="10000"

        />
      </div>
      <div class="item__total">
        <label for="item_total_${counter}">Total</label>
          <input
          type="text"
          id="item_total_${counter}"
          name="item_total_${counter}"
          readonly="readonly"
          value="0$"
          
        />
      </div>
  
      <button class="remove_item_button">X</button>
      `;

    const deleteBtn = inv_row.querySelector(`.remove_item_button`);

    deleteBtn.addEventListener('click', () => {
      inv_row.remove();
      counter--;
      this.addedItemsCounter--;
    });

    DomElements.items_container.appendChild(inv_row);

    const input_item_name_x = inv_row.querySelector(`#item_name_${counter}`);
    const input_quan_x = inv_row.querySelector(`#item_quan_${counter}`);
    const input_price_x = inv_row.querySelector(`#item_price_${counter}`);
    const input_total_x = inv_row.querySelector(`#item_total_${counter}`);

    this.insta_calc_total(input_quan_x, input_price_x, input_total_x);

    input_item_name_x.value = `${
      invoice?.street === undefined
        ? ''
        : invoice.itemsContainer[counter - 1][0]
    }`;

    input_quan_x.value = `${
      invoice?.street === undefined
        ? ''
        : invoice.itemsContainer[counter - 1][1]
    }`;

    input_price_x.value = `${
      invoice?.street === undefined
        ? ''
        : invoice.itemsContainer[counter - 1][2]
    }`;

    input_total_x.value = `${
      invoice?.street === undefined
        ? ''
        : invoice.itemsContainer[counter - 1][3]
    }`;

    counter++;
  }

  calcPaymentTerm(invoice) {
    const paymentDelay =
      invoice.payment_term === undefined ? 30 : invoice.payment_term;

    const date_2 = Date.parse(this.curr_date) + paymentDelay * 86400000;
    const new_date = new Date(date_2);

    const day = `${new_date.getDate()}`.padStart(2, 0);
    const month = `${new_date.getMonth() + 1}`.padStart(2, 0);
    const year = new_date.getFullYear();

    let payment_date = `${day}.${month}.${year}`;

    return payment_date;
  }

  calcTotal(item) {
    const addedItems = item.addedItems;
    let repeat = 1;
    const sum = [];
    while (addedItems >= repeat) {
      let value = item.itemsContainer[repeat - 1][3];

      sum.push(parseFloat(value));
      repeat++;
    }
    const total = sum.reduce((acc, curr) => acc + curr, 0);
    return total;
  }

  howManyInv(array = []) {
    if (array === null || array === []) return;
    if (array.length === 0 || array === []) {
      DomElements.textHowManyInvoices.innerHTML =
        "You haven't added any invoice.";
    }
    if (array.length === 1) {
      DomElements.textHowManyInvoices.innerHTML = 'There is one invoice.';
    }
    if (array.length > 1) {
      DomElements.textHowManyInvoices.innerHTML = `There are ${array.length} invoices.`;
    }
  }

  sortInvoices(e) {
    if (this.invoicesArray.length <= 1) return;

    this.invoicesArray.sort((a, b) => {
      let fa = a.status.toLowerCase(),
        fb = b.status.toLowerCase();
      const clickedButton = e.target.innerHTML === 'Paid' ? fa > fb : fa < fb;
      const clickedButton_2 = e.target.innerHTML === 'Paid' ? fa < fb : fa > fb;

      if (clickedButton) {
        return -1;
      }
      if (clickedButton_2) {
        return 1;
      }
      return 0;
    });
    DomElements.invoicesContainer.innerHTML = '';

    this.invoicesArray.map(item => this.createInvoiceRow(item));
  }
}

new App();

class ClickedInvoiceDetails extends App {
  constructor(clickedInvoice, clickedInvoiceIndex) {
    super();
    this.clickedInvoice = clickedInvoice;
    this.clickedInvoiceIndex = clickedInvoiceIndex;
    this.renderInvoiceDetails(this.clickedInvoice);
    this.renderSummaryDetails(this.clickedInvoice);

    this.detailSection = document.querySelector('.main__section_detail');
    this.backButton = document.querySelector('.back_button');
    this.statusIcon = this.detailSection.querySelector('.invoice__status');
    this.btnMark = document.querySelector('.btn_mark');
    this.btnEdit = document.querySelector('.btn_edit');
    this.btnDelete = document.querySelector('.btn_delete');
    this.confirmRemovingBtn = document.querySelector('.btn_delete_modal');
    this.cancelRemovingBtn = document.querySelector('.cancelDeletebtn');
    this.modalOverlay = document.querySelector('.overlayJS');

    this.renderAddItemBtn();

    this.renderSaveChangesBtn();

    this.saveChanges = document.querySelector('.btn_save_2');

    this.btn_add_item = document.querySelector('.addBtn_2');

    this.btn_add_item.addEventListener('click', this.addItemActions.bind(this));

    this.saveChanges.addEventListener(
      'click',
      this.btnSaveChangesActions.bind(this)
    );

    this.backButton.addEventListener('click', () => {
      DomElements.main_section.classList.remove('hidden');
      document.querySelector('.main__section_detail').remove();
      this.detailSection.innerHTML = '';
      DomElements.invoicesContainer.innerHTML = '';
      location.reload();
    });

    this.btnMark.addEventListener(
      'click',
      this.markInvoiceDSActions.bind(this)
    );

    this.btnDelete.addEventListener('click', this.toggleModalWindow.bind(this));

    this.modalOverlay.addEventListener(
      'click',
      this.toggleModalWindow.bind(this)
    );

    this.confirmRemovingBtn.addEventListener(
      'click',
      this.deleteInvoiceDSActions.bind(this)
    );
    this.cancelRemovingBtn.addEventListener(
      'click',
      this.toggleModalWindow.bind(this)
    );

    this.btnEdit.addEventListener(
      'click',
      this.editInvoiceDSActions.bind(this)
    );
  }

  renderAddItemBtn() {
    const button = `
      <button class="addBtn_2">+ Add New Item</button>
  
      `;

    document
      .querySelector('.items__container')
      .insertAdjacentHTML('afterend', button);
  }

  renderSaveChangesBtn() {
    const SButton = `
      <button form="form_1" class="btn_save_2">Save changes</button>
      `;
    document
      .querySelector('.bottom_buttons')
      .insertAdjacentHTML('beforeend', SButton);
  }

  setAddedItemRows(object) {
    let repeat = 1;

    while (object.addedItems >= repeat) {
      this.addItem(repeat, object);

      repeat++;
    }
  }

  editInvoiceDSActions() {
    DomElements.form_container.classList.remove('hidden');

    DomElements.overlay.classList.remove('hidden');

    this.resetAndSetValues(this.clickedInvoice);

    this.setAddedItemRows(this.clickedInvoice);

    DomElements.invTitleID.innerHTML = this.clickedInvoice.id;

    this.addedItemsCounter = this.clickedInvoice.addedItems + 1;
  }

  markInvoiceDSActions() {
    this.invoicesArray.splice(this.clickedInvoiceIndex, 1);
    this.clickedInvoice.status = 'paid';
    this.btnMark.innerHTML = 'Has already paid';
    this.statusIcon.classList.remove('pending');
    this.statusIcon.classList.add('paid');
    this.statusIcon.innerHTML = '<span class="dot"></span> Paid';

    this.invoicesArray.push(this.clickedInvoice);

    localStorage.setItem('invoices', JSON.stringify(this.invoicesArray));
  }

  deleteInvoiceDSActions() {
    const newArr = this.invoicesArray.filter(
      inv => inv.id !== this.clickedInvoice.id
    );
    localStorage.setItem('invoices', JSON.stringify(newArr));
    location.reload();
  }

  toggleModalWindow() {
    document.querySelector('.modalJS').classList.toggle('hidden');
    document.querySelector('.overlayJS').classList.toggle('hidden');
  }

  renderInvoiceDetails(invoice) {
    const details = document.createElement('div');
    details.classList.add(`main__section_detail`);

    details.innerHTML = `
      <div class="invoice__counter__button">
        <p>Invoice number: ${invoice.id}</p>
        <div class="main_buttons">
          <button class="btn_res btn_edit">Edit</button>
          <button class="btn_res btn_delete">Delete</button>
          <button class="btn_res btn_mark">${
            invoice.status === 'pending' ? 'Mark as Paid' : 'Has already paid'
          }</button>
        </div>
      </div>
  
      <div class="invoice_details">
        <div class="invoice">
          <div class="invoice_data">
            <button title="return to all invoices" class="back_button">Back</button>

            <div class="containerStatusBtn_ClientName">

              <div class="status_button">
                <p class="label_name_above_value">Status</p>

                <br />

                <div class="invoice__status__button">
                  <button class="invoice__status ${invoice.status}">
                    <span class="dot"></span> ${
                      invoice.status === 'pending' ? 'Pending' : 'Paid'
                    }
                  </button>
                </div>
              </div>


              <div class="clientNameContainer">
                <p class="label_name_above_value">Client/Company Name </p>
  
                <br />
                <p class="client_name">${invoice.cl_name}</p>
              </div>


            
            </div>

            <div class="container_PaymentTerm_ClientMail"> 

              <div class="paymentTermConta">
                <p class="label_name_above_value">Due to</p>

                <br />

                <p class="due_to_value">${this.calcPaymentTerm(invoice)}</p>
              </div>
              
              <div class="clientMailContainer">
                <p class="label_name_above_value">Client/Company Email</p>
  
                <br />
  
                <p class="cl_mail_value">${invoice.cl_email}</p>
              </div>

            
            </div>

            <div class="container_UserAddress_ClientAddress"> 

              <div class="userAddress">
                <p class="label_name_above_value">My address</p>

                <br />
                <p class="user_stret_city_value">${invoice.street}, ${
      invoice.city
    }</p>
                  <p class="user_post_code_value">${invoice.post_code}, ${
      invoice.country
    }</p>
                </div>
                  
                <div class="clientAddressContainer">
                <p class="label_name_above_value">Client/Company Address:</p>
  
                <br />
  
                  <p class="cl_street_city_value">${invoice.cl_street}, ${
      invoice.cl_city
    }</p>
                  <p class="cl_post_code_country_value">
                  ${invoice.cl_post_code}, ${invoice.cl_country}
                  </p>
              </div>

            
            </div>

            
          </div>
  
          <div class="summary">
            <div class="three_rows">
              <div class="item_info title">
                <div>Item Name</div>
                <div>QTY.</div>
                <div>Price</div>
                <div>Total</div>
              </div>
  
            <div class="item_bars_cont">
  
            </div>
            <div class="sum_total">
              <p class="total_text">TOTAL:</p>
              <p class="sum">${
                invoice.total === null ? '0' : invoice.total.toFixed(2)
              }$</p>
            </div>
  
          </div>
        </div>
        <div class="overlayJS hidden"></div>
        <div class="modalJS hidden">
              <p>Are you sure?</p>
              <div> 
                  <button class="btn_delete_modal">Yes, delete.</button>
                  <button class="cancelDeletebtn" >No.</button>
              </div>
        </div>
      </div>
  
      `;

    return DomElements.container.appendChild(details);
  }

  renderSummaryDetails(invoice) {
    let repeat = 1;

    while (invoice.addedItems >= repeat) {
      const details_item_row = document.createElement('div');
      details_item_row.classList.add(`item_info`);
      details_item_row.classList.add(`values`);

      details_item_row.innerHTML = `
          <div class="user_item_name_value">${
            invoice.itemsContainer[repeat - 1][0]
          }</div>
          <div class="user_item_quan_value">${
            invoice.itemsContainer[repeat - 1][1]
          }</div>
          <div class="user_item_price_value">${
            invoice.itemsContainer[repeat - 1][2]
          }$</div>
          <div class="user_item_total_value">${
            invoice.itemsContainer[repeat - 1][3]
          }</div>`;

      document
        .querySelector('.main__section_detail')
        .querySelector('.item_bars_cont')
        .appendChild(details_item_row);

      repeat++;
    }
  }
}
