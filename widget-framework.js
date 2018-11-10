import widgets from './widget-list.js';
import WidgetElement from './widget-element.js';

if (!window.customElements.get('widget-instance')) {
  window.customElements.define("widget-instance", WidgetElement);
}

window.WidgetLoader = function(loader) {
  let template;
  
  try {
    template = widgets.find(w => {
      return w.type == loader.getAttribute('data-type');
    }).template;
  } catch (err) {
    console.error('data-type attribute missing or invalid', loader);
    return;
  }

  let widget = document.createElement('widget-instance');
  
  for (let attr in loader.attributes) {
    let a = loader.attributes[attr];
    if (a.name == 'data-type') {
      widget.setAttribute('type', a.value);
    } else if (typeof a.value !== 'undefined' && a.name !== 'src') {
      widget.setAttribute(a.name, a.value);
    }
  }
  
  loader.parentNode.replaceChild(widget, loader);

  let xhr = new XMLHttpRequest();
  xhr.open('GET', template);
  xhr.setRequestHeader('cache-control', 'max-stale');
  xhr.onload = function initializeWidget() {
    if (xhr.status == 200) {
      widget.shadowRoot.appendChild(new Range().createContextualFragment(xhr.responseText));
      widget.dispatchEvent(new Event(`${widget.getAttribute('type')}-init`, { bubbles : true, composed : true }));
    }
  };
  xhr.send();
};

window.Widget = function(type, controller) {
  document.addEventListener(`${type}-init`, event => {
    let w = event.target;
    if (w.getAttribute('initialized') == 'true') { return; }
    controller.call(null, w);
    w.setAttribute('initialized', true);
  });
};

document.dispatchEvent(new Event('widget-framework-ready'));