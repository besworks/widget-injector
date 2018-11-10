// WIDGET CONSTRUCTOR
function Widget(type, controller) {
  document.addEventListener(`${type}-init`, event => {
    let w = event.target;
    // ONLY CALL THE CONTROLLER ONCE PER INSTANCE OF THE WIDGET
    if (w.getAttribute('initialized') == 'true') { return; }
    controller.call(null, w);
    w.setAttribute('initialized', true);
  });
}

// DEFINE A CUSTOM ELEMENT WITH A SHADOWROOT
window.customElements.define("widget-instance", class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode : "open" });
  }
});

// CREATE AN INSTANCE OF THE ELEMENT
let widget = document.createElement('widget-instance');

// GET YOUR OWN CONTENT FROM SOMEWHERE
let content = new Range().createContextualFragment(`
  <style>
    #myWidget { background-color: orange; padding: 1rem; }
    #myWidget.test { background-color: limegreen; }
  </style>
  <div id="myWidget"> It's a Widget! </div>
  <script>
    // CALL THE WIDGET CONSTRUCTOR FROM INSIDE THE WIDGET CONTENT
    Widget('my-widget', widget => {
      console.log(widget);
      let el = widget.shadowRoot.querySelector('#myWidget');
      el.classList.add('test');
    });
  </script>
`);

// ADD THE WIDGET TO THE DOM
document.body.appendChild(widget);

// APPEND THE CONTENT
widget.shadowRoot.appendChild(content);

// INITIALIZE THE WIDGET
widget.dispatchEvent(new Event('my-widget-init', { bubbles : true, composed : true }));