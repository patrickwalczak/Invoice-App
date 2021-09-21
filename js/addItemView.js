class addItemView {
  parentElement;
  removeItemButton;
  inputItemName;
  inputItemQuan;
  inputItemPrice;
  inputItemTotal;

  render(itemID, substractCounter, itemArr) {
    // Store returned html
    const markup = this.generateMarkup(itemID, itemArr);

    this.parentElement = document.querySelector('.items__container');

    // Insert form element
    this.parentElement.insertAdjacentHTML('beforeend', markup);

    this.assignValueToElements(itemID);

    this.insta_calc_total(
      this.inputItemQuan,
      this.inputItemPrice,
      this.inputItemTotal
    );

    this.addEventHandlerToRemoveButton(substractCounter);
  }

  addEventHandlerToRemoveButton(substractCounter) {
    this.removeItemButton.addEventListener('click', e => {
      e.preventDefault();
      e.target.closest('.item').remove();
      substractCounter();
    });
  }

  assignValueToElements(itemID) {
    this.removeItemButton = this.parentElement.querySelector(`.Xbtn_${itemID}`);

    this.inputItemName = this.parentElement.querySelector(
      `#item_name_${itemID}`
    );
    this.inputItemQuan = this.parentElement.querySelector(
      `#item_quan_${itemID}`
    );
    this.inputItemPrice = this.parentElement.querySelector(
      `#item_price_${itemID}`
    );
    this.inputItemTotal = this.parentElement.querySelector(
      `#item_total_${itemID}`
    );
  }

  insta_calc_total(quan, price, total) {
    ['keyup', 'change'].forEach(ev => {
      quan.addEventListener(
        ev,
        () => (total.value = `${quan.value * price.value}$`)
      ),
        price.addEventListener(
          ev,
          () => (total.value = `${quan.value * price.value}$`)
        );
    });
  }

  generateMarkup(itemID, dataFromClickedInvoice = undefined) {
    return `
    <div class='item item_num_${itemID}'>
    <div class="item__name">
      <label for="item_name_${itemID}">Item/Service Name<sup>*</sup></label>
      <input
      type="text"
      id="item_name_${itemID}"
      name="item_name_${itemID}"
      required
      maxlength="25"
      value="${dataFromClickedInvoice ? dataFromClickedInvoice[0] : ''}"

      />
    </div>
    <div class="item__quantity">
      <label for="item_quan_${itemID}">Qty.<sup>*</sup></label>
      <input
        type="number"
        min="1"
        max="10000"
        maxlength="7"
        id="item_quan_${itemID}"
        name="item_quan_${itemID}"
        required
        value="${dataFromClickedInvoice ? dataFromClickedInvoice[1] : ''}"

      />
    </div>
    <div class="item__price">
    <label for="item_price_${itemID}">Price<sup>*</sup></label>
    <input
        id="item_price_${itemID}"
        name="item_price_${itemID}"
        required
        type="number"
        step="1"
        max="100000000"
        value="${dataFromClickedInvoice ? dataFromClickedInvoice[2] : ''}"

      />
    </div>
    <div class="item__total">
      <label for="item_total_${itemID}">Total</label>
        <input
        type="text"
        id="item_total_${itemID}"
        name="item_total_${itemID}"
        readonly="readonly"
        value="${dataFromClickedInvoice ? dataFromClickedInvoice[3] : ''}"
        
      />
    </div>

    <button class="remove_item_button Xbtn_${itemID}">X</button>
  </div>
      `;
  }
}

export default new addItemView();
