(function WidgetInjector(){
  'use strict';
  
  window.Widget = function(controller) {
    if (!controller) {
      throw new Error('widget controller missing');
    } else if (typeof controller !== 'function') {
      throw new Error('widget controller is not a function');
    }

    let initializeWidget = function(event) {
      this.call(null, event.target);
      document.removeEventListener('widget-init', initializeWidget)
    }.bind(controller);

    document.addEventListener('widget-init', initializeWidget);
  };

  if (!window.customElements.get('widget-instance')) {
    window.customElements.define('widget-instance', class WidgetElement extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode : 'open' });
      }
    });
  }

  let loader = document.currentScript;
  let source = loader.dataset.content;
  let widget = document.createElement('widget-instance');
  let xhr = new XMLHttpRequest();

  if (loader.id) {
    widget.id = loader.id;
  }
  
  Object.assign(widget.dataset, loader.dataset);
  
  xhr.open('GET', source);
  xhr.addEventListener('load', () => {
    widget.shadowRoot.appendChild(new Range().createContextualFragment(xhr.responseText));
    loader.parentNode.replaceChild(widget, loader);
    widget.dispatchEvent(new Event('widget-init', {
      bubbles : true,
      composed : true
    }));
  });
  xhr.send();
})();