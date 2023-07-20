import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const firebaseConfig = {
  databaseURL:
    "https://myproject-b074c-default-rtdb.europe-west1.firebasedatabase.app/",
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const shoppingListInDB = ref(database, "shopping-list");

document.getElementById("add-button").addEventListener("click", addToDataBase);

const newItemEl = document.getElementById("input-field");
const shoppingListEl = document.getElementById("shopping-list");

function addToDataBase() {
  if (newItemEl.value) {
    push(shoppingListInDB, newItemEl.value);
  }
  cleanTheInputField();
}

function cleanTheInputField() {
  newItemEl.value = "";
}

function renderList() {
  onValue(shoppingListInDB, snapshot);
}

function snapshot(snapshot) {
  shoppingListEl.innerHTML = "";

  if (snapshot.exists()) {
    const listItems = Object.entries(snapshot.val());

    listItems
      .map((listItem) => {
        const li = document.createElement("li");
        li.setAttribute("id", listItem[0]);
        li.textContent = listItem[1];
        shoppingListEl.appendChild(li);
        li.addEventListener("dblclick", () => {
          const exactLocationOfItemInDB = ref(
            database,
            `shopping-list/${listItem[0]}`
          );
          remove(exactLocationOfItemInDB);
        });
      })
      .join("");
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
}

renderList();
