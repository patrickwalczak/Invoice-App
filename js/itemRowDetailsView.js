class itemRowDetailsView {
  parentElement;

  render(itemArr) {
    this.parentElement = document.querySelector('.item_bars_cont');
    const markup = this.generateMarkUp(itemArr);

    return this.parentElement.insertAdjacentHTML('beforeend', markup);
  }

  generateMarkUp(itemArr) {
    return `
        <div class="item_info values">
            <div class="user_item_name_value">${itemArr[0]}</div>
            <div class="user_item_quan_value">${itemArr[1]}</div>
            <div class="user_item_price_value">${itemArr[2]}$</div>
            <div class="user_item_total_value">${itemArr[3]}</div>
        </div>
      `;
  }
}

export default new itemRowDetailsView();
