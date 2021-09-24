class LoadDataButton {
  parentElement;
  loadDataBtn;
  render(loadDataBtnHandler, isEmpty) {
    this.parentElement = document.querySelector('.container');

    if (!isEmpty && document.querySelector('.loadData'))
      return document.querySelector('.loadData').remove();

    if (!isEmpty) return;

    console.log(isEmpty);

    const markup = this.generateMarkup();

    this.parentElement.insertAdjacentHTML('beforeend', markup);

    this.loadDataBtn = document
      .querySelector('.loadData')
      .addEventListener('click', e => {
        loadDataBtnHandler();
      });
  }

  generateMarkup() {
    return `
        <button class="loadData">Load random data</button>

        `;
  }
}
export default new LoadDataButton();
