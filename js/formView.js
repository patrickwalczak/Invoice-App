import * as DomElements from './domElements.js';

class FormView {
  displayForm() {
    DomElements.form_container.classList.remove('hidden');

    this.renderFormElement();

    // formElement.querySelector('#street').focus();
    // formElement.querySelector('#street').scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'end',
    //   inline: 'nearest',
    // });
  }

  renderFormElement() {
    const form = `
<form id="form_1" autocomplete="off">
            <p class="title_text_form_top">
              Invoice: <span class="invID"></span>
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
            />

            <p class="item_list">Item list</p>
            <div class="items__container">
              <!-- Place for invoice rows -->
            </div>
            <button class="add_item_button">+ Add New Item</button>

            <div class="bottom_buttons">
              <button class="btn_cancel">Cancel</button>
              <button form="form_1" class="btn_save">Add Invoice</button>
            </div>
          </form>
`;

    DomElements.form_container.insertAdjacentHTML('afterbegin', form);
  }
}
