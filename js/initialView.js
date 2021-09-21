class InitialView {
  parentElement = document.querySelector('.main__section');
  filterButton;
  // These two make an animation works
  arrowElement;
  blockBelowFilter;
  //======
  newInvoiceButton;

  invoicesContainer;

  sortByPaid;

  sortByPending;

  isSortedPaid = false;

  isSortedPending = false;

  centerTextInsideInvoicesContainer;

  // This is a short sentence, which summarise how many invoices are currently
  headerText;

  render(handler, filterByPaidHandler, filterByPendingHandler) {
    const markup = this.generateMarkup();

    this.clear();
    this.parentElement.innerHTML = '';

    this.parentElement.insertAdjacentHTML('afterbegin', markup);

    this.assignViewElement();

    this.filterButton.addEventListener('click', () => {
      this.arrowElement.classList.toggle('down');
      this.blockBelowFilter.classList.toggle('hidden');
    });

    this.invoicesContainer.addEventListener('click', e => {
      // Click listener is attached to container that contains only main information about invoice such as ID, client name, total
      const clickedInvoiceRow = e.target.closest('.invoice__row');
      if (clickedInvoiceRow === null) return;
      handler(clickedInvoiceRow.dataset.id);
    });

    this.sortOptions(filterByPaidHandler, filterByPendingHandler);
  }

  sortOptions(filterByPaidHandler, filterByPendingHandler) {
    // Ascending order - A-Z
    this.sortByPending.addEventListener('click', e => {
      filterByPendingHandler(e.target.innerHTML, this.isSortedPending);
      this.isSortedPending = !this.isSortedPending;
    });

    // Descending order Z-A
    this.sortByPaid.addEventListener('click', e => {
      filterByPaidHandler(e.target.innerHTML, this.isSortedPaid);
      this.isSortedPaid = !this.isSortedPaid;
    });
  }

  assignViewElement() {
    this.filterButton = this.parentElement.querySelector('.filter');
    this.newInvoiceButton = this.parentElement.querySelector('.button__add');
    this.arrowElement = this.parentElement.querySelector('.arrow');
    this.blockBelowFilter = this.parentElement.querySelector(
      '.block_below_filter'
    );
    this.invoicesContainer = document.querySelector('.invoices__bars');

    this.sortByPending = document.querySelector('.filter_pending');

    this.sortByPaid = document.querySelector('.filter_paid');

    this.headerText = document.querySelector('.how_many_invoices');

    this.centerTextInsideInvoicesContainer =
      document.querySelector('.centerText');
  }

  // This function manages the state of the center text and text below 'U Invoice'
  setHeaderTextValue(amountOfInvoices = 0) {
    if (amountOfInvoices === 0 || amountOfInvoices === []) {
      this.headerText.innerHTML = '';
      this.centerTextInsideInvoicesContainer.innerHTML =
        "You haven't added any invoice yet.";
    }

    if (amountOfInvoices >= 1) {
      this.centerTextInsideInvoicesContainer.innerHTML = '';
    }

    if (amountOfInvoices === 1) {
      this.headerText.innerHTML = 'There is one invoice.';
    }
    if (amountOfInvoices > 1) {
      this.headerText.innerHTML = `There are ${amountOfInvoices} invoices.`;
    }
  }

  // I passed call back function which is a render method from formView through controller
  addHandlerToNewInvoiceBtn(handler) {
    this.newInvoiceButton.addEventListener('click', handler);
  }

  clear() {
    this.parentElement.innerHTML = '';
  }

  generateMarkup(isAnyInvoice) {
    return ` <div class="invoice__counter__button_index">
    <div class="invoice__counter">
      <h1>U Invoice</h1>
      <br />
      <p class="how_many_invoices"></p>
    </div>

    <div class="filter">
      Filter by status <span class="arrow">></span>
      <div class="block_below_filter hidden">
        <div class="filter_pending">Pending</div>
        <div class="filter_paid">Paid</div>
      </div>
    </div>
    <button class="button__add">
      <span class="p">New Invoice</span>
      <span class="dotX">+</span>
    </button>
  </div>

  <div class="invoices__bars"> 
      <span class='centerText'></span>
  <!-- Place for invoice rows -->
  
  </div>`;
  }
}

export default new InitialView();
