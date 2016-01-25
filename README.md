# Tribute
A cross-browser `@mention` engine written in ES6, no dependencies. Tested in Firefox, Chrome, iOS Safari, Safari, IE 9+, Edge 12.

### Initializing
There are two ways to initialize Tribute, by passing an array of "collections" or by passing one collection object.

```js
var tribute = new Tribute({
  values: [
    {key: 'Phil Heartman', value: 'pheartman'},
    {key: 'Gordon Ramsey', value: 'gramsey'}
  ]
})
```

You can pass multiple collections on initialization by passing in an array of collection objects to `collection`.

```js
var tribute = new Tribute({
  collection: []
})
```

#### Attaching to elements
Once initialized, Tribute can be attached to an `input`, `textarea`, or an element that supports `contenteditable`. It also works in WYSIWYG iframes like TinyMCE.

```html
<div id="caaanDo">I'm Mr. Meeseeks, look at me!</div>

<script>
  tribute.attach(document.getElementById('caaanDo'));
</script>
```

#### A Collection
Collections are configuration objects for Tribute, you can have multiple for each instance. This is useful for scenarios where you may want to match multiple trigger keys, such as `@` for users and `#` for projects.


Collection object shown with defaults:
```js
{
  // symbol that starts the lookup
  trigger: '@',

  // element to target for @mentions
  iframe: null,

  // class added in the flyout menu for active item
  selectClass: 'highlight',

  // function called on select that returns the content to insert
  selectTemplate: function (item) {
    return '@' + item.value;
  },

  // template for displaying item in menu
  menuItemTemplate: function (matchResult) {
    return matchResult.string;
  },

  // column to search against in the object
  lookup: 'key',

  // column that contains the content to insert by default
  fillAttr: 'value',

  // REQUIRED: array of objects to match
  values: []
}
```

#### Remaining things before open source
* Test suite
