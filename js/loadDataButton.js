class LoadDataButton {
  parentElement;
  loadDataBtn;
  render(loadDataBtnHandler, isEmpty) {
    this.parentElement = document.querySelector('.container');

    // If isEmpty = true, then we want to execute other lines in the code
    if (!isEmpty) return;

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
