export default class WidgetElement extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode : "open" });
  }
}