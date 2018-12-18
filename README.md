## Widget Injector

A simple method of loading self-contained HTML/CSS/JS widgets. Your content is insterted into the host page as a custom `<widget-instance>` element with a [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot).

## Usage

In your host file :

```
<script src="widget-injector.js data-content="widget.html">
```

In your widget file :

```
<style>
    <!-- css for your widget -->
</style>

<!-- your html markup goes here -->

<script>
    Widget(w => {
        console.log(w);
        // w is a reference to the host element
        // use it however you need...
        // example : w.shadowRoot.querySelector('#your_element');
    });
</script>
```

## Notes

All [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*) attributes will be copied from the loader `<script>` element to the `<widget-instance>` element and thus can be used for runtime configuration options. The `id` attribute will also be carried over.

```
<script src="widget-injector.js" id="widget-test" data-content="widget.html" data-client-id="42">
```

Becomes...

```
<widget-instance id="widget-test" data-content="widget.html" data-client-id="42"></widget-instance>
```

Therefore...

```
Widget(w => {
    console.log(w.id); // == "widget-test"
    console.log(w.dataset.clientId); // == "42"
});
```