# Widget Injector

With the deprecation of HTML Imports an alternate method of loading WebComponents for use/re-use is required.

### Goals

1. Enable loading a self-contained widget from a single html file by adding only a single script tag to an HTML document.
2. Work around the fact that [`document.currentScript`](https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript) is `null` from within a `<script>` element that resides inside a [`ShadowRoot`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot).

### Execution Flow

- A `<script>` element is included at any point in the document body. The `src` attribute must point to `widget-injector.js` and a `data-type` attribute must be provided that matches an entry in `widget-list.js`.

- `WidgetInjector` tests to see if the widget framework is available and loads it if necessary before instantiating the widget. The widget framework makes two global functions available. `WidgetLoader` and `Widget`.

- `WidgetLoader` is called automatically and the widget's content is loaded asynchronously using the http header "cache-control: max-stale" to prevent duplicate requests back to the server.

- Inside the widget's html file, a script element must call the `Widget` function passing it's `type` (matching the entry in `widget-list.js`) and a `controller` function that takes one argument which will contain a reference to the widget host element. The `Widget` function adds an `EventListener` to the host document for the event `${widget.type}-init`.

- The loader script element is replaced with a `<widget-instance>` custom element containing the widget's `ShadowRoot` and the `${widget.type}-init` event is dispatched on the widget element itself which then bubbles up to the host document object where the previously added `EventListener` calls the `controller` function with the `EventTarget` as it's one parameter.

### Examples

`index.html` contains five test cases:

1. Injecting a widget
2. Injecting a duplicate widget
3. Passing attributes to a widget from it's loader script element
4. Injecting a second disparate widget
5. Injecting an invalid widget