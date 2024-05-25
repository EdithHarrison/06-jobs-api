import { enableInput, setDiv, message, token, setToken, inputEnabled } from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let subscriptionsDiv = null;
let subscriptionsTable = null;
let subscriptionsTableHeader = null;

export const handleSubscriptions = () => {
  subscriptionsDiv = document.getElementById("subscriptions");
  const logoff = document.getElementById("logoff");
  const addSubscription = document.getElementById("add-subscription");
  subscriptionsTable = document.getElementById("subscriptions-table");
  subscriptionsTableHeader = document.getElementById("subscriptions-table-header");

  subscriptionsDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addSubscription) {
        showAddEdit(null);  // Show the add/edit form
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        subscriptionsTable.replaceChildren([subscriptionsTableHeader]);
        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        enableInput(false);
        try {
          const response = await fetch(`/api/v1/subscriptions/${e.target.dataset.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            const data = await response.json();
            message.textContent = data.msg;
            await showSubscriptions();  // Ensure the table is updated after deletion
          } else {
            const data = await response.json();
            message.textContent = data.msg;
          }
        } catch (err) {
          console.error(err);
          message.textContent = "A communication error occurred.";
        }
        enableInput(true);
      }
    }
  });
};

export const showSubscriptions = async () => {
  try {
    enableInput(false);
    const response = await fetch("/api/v1/subscriptions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [subscriptionsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        subscriptionsTable.replaceChildren(...children);  // Clear this for safety
      } else {
        for (let i = 0; i < data.subscriptions.length; i++) {
          let rowEntry = document.createElement("tr");
          let date = new Date(data.subscriptions[i].dueDate);

          rowEntry.innerHTML = `<td class="company">${data.subscriptions[i].company}</td><td>${date.toLocaleDateString()}</td><td>${data.subscriptions[i].monthlyPayment.toFixed(2)}</td><td>${data.subscriptions[i].status}</td><td>${data.subscriptions[i].category}</td><td><button type="button" class="editButton" data-id="${data.subscriptions[i]._id}">Edit</button></td><td><button type="button" class="deleteButton" data-id="${data.subscriptions[i]._id}">Delete</button></td>`;
          children.push(rowEntry);
        }
        subscriptionsTable.replaceChildren(...children);
      }
      setDiv(subscriptionsDiv);
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.error(err);
    message.textContent = "A communications error has occurred.";
  }
  enableInput(true);
};
