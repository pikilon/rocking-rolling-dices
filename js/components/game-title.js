import { gameState } from "../global-state.js";

class GameTitle extends HTMLElement {
  constructor() {
    super();
    this.title = gameState.getState().title;
  }

  connectedCallback() {
    this.render();

    // Subscribe to global state changes
    this.unsubscribe = gameState.subscribe((newState) => {
      console.log("newState", newState);
      if (newState.title === this.title) return;
      this.title = newState.title;
      this.render();
    });
  }

  disconnectedCallback() {
    this.unsubscribe?.();
  }

  render() {
    const { title } = this;

    if (!title) return this.showForm();

    // Show the title
    this.innerHTML = `
        <div class="game-title">
          <h1>${this.escapeHtml(title)}</h1>
          <button class="edit-title-btn" type="button">Edit Title</button>
        </div>
      `;

    // Add event listener for edit button
    this.querySelector(".edit-title-btn").addEventListener("click", () => {
      this.showForm(title);
    });
  }

  showForm(currentTitle = "") {
    this.innerHTML = `
      <div class="game-title-form">
        <form class="title-form">
          <div class="form-group">
            <label for="game-title-input">Game Title:</label>
            <input 
              type="text" 
              id="game-title-input" 
              name="title" 
              value="${this.escapeHtml(currentTitle)}"
              placeholder="Enter your game title"
              required
              autofocus
            />
          </div>
          <div class="form-actions">
            <button type="submit" class="save-btn">Save Title</button>
            ${
              currentTitle
                ? '<button type="button" class="cancel-btn">Cancel</button>'
                : ""
            }
          </div>
        </form>
      </div>
    `;

    // Add form event listeners
    const form = this.querySelector(".title-form");
    const cancelBtn = this.querySelector(".cancel-btn");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleFormSubmit(e);
    });

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.render(); // Go back to display mode
      });
    }
  }

  handleFormSubmit(event) {
    const formData = new FormData(event.target);
    const title = formData.get("title").trim();

    if (title) {
      // Update the global state with the new title
      gameState.setState((state) => ({
        ...state,
        title: title,
      }));
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Define the custom element
customElements.define("game-title", GameTitle);
