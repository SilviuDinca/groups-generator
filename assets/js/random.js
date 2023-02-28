"use strict";
const textInput = document.querySelector(".text-input");
const addButton = document.querySelector(".add-button");
const list = document.querySelector(".list");
const toggleSwitch = document.querySelector(".switch");
const generate = document.querySelector(".generate");
const li = document.querySelector("li");
const groups = document.querySelector(".groups");
const namesPlaceholder = document.querySelector(".names-placeholder");
const timeline = gsap.timeline();

initalList();

addButton.addEventListener("click", addListItem);
textInput.addEventListener("keypress", addEnterList);
list.addEventListener("click", deleteItem);
toggleSwitch.addEventListener("click", changeTheme);
generate.addEventListener("click", function () {
  const groupsArray = generateGroups();
  renderGroups(groupsArray);
});

function addEnterList(e) {
  if (e.key === "Enter") addListItem();
}

function deleteItem(e) {
  if (e.target.className === "mdi mdi-trash-can-outline") {
    e.target.parentElement.remove();
    if (list.children.length === 0) {
      namesPlaceholder.style.display = "block";
    } else {
      namesPlaceholder.style.display = "none";
    }
  }

  saveListToStorage();
}

function addListItem() {
  // If text input is empty don't add list item

  if (textInput.value.trim() === "") return;

  // Get created list item
  const listItem = createListItem();

  // Append list item to the list
  list.appendChild(listItem);

  if (list.children.length === 0) {
    namesPlaceholder.style.display = "block";
  } else {
    namesPlaceholder.style.display = "none";
  }

  // Clear the input text
  clearInput();

  saveListToStorage();
}

function createListItem() {
  // Get value of the input text
  const inputValue = textInput.value;

  // Create a list item node
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    ${inputValue}
    <span class="mdi mdi-trash-can-outline"></span>`;

  return listItem;
}

function clearInput() {
  textInput.value = "";
}

function changeTheme() {
  const checkbox = document.querySelector(".switch  > input");
  if (checkbox.checked === true) {
    document.body.className = "dark-theme";
    localStorage.setItem("theme", "dark-theme");
  } else {
    document.body.className = "light-theme";
    localStorage.setItem("theme", "light-theme");
  }
}

function saveListToStorage() {
  const listChildren = document.querySelectorAll(".list > li");

  const listArray = [];

  for (let i = 0; i < listChildren.length; i++) {
    listArray.push({ value: listChildren[i].innerText });
  }
  const listArrayAsString = JSON.stringify(listArray);
  localStorage.setItem("app-random", listArrayAsString);
}

function initalList() {
  const generatedGroups = localStorage.getItem("generated-groups");
  if (generatedGroups !== null) {
    renderGroups(JSON.parse(generatedGroups));
  }

  const theme = localStorage.getItem("theme");
  if (theme === null) {
    document.body.className = "light-theme";
  } else {
    if (theme === "light-theme") {
      document.body.className = "light-theme";
    }
    if (theme === "dark-theme") {
      const checkbox = document.querySelector(".switch  > input");
      checkbox.checked = true;
      document.body.className = "dark-theme";
    }
  }
  const listArrayAsString = localStorage.getItem("app-random");

  const listArray = JSON.parse(listArrayAsString) || [];
  if (listArray.length === 0) {
    namesPlaceholder.style.display = "block";
  } else {
    namesPlaceholder.style.display = "none";
  }

  for (let i = 0; i < listArray.length; i++) {
    const listItem = document.createElement("li");

    listItem.innerHTML = `
        ${listArray[i].value}
       <span class="mdi mdi-trash-can-outline"></span>
             `;
    list.appendChild(listItem);
  }
}

function generateGroups() {
  const listArray = [];
  const listChildren = document.querySelectorAll(".list > li");
  for (let i = 0; i < listChildren.length; i++) {
    const value = listChildren[i].innerText;
    listArray.push(value);
  }
  const groups = [];
  while (listArray.length > 0) {
    const firstRandomNumber = randomName(listArray);
    const firstPerson = listArray[firstRandomNumber];

    listArray.splice(firstRandomNumber, 1);

    const secondRandomNumber = randomName(listArray);
    const secondPerson = listArray[secondRandomNumber];

    listArray.splice(secondRandomNumber, 1);

    groups.push([firstPerson, secondPerson]);
  }
  localStorage.setItem("generated-groups", JSON.stringify(groups));
  return groups;
}

function createGroup(name1, name2, number) {
  const group = document.createElement("div");
  let indexTwo = " -&nbsp;<span>2</span>&nbsp;";
  if (name2 === undefined) {
    name2 = "";
    indexTwo = "";
  }
  group.className = "group";
  group.innerHTML = `
        <div class="group-number"><b>Group ${number}</b></div>
        <div class="group-name"><span>1</span>&nbsp;${name1}${indexTwo}${name2}</div>
    `;
  return group;
}

function renderGroups(groupsArray) {
  groups.innerHTML = "";
  for (let i = 0; i < groupsArray.length; i++) {
    groups.appendChild(
      createGroup(groupsArray[i][0], groupsArray[i][1], i + 1)
    );
  }
  const task = document.querySelector(".groups-placeholder");
  if (groups.children.length === 0) {
    task.style.display = "block";
  } else {
    task.style.display = "none";
  }
}

function randomName(listArray) {
  return Math.floor(Math.random() * listArray.length);
}

// GSAP

timeline
  .from(".groups", {
    duration: 0.6,
    y: 300,
    opacity: 0,
    delay: 0.5,
    ease: "power",
  });