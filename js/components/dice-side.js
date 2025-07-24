const template = /*html*/ `<label class="dice">
      <span>Side</span>
      <input type="text" name="side[]" minlength="1" maxlength="3" required />
      <button class="remove" type="button">Remove</button>
      <button class="add" type="button">Add</button>
    </label>`;

class DiceSideInput extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = template;
    const value = this.getAttribute("value") || "";
    this.querySelector("input").value = value;
    this.querySelector(".remove").addEventListener("click", () => {
      this.remove();
    });
    this.querySelector(".add").addEventListener("click", () => {
      const newSide = document.createElement("dice-side-input");
      this.parentNode.insertBefore(newSide, this.nextSibling);
      newSide.querySelector("input").focus();
    });
  }
}
customElements.define("dice-side-input", DiceSideInput);
