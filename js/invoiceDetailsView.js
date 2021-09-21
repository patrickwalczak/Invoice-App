class InvoiceDetailsView {
  parentElement = document.querySelector('.main__section');
  editButton;
  deleteButton;
  markButton;
  backButton;
  confirmDeletionBtn;
  cancelDeletionBtn;
  invoiceStatus;

  render(invoiceData, paymentTerm) {
    const markup = this.generateMarkup(invoiceData, paymentTerm);

    this.reverseParentClass();

    this.parentElement.insertAdjacentHTML('beforeend', markup);

    this.selectButtons();
  }

  addEventHandlersToButtons(
    backBtnHandler,
    editBtnHandler,
    deleteInvBtnHandler,
    markBtnHandler
  ) {
    this.editButton.addEventListener('click', e => {
      editBtnHandler();
    });

    this.deleteButton.addEventListener(
      'click',
      this.toggleModalWindow.bind(this)
    );

    this.modalOverlay.addEventListener(
      'click',
      this.toggleModalWindow.bind(this)
    );

    this.confirmDeletionBtn.addEventListener('click', deleteInvBtnHandler);

    this.cancelDeletionBtn.addEventListener(
      'click',
      this.toggleModalWindow.bind(this)
    );

    this.markButton.addEventListener('click', () => {
      markBtnHandler();
      this.markButtonActions();
    });

    this.backButton.addEventListener('click', backBtnHandler);
  }

  markButtonActions() {
    this.markButton.innerHTML = 'Has already paid';
    this.invoiceStatus.classList.remove('pending');
    this.invoiceStatus.classList.add('paid');
    this.invoiceStatus.innerHTML = '<span class="dot"></span> Paid';
  }

  selectButtons() {
    this.editButton = this.parentElement.querySelector('.btn_edit');
    this.deleteButton = this.parentElement.querySelector('.btn_delete');
    this.markButton = this.parentElement.querySelector('.btn_mark');
    this.backButton = this.parentElement.querySelector('.back_button');
    this.confirmDeletionBtn = document.querySelector('.btn_delete_modal');
    this.cancelDeletionBtn = document.querySelector('.cancelDeletebtn');
    this.modalOverlay = document.querySelector('.overlayJS');
    this.invoiceStatus = document.querySelector('.invoice__status');
  }

  // Dirty lazy trick
  reverseParentClass() {
    this.parentElement.innerHTML = '';
    this.parentElement.classList.toggle('main__section');
    this.parentElement.classList.toggle('main__section_detail');
  }

  toggleModalWindow() {
    document.querySelector('.modalJS').classList.toggle('hidden');
    document.querySelector('.overlayJS').classList.toggle('hidden');
  }

  generateMarkup(invoice, paymentTerm) {
    return `
        
          <div class="invoice__counter__button">
            <p class='id_con'>Invoice number: ${invoice.id}</p>
            <div class="main_buttons">
              <button class="btn_res btn_edit">Edit</button>
              <button class="btn_res btn_delete">Delete</button>
              <button class="btn_res btn_mark">${
                invoice.status === 'pending'
                  ? 'Mark as Paid'
                  : 'Has already paid'
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
    
                    <p class="due_to_value">${paymentTerm}</p>
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
  }
}

export default new InvoiceDetailsView();
