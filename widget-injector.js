(function WidgetInjector(){
  'use strict';

  let loader = document.currentScript;
  let framework = './widget-framework.js';

  function loadWidget() {
    WidgetLoader(loader);
  }

  if (typeof window.WidgetLoader == 'function') {
    loadWidget();
  } else {
    document.addEventListener('widget-framework-ready', loadWidget);
    if (!document.querySelector(`script[src="${framework}"]`)) {
      let s = document.createElement('script');
      s.src = framework;
      s.type = 'module';
      document.head.appendChild(s);
    }
  }
})();