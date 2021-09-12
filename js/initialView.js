import * as DomElements from './domElements.js';

class InitialView {
  constructor() {
    this.clickedNewInvoice;
  }
  newInvoiceButton;

  turnOnAllEventHandlers(handlerFromController) {
    DomElements.filter.addEventListener('click', () => {
      DomElements.arrow.classList.toggle('down');
      DomElements.block_below.classList.toggle('hidden');
    });

    DomElements.btnNewInvoice.addEventListener('click', handlerFromController);

    this.clickedNewInvoice;
  }

  // Actions which have to happen after 'New Invoice' button is clicked
  clickedNewInvoice() {
    DomElements.form_container.classList.remove('hidden');

    // document.querySelector('#street').focus();
    // document.querySelector('#street').scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'end',
    //   inline: 'nearest',
    // });

    // document.querySelector('#cl_invoice_date').value = this.current_date();

    DomElements.overlay.classList.remove('hidden');

    // DomElements.invTitleID.innerHTML = this.createID(this.curr_date);

    // DomElements.btnNewInvoice.style.display = 'flex';

    // if (!document.querySelector('.plus_inside_dot_center')) return;
    // document.querySelector('.plus_inside_dot_center').remove();
    // document.querySelector('.center_text').remove();
  }
}

export default new InitialView();
