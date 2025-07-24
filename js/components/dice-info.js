import { getDefaultDice } from "../utilities.js";
import "./dice-side.js";

const diceWrapper = (children = "") => /*html*/ `
<div>
  <link rel="stylesheet" href="./css/dice.css" />
  ${children}
</div>`;

const DICE_VIEW = diceWrapper(/*html*/ `
  <div data-flex="column" data-gap="5">
    <div>
      <h3 id="title-display"></h3>
      <button type="button" id="edit-btn">Edit</button>
    </div>
    <label data-flex="column" data-gap="2">
      <span>Quantity</span>
      <input type="number" id="quantity-input" min="1" max="20" />
    </label>
    <div>
      <span>Sides: </span>
      <span id="sides-display"></span>
    </div>
  </div>
`);

const DICE_EDIT = diceWrapper(/*html*/ `
  <form data-flex="column" data-gap="5">
    <label data-flex="column" data-gap="2">
      <span>Dice title</span>
      <input type="text" name="title" required minlength="2" maxlength="30" />
    </label>
    <div id="sides" data-flex="column" data-gap="5"></div>
    <div>
      <button type="submit">Save</button>
      <button type="button" id="cancel-btn">Cancel</button>
    </div>
  </form>
`);

class DiceInfo extends HTMLElement {
  constructor() {
    super();
    this._dice = null;
    this.isEditing = false;
  }

  static get observedAttributes() {
    return ["title", "quantity", "sides"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    // Initialize dice object if it doesn't exist
    if (!this._dice) {
      this._dice = { title: "", quantity: 1, sides: [] };
    }

    const actions = {
      title: (val) => {
        this._dice.title = val || "";
      },
      quantity: (val) => {
        this._dice.quantity = parseInt(val) || 1;
      },
      sides: (val) => {
        this._dice.sides = val ? val.split(",").map((s) => s.trim()) : [];
      },
    };

    if (actions[name]) {
      actions[name](newValue);
    }

    // Determine editing mode
    this.isEditing =
      !this._dice.title || !this._dice.sides || this._dice.sides.length === 0;

    if (this.isConnected) {
      this.render();
    }
  }

  connectedCallback() {
    // Initialize from attributes if no dice object exists
    if (!this._dice) {
      this._dice = {
        title: this.getAttribute("title") || "",
        quantity: parseInt(this.getAttribute("quantity")) || 1,
        sides: this.getAttribute("sides")
          ? this.getAttribute("sides")
              .split(",")
              .map((s) => s.trim())
          : [],
      };
      this.isEditing =
        !this._dice.title || !this._dice.sides || this._dice.sides.length === 0;
    }
    this.render();
  }

  get dice() {
    return this._dice;
  }

  set dice(value) {
    this._dice = value;

    // Update attributes to reflect the new dice values
    if (value) {
      this.setAttribute("title", value.title || "");
      this.setAttribute("quantity", value.quantity || 1);
      this.setAttribute("sides", value.sides ? value.sides.join(",") : "");
    }

    this.isEditing =
      !value || !value.title || !value.sides || value.sides.length === 0;
    if (this.isConnected) {
      this.render();
    }
  }

  render() {
    if (this.isEditing) {
      this.innerHTML = DICE_EDIT;
      this.setupEditMode();
    } else {
      this.innerHTML = DICE_VIEW;
      this.setupViewMode();
    }
  }

  setupViewMode() {
    if (!this._dice) return;

    const titleDisplay = this.querySelector("#title-display");
    const quantityInput = this.querySelector("#quantity-input");
    const sidesDisplay = this.querySelector("#sides-display");
    const editBtn = this.querySelector("#edit-btn");

    titleDisplay.textContent = this._dice.title;
    quantityInput.value = this._dice.quantity || 1;
    sidesDisplay.textContent = this._dice.sides.join(", ");

    // Add quantity change listener
    quantityInput.addEventListener("input", (e) => {
      const newQuantity = parseInt(e.target.value);
      if (newQuantity && newQuantity >= 1 && newQuantity <= 20) {
        this._dice.quantity = newQuantity;
        this.dispatchEvent(
          new CustomEvent("quantitychange", {
            detail: { quantity: newQuantity, dice: this._dice },
          })
        );
      }
    });

    // Add edit button listener
    editBtn.addEventListener("click", () => {
      this.isEditing = true;
      this.render();
    });
  }

  setupEditMode() {
    const form = this.querySelector("form");
    const titleInput = this.querySelector("input[name='title']");
    const sidesContainer = this.querySelector("#sides");
    const cancelBtn = this.querySelector("#cancel-btn");

    // Populate form if we have dice data
    if (this._dice) {
      titleInput.value = this._dice.title || "";

      sidesContainer.innerHTML = "";
      const sides = this._dice.sides || ["1"];
      sides.forEach((side) => {
        const sideInput = document.createElement("dice-side-input");
        sideInput.setAttribute("value", side);
        sidesContainer.appendChild(sideInput);
      });
    } else {
      // Default single side if no dice
      const sideInput = document.createElement("dice-side-input");
      sideInput.setAttribute("value", "1");
      sidesContainer.appendChild(sideInput);
    }

    // Add form submit listener
    form.addEventListener("submit", (e) => {
      this.handleSubmit(e);
    });

    // Add cancel button listener
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        if (
          this._dice &&
          this._dice.title &&
          this._dice.sides &&
          this._dice.sides.length > 0
        ) {
          this.isEditing = false;
          this.render();
        }
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const title = formData.get("title");
    const sides = formData
      .getAll("side[]")
      .filter((side) => side.trim() !== "");

    if (title && sides.length > 0) {
      const updatedDice = {
        ...this._dice,
        title,
        sides,
        quantity: this._dice?.quantity || 1,
      };

      this._dice = updatedDice;
      this.isEditing = false;

      this.dispatchEvent(
        new CustomEvent("dicechange", {
          detail: { dice: updatedDice },
        })
      );

      this.render();
    }
  }
}

customElements.define("dice-info", DiceInfo);
