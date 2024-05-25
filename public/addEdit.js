import { enableInput, setDiv, message, token, inputEnabled } from "./index.js";
import { showSubscriptions } from "./subscriptions.js";

let addEditDiv = null;
let company = null;
let dueDate = null;
let monthlyPayment = null;
let status = null;
let category = null;
let addingSubscription = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("add-edit-div");
  company = document.getElementById("company");
  dueDate = document.getElementById("dueDate");
  monthlyPayment = document.getElementById("monthlyPayment");
  status = document.getElementById("status");
  category = document.getElementById("category");
  addingSubscription = document.getElementById("adding-subscription");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingSubscription) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/subscriptions";

        if (addingSubscription.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/subscriptions/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,  // Ensure token is included
            },
            body: JSON.stringify({
              company: company.value,
              dueDate: dueDate.value,
              monthlyPayment: monthlyPayment.value,
              status: status.value,
              category: category.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            message.textContent =
              response.status === 200
                ? "The subscription was updated."
                : "The subscription was created.";

            company.value = "";
            dueDate.value = "";
            monthlyPayment.value = "";
            status.value = "free trial";
            category.value = "";

            showSubscriptions();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target.id === "edit-cancel") {
        message.textContent = "";
        showSubscriptions();
      }
    }
  });
};

export const showAddEdit = async (subscriptionId) => {
  addEditDiv = document.getElementById("edit-subscription");
  company = document.getElementById("company");
  dueDate = document.getElementById("dueDate");
  monthlyPayment = document.getElementById("monthlyPayment");
  status = document.getElementById("status");
  category = document.getElementById("category");
  addingSubscription = document.getElementById("adding-subscription");

  if (!subscriptionId) {
    company.value = "";
    dueDate.value = "";
    monthlyPayment.value = "";
    status.value = "free trial";
    category.value = "";
    addingSubscription.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/subscriptions/${subscriptionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        company.value = data.subscription.company;
        dueDate.value = data.subscription.dueDate;
        monthlyPayment.value = data.subscription.monthlyPayment;
        status.value = data.subscription.status;
        category.value = data.subscription.category;
        addingSubscription.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = subscriptionId;

        setDiv(addEditDiv);
      } else {
        message.textContent = "The subscription was not found";
        showSubscriptions();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error occurred.";
      showSubscriptions();
    }

    enableInput(true);
  }
};
