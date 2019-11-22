const getElement = id => document.getElementById(id);

let fieldsMap = {}
optionFields.forEach(({ defaultValue, id, name }) => {
  fieldsMap[id] = defaultValue;
  const input = document.createElement("input");
  const label = document.createElement("label");

  input.value = defaultValue;
  input.id = id;
  label.innerText = name;

  getElement("options-fields").appendChild(label);
  getElement("options-fields").appendChild(input);

  input.onkeydown = function () {
    chrome.storage.local.set({ [this.id]: this.value });
  }
});

function setupFields() {
  chrome.storage.local.get(fieldsMap, items => {
    optionFields.forEach(field => {
      getElement(field.id).value = items[field.id];
    });
  });
}

getElement('reset').addEventListener('click', function () {
  chrome.storage.local.clear();
  setupFields();
});

setupFields();
