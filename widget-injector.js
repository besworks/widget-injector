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
    let content = new Range().createContextualFragment(xhr.responseText);
    widget.shadowRoot.appendChild(content);
    loader.parentNode.replaceChild(widget, loader);
    
    function triggerWidget() {
      widget.dispatchEvent(new Event('widget-init', {
        bubbles : true,
        composed : true
      }));
    }
    
    let scripts = [...widget.shadowRoot.querySelectorAll('script[src]')];
    
    function delayedTrigger() {
      scripts.splice(scripts.indexOf(this), 1);

      if (scripts.length) {
        return;
      } else {
        triggerWidget();
      }
    }

    if (scripts.length) {
      scripts.forEach(s => {
        s.addEventListener('load', delayedTrigger.bind(s));
        s.addEventListener('error', delayedTrigger.bind(s));
      });
    } else {
      triggerWidget();
    }

  });
  xhr.send();
})();