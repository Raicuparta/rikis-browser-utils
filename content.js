const getElementsByPlaceholder = placeholder => {
  return Array.from(document.getElementsByTagName('input'))
    .filter(element => element.getAttribute('placeholder') == placeholder);
}

global.storage.local.get(optionKeyValues, items => {
  const fillAbacusFields = () => {
    const fromInputs = getElementsByPlaceholder('Start');
    const toInputs = getElementsByPlaceholder('End');
  
    if (fromInputs.length === 1) {
      const from = fromInputs[0];
      from.value = items.abacusMorningStart;
      from.focus();
  
      const to = toInputs[0];
      to.value = items.abacusMorningEnd;
      to.focus();
      to.blur();
  
      setTimeout(fillAbacusFields, 100);
    }
  
    if (fromInputs.length === 2) {
      const from = fromInputs[1];
      from.value = items.abacusAfternoonStart;
      from.focus();
  
      const to = toInputs[1];
      to.value = items.abacusAfternoonEnd;
      to.focus();
      to.blur();
  
      setTimeout(submit, 100);
    }
  }
  
  const submit = () => {
    var button = document.getElementsByClassName("v-button-primary")[0];
    button.click();
  }
  
  global.runtime.onMessage.addListener((message) => {
    if (message === 'FillAbacus') {
      fillAbacusFields();
    }
  })
  
  document.addEventListener('keyup', event => {
    if (event.key === 'f' && items.fillAbacus) {
      fillAbacusFields();
    }
  });
});
