class DiceSideInput extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const template = document.getElementById("dice-side-template");
    const clone = template.content.cloneNode(true);
    const value = this.getAttribute("value") || "";
    clone.querySelector("input").value = value;
    this.appendChild(clone);
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
