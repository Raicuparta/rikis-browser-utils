const getElement = id => document.getElementById(id);

Object.entries(optionFields).forEach(([id, { defaultValue, name }]) => {
  const input = document.createElement("input");
  const label = document.createElement("label");

  input.value = defaultValue;
  input.id = id;
  label.innerText = name;

  getElement("options-fields").appendChild(label);
  getElement("options-fields").appendChild(input);

  input.onkeyup = function () {
    global.storage.local.set({ [this.id]: this.value });
  }
});

function setupFields() {
  global.storage.local.get(optionKeyValues, items => {
    Object.keys(optionFields).forEach(id => {
      getElement(id).value = items[id];
    });
  });
}

getElement('reset').addEventListener('click', function () {
  global.storage.local.clear();
  setupFields();
});

setupFields();
