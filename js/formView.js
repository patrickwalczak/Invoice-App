class FormView {
  parentElement = document.querySelector('.form');
  formElement;
  formCancelBtn;
  formAddInvoiceBtn;
  formAddItemBtn;
  invoiceIdPlaceholder;
  listOfFormInputsToVerify;

  render(clickedInvoice) {
    // Remove hidden class from overlay and form container
    this.toggleOverlayFormConHiddenClass();

    // Capture returned html
    const markup = this.generateMarkup(clickedInvoice);

    // Clear parent div.
    this.clearParent();

    // Insert form element
    this.parentElement.insertAdjacentHTML('afterbegin', markup);

    // Assign the formElement variable
    this.formElement = this.parentElement.querySelector('#form_1');

    // Obvious
    this.setFormDefaultBehaviour();

    this.pushInputFieldsToList();
  }

  pushInputFieldsToList() {
    return (this.listOfFormInputsToVerify = [
      'cl_name',
      'cl_street',
      'cl_city',
      'cl_post_code',
      'cl_country',
    ]);
  }

  setInvId(handler) {
    this.invoiceIdPlaceholder = this.parentElement.querySelector(
      '.invID'
    ).innerHTML = `${handler()}`;
  }

  addListenersToForm(
    cancelSubmithandler,
    submitFormHandler,
    controlAddingItems
  ) {
    this.formCancelBtn = this.formElement.querySelector('.btn_cancel');
    this.formAddInvoiceBtn = this.formElement.querySelector('.btn_save');
    this.formAddItemBtn = this.formElement.querySelector('.add_item_button');

    this.formCancelBtn.addEventListener('click', e => {
      e.preventDefault();
      this.cancelFormHandler(cancelSubmithandler);
    });

    this.formAddInvoiceBtn.addEventListener('click', e => {
      e.preventDefault();
      this.addInvoiceHandler(submitFormHandler, cancelSubmithandler);
    });

    this.formAddItemBtn.addEventListener('click', function (e) {
      e.preventDefault();
      controlAddingItems();
      e.target
        .closest('#form_1')
        .scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }

  cancelFormHandler(handler) {
    this.clearParent();
    this.toggleOverlayFormConHiddenClass();
    handler();
  }

  addInvoiceHandler(submitForm, resetState) {
    const isOk = submitForm(
      this.formElement,
      this.invoiceIdPlaceholder,
      this.listOfFormInputsToVerify
    );

    if (!isOk) return;

    this.clearParent();
    this.toggleOverlayFormConHiddenClass();
    resetState();
  }

  clearParent() {
    this.parentElement.innerHTML = '';
  }

  setFormDefaultBehaviour() {
    this.formElement.querySelector('#street').focus();
    this.formElement.querySelector('#street').scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }

  toggleOverlayFormConHiddenClass() {
    this.parentElement.classList.toggle('hidden');

    document.querySelector('.overlay').classList.toggle('hidden');
  }

  generateMarkup(invoice) {
    return `
<form id="form_1" autocomplete="off">
            <p class="title_text_form_top">
              Invoice: <span class="invID">${
                invoice?.id ? invoice.id : ''
              }</span>
            </p>

            <div class="first_section_of_the_form">
              <p class="form__section__title">Bill from</p>

              <div>
                <label for="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  placeholder="Street.."
                  maxlength="30"
                  value="${invoice?.id ? invoice.street : ''}"
                />
              </div>

              <div class="inline_inputs">
                <div>
                  <label for="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="City.."
                    maxlength="25"
                    value="${invoice?.id ? invoice.city : ''}"
                  />
                </div>

                <div>
                  <label for="post_code">Post code</label>
                  <input
                    type="text"
                    id="post_code"
                    name="post_code"
                    placeholder="Post code.."
                    maxlength="10"
                    value="${invoice?.id ? invoice.post_code : ''}"
                  />
                </div>

                <div>
                  <label for="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    placeholder="Country.."
                    maxlength="25"
                    value="${invoice?.id ? invoice.country : ''}"
                  />
                </div>
              </div>
            </div>

            <div class="second_section_of_the_form">
              <p class="form__section__title">Bill to</p>

              <div>
                <label for="cl_name">Client Name / Company<sup>*</sup></label>
                <input
                  type="text"
                  id="cl_name"
                  name="cl_name"
                  placeholder="Name.."
                  required
                  value="${invoice?.id ? invoice.cl_name : ''}"
                />
              </div>

              <div>
                <label for="cl_email">Client Email</label>
                <input
                  type="text"
                  id="cl_email"
                  name="cl_email"
                  placeholder="Email.."
                  maxlength="35"
                  value="${invoice?.id ? invoice.cl_email : ''}"
                />
              </div>

              <div>
                <label for="cl_street">Street Address<sup>*</sup></label>
                <input
                  type="text"
                  id="cl_street"
                  name="cl_street"
                  placeholder="Street.."
                  required
                  maxlength="30"
                  value="${invoice?.id ? invoice.cl_street : ''}"
                />
              </div>

              <div class="inline_inputs">
                <div>
                  <label for="cl_city">City<sup>*</sup></label>
                  <input
                    type="text"
                    id="cl_city"
                    name="cl_city"
                    placeholder="City.."
                    required
                    maxlength="20"
                    value="${invoice?.id ? invoice.cl_city : ''}"
                  />
                </div>

                <div>
                  <label for="cl_post_code">Post code<sup>*</sup></label>
                  <input
                    type="text"
                    id="cl_post_code"
                    name="cl_post_code"
                    placeholder="Post code.."
                    required
                    maxlength="10"
                    value="${invoice?.id ? invoice.cl_post_code : ''}"
                  />
                </div>

                <div>
                  <label for="cl_country">Country<sup>*</sup></label>
                  <input
                    type="text"
                    id="cl_country"
                    name="cl_country"
                    placeholder="Country.."
                    required
                    maxlength="20"
                    value="${invoice?.id ? invoice.cl_country : ''}"
                  />
                </div>
              </div>
            </div>

            <div class="date_term">
              <div class="invoice_date">
                <label for="cl_invoice_date">Creation date</label>
                <input
                  type="date"
                  id="cl_invoice_date"
                  name="cl_invoice_date"
                  value="${invoice?.id ? invoice.cl_invoice_date : ''}"
                />
              </div>

              <div class="payment_term">
                <label for="payment_term">Payment term</label>
                <select id="payment_term" name="payment_term" required>
                  <option value="30">Next 30 days</option>
                  <option value="7">Next week</option>
                  <option value="14">Two weeks</option>
                  <option value="21">Three weeks</option>
                </select>
              </div>
            </div>
            <label for="project_descrip">Description</label>
            <input
              type="text"
              id="project_descrip"
              name="project_descrip"
              placeholder=""
              maxlength="30"
              value="${invoice?.id ? invoice.project_descrip : ''}"
            />

            <p class="item_list">Item list</p>
            <div class="items__container">
              <!-- Place for item rows -->
            </div>
            <button class="add_item_button">+ Add New Item</button>

            <div class="bottom_buttons">
              <button class="btn_cancel">Cancel</button>
              <button form="form_1" class="btn_save">Add Invoice</button>
            </div>
          </form>
`;
  }
}

export default new FormView();
