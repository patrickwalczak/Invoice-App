class invoiceShortView {
  parentElement;

  createInvoiceRow(invoice) {
    this.parentElement = document.querySelector('.invoices__bars');

    const new_invoice = `
        <div class="invoice__row" title="Click to see details" data-id="${
          invoice.id
        }">
          <div class="invoice__number">${invoice.id}</div>
          <div class="invoice__date">${invoice.cl_invoice_date}</div>
          <div class="invoice__client">${
            invoice.cl_name === '' ? 'No name' : invoice.cl_name
          }</div>
          <div class="invoice__value">${
            invoice.total === null || invoice.total === undefined
              ? '0'
              : invoice.total.toFixed(2)
          }$</div>
          <div class="invoice__status__button">
            <button class="invoice__status ${invoice.status}">
            <span class="dot"></span> ${
              invoice.status === 'pending' ? 'Pending' : 'Paid'
            } 
              </button>
          </div>
    
        </div>
       
        `;

    this.parentElement.insertAdjacentHTML('afterbegin', new_invoice);
  }

  clear() {
    this.parentElement = document.querySelector('.invoices__bars');
    this.parentElement.innerHTML = '';
  }
}

export default new invoiceShortView();
