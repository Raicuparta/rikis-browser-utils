const getElementsByPlaceholder = placeholder =>
  Array.from(document.getElementsByTagName('input'))
    .filter(element => element.getAttribute('placeholder') == placeholder);

const fillAbacusFields = () => {
  const fromInputs = getElementsByPlaceholder('Start');
  const toInputs = getElementsByPlaceholder('End');

  if (fromInputs.length === 1) {
    const from = fromInputs[0];
    from.value = '8:30';
    from.focus();

    const to = toInputs[0];
    to.value = '12:00';
    to.focus();
    to.blur();

    setTimeout(fillAbacusFields, 200);
  }

  if (fromInputs.length === 2) {
    const from = fromInputs[1];
    from.value = '13:00';
    from.focus();

    const to = toInputs[1];
    to.value = '17:54';
    to.focus();
    to.blur();
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message === 'FillAbacus') {
    fillAbacusFields();
  }
})

document.addEventListener('keyup', event => {
  chrome.storage.local.get(['fillAbacus'], ({ fillAbacus }) => {
    if (event.key === 'f' && fillAbacus) {
      fillAbacusFields();
    }
  })
});
