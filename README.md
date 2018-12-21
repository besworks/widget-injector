## Widget Injector

A simple method of loading self-contained HTML/CSS/JS widgets. Your content is insterted into the host page as a custom `<widget-instance>` element with a [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot).

## Usage

Just add a simple `script` element to your host page anywhere you want to inject a widget :

```
<script src="widget-injector.js data-content="widget.html"></script>
```

`data-content` is a required attribute and must point to a `.html` file which is structured like so :

```
<style>
    <!-- css for your widget -->
</style>

<!-- your widget's html markup goes here -->

<script>
    Widget(w => {
        console.log(w);
        // w is a reference to the <widget-instance> element
        // use it however you need...
        // example : w.shadowRoot.querySelector('#your_element');
        // all your widget controller logic must be inside this function.
    });
</script>
```

## Notes

The `<widget-instance>` element will replace the `<script>` element that injected it. All [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*) attributes as well as the `id` attribute will be copied and thus can be used for runtime configuration options.

So...

```
<body>
    <header>...</header>
    <main>
        <script id="widget-test" src="widget-injector.js" data-content="widget.html" data-client-id="42"></script>
    </main>
    <footer>...</footer>
</body>
```

Becomes...

```
<body>
    <header>...</header>
    <main>
        <widget-instance id="widget-test" data-content="widget.html" data-client-id="42"></widget-instance>
    </main>
    <footer>...</footer>
</body>
```

Therefore...

```
Widget(w => {
    console.log(w.id); // == "widget-test"
    console.log(w.dataset.clientId); // == "42"
    console.log(w.parentNode); // == <main>
});
```

## Widget Dependencies

If you need to include a library inside a widget, just use `<script src="whateverlib.js">`. The widget controller will not trigger until all external scripts have been fetched. You could also use `<script type="module">` and ES6 imports inside your widget if you wish.