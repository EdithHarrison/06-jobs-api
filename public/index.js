import { handleLoginRegister, showLoginRegister } from "./loginRegister.js";
import { handleLogin, showLogin } from "./login.js";
import { handleRegister, showRegister } from "./register.js";
import { handleSubscriptions, showSubscriptions } from "./subscriptions.js";
import { handleAddEdit, showAddEdit } from "./addEdit.js";

export let inputEnabled = true;
export let token = null;
export let message = document.getElementById("message");

export const setDiv = (div) => {
  document.querySelectorAll("body > div").forEach(d => d.style.display = "none");
  div.style.display = "block";
  console.log(`Displaying div: ${div.id}`);
};

export const enableInput = (enabled) => {
  inputEnabled = enabled;
};

export const setToken = (newToken) => {
  token = newToken;
};

let subscriptionDiv = null;
let company = null;
let dueDate = null;
let monthlyPayment = null;
let category = null;

export const handleSubscription = () => {
  subscriptionDiv = document.getElementById("subscription-div");
  company = document.getElementById("company");
  dueDate = document.getElementById("due-date");
  monthlyPayment = document.getElementById("monthly-payment");
  category = document.getElementById("category");
  const addSubscriptionButton = document.getElementById("add-subscription-button");
  const cancelSubscriptionButton = document.getElementById("cancel-subscription-button");

  subscriptionDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addSubscriptionButton) {
        enableInput(false);

        try {
          const response = await fetch("/api/v1/subscriptions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              company: company.value,
              dueDate: dueDate.value,
              monthlyPayment: monthlyPayment.value,
              category: category.value,
            }),
          });

          const data = await response.json();
          if (response.status === 201) {
            message.textContent = "Subscription added successfully.";
            company.value = "";
            dueDate.value = "";
            monthlyPayment.value = "";
            category.value = "Entertainment & Liesure"; // Set default category
            showSubscriptions();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.error(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === cancelSubscriptionButton) {
        company.value = "";
        dueDate.value = "";
        monthlyPayment.value = "";
        category.value = "Entertainment & Liesure"; // Set default category
        showSubscriptions();
      }
    }
  });
};

export const showSubscription = () => {
  company.value = null;
  dueDate.value = null;
  monthlyPayment.value = null;
  category.value = "Entertainment & Liesure"; // Set default category
  setDiv(subscriptionDiv);
};

// Ensure the DOM is fully loaded before running any scripts
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  handleLoginRegister();
  handleLogin();
  handleRegister();
  handleSubscriptions();
  handleAddEdit();
  showLoginRegister();  
});
