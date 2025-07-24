// ManageDices web component: sidebar for managing dice in the game set
import { gameState } from "../global-state.js";
import "./dice-info.js";

class ManageDices extends HTMLElement {
  handleRemoveDice(title) {
    gameState.removeDice(title);
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.unsubscribe = null;
    this.handleAddDice = this.handleAddDice.bind(this);
    this.handleDiceEdit = this.handleDiceEdit.bind(this);
  }

  connectedCallback() {
    this.render();
    this.unsubscribe = gameState.subscribe(() => this.render());
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
  }

  handleAddDice() {
    // If an empty dice is already present, do nothing
    if (this._hasEmptyDice()) return;
    // Add a placeholder for an empty dice-info in edit mode
    this._showEmptyDice = true;
    this.render();
  }

  handleDiceEdit(e) {
    const { title, sides, quantity } = e.detail;
    // Only add if title and sides are valid
    if (title && sides && sides.length > 0) {
      gameState.addDice({ title, sides, quantity });
      this._showEmptyDice = false;
      this.render();
    }
  }

  render() {
    const state = gameState.getState();
    const dices = state.dices || {};
    const diceList = Object.values(dices);
    // Show empty dice-info if requested or if no dices exist
    const showEmpty = this._showEmptyDice || diceList.length === 0;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: var(--sidebar-bg, #f8f8f8);
          padding: 1rem;
          border-right: 1px solid #ddd;
          min-width: 220px;
          max-width: 300px;
        }
        button {
          padding: 0.5em 1em;
          font-size: 1em;
          cursor: pointer;
        }
        .dices-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .dice-row {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }
        .remove-btn {
          background: #f44336;
          color: #fff;
          border: none;
          border-radius: 3px;
          padding: 0.2em 0.6em;
          font-size: 0.9em;
          cursor: pointer;
        }
      </style>
      <button id="add-dice">Add Dice</button>
      <div class="dices-list">
        ${showEmpty ? `<dice-info></dice-info>` : ""}
        ${diceList
          .map(
            (dice) => `
          <div class="dice-row">
            <dice-info 
              title="${dice.title}"
              sides="${dice.sides.join(",")}"
              quantity="${dice.quantity}"
            ></dice-info>
            <button class="remove-btn" data-title="${dice.title}">✕</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;
    this.shadowRoot.getElementById("add-dice").onclick = this.handleAddDice;
    // Listen for edits from dice-info children
    this.shadowRoot.querySelectorAll("dice-info").forEach((el) => {
      el.addEventListener("dice-edit", this.handleDiceEdit);
    });
    // Listen for remove button clicks
    this.shadowRoot.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.onclick = (e) => {
        const title = btn.getAttribute("data-title");
        if (title) this.handleRemoveDice(title);
      };
    });
  }

  _hasEmptyDice() {
    // Returns true if an empty dice-info is present (edit mode, no title/sides)
    const state = gameState.getState();
    const dices = state.dices || {};
    const diceList = Object.values(dices);
    if (this._showEmptyDice) return true;
    if (diceList.length === 0) return false;
    return false;
  }
}

customElements.define("manage-dices", ManageDices);
