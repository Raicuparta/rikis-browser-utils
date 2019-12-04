const getElement = id => document.getElementById(id);

Object.entries(optionFields).forEach(([id, { defaultValue, name }]) => {
  const input = document.createElement("input");
  const label = document.createElement("label");

  input.value = defaultValue;
  input.id = id;
  label.innerText = name;

  getElement("options-fields").appendChild(label);
  getElement("options-fields").appendChild(input);

  input.onkeydown = function () {
    browser.storage.local.set({ [this.id]: this.value });
  }
});

function setupFields() {
  browser.storage.local.get(optionKeyValues, items => {
    Object.keys(optionFields).forEach(id => {
      getElement(id).value = items[id];
    });
  });
}

getElement('reset').addEventListener('click', function () {
  browser.storage.local.clear();
  setupFields();
});

setupFields();
