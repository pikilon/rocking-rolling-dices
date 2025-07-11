import { getDefaultDice } from "../utilities.js";
import "./dice-side.js";

class DiceDialog extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = ""; // Initialize innerHTML
  }

  connectedCallback() {
    fetch("/js/components/dice-dialog.html")
      .then((response) => response.text())
      .then((html) => {
        this.innerHTML = html;
      });
  }

  submitForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const title = formData.get("title");
    const sides = formData.getAll("side[]");
    const newDice = { title, sides };
    return newDice;
  }

  addDice({ dice = getDefaultDice(), callback = console.log } = {}) {
    const { title, sides } = dice;
    const titleInput = this.querySelector("input[name='title']");
    titleInput.value = title;
    const sidesContainer = this.querySelector("#sides");
    sidesContainer.innerHTML = ""; // Clear existing sides
    sides.forEach((side) => {
      const sideInput = document.createElement("dice-side-input");
      sideInput.setAttribute("value", side);
      sidesContainer.appendChild(sideInput);
    });
    const form = this.querySelector("form:not([method])");
    form.addEventListener("submit", (e) => {
      const newDice = this.submitForm(e);
      callback(newDice);
      this.querySelector("dialog").close();
    });
    this.showModal();
  }

  showModal() {
    this.querySelector("dialog").showModal();
  }
}

customElements.define("dice-dialog", DiceDialog);
