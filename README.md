# Tribute
A cross-browser `@mention` engine written in ES6, no dependencies. Tested in Firefox, Chrome, iOS Safari, Safari, IE 9+, Edge 12+, Android 4+.

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

<div class="mentionable">Some text here.</div>
<div class="mentionable">Some more text over here.</div>

<script>
  tribute.attach(document.getElementById('caaanDo'));

  // also works with NodeList
  tribute.attach(document.querySelectorAll('.mentionable'));
</script>
```

### A Collection
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
    return '@' + item.original.value;
  },

  // template for displaying item in menu
  menuItemTemplate: function (item) {
    return item.string;
  },

  // column to search against in the object
  lookup: 'key',

  // column that contains the content to insert by default
  fillAttr: 'value',

  // REQUIRED: array of objects to match
  values: []
}
```

### Tips
Some useful approaches to common roadblocks when implementing @mentions.

#### Updating a collection with new data
You can update an instance of Tribute on the fly. If you have new data you want to insert into a collection you can access the collection values array directly:

```
tribute.collection.values.push([
  {name: 'Howard Johnson', occupation: 'Panda Wrangler', age: 27},
  {name: 'Fluffy Croutons', occupation: 'Crouton Fluffer', age: 32}
]);
```

You can access and update any attribute on the collection in this way.

#### Programmatically detecting an active tribute dropdown
If you need to know when Tribute is active you can access the `isActive` property of an instance.

```
if (tribute.isActive) {
  console.log('Somebody is being mentioned!');
} else {
  console.log("Who's this guy talking to?");
}
```

#### Links inside contenteditable are not clickable.
If you want to embed a link in your `selectTemplate` then you need to make sure that the
anchor is wrapped in an element with `contenteditable="false"`. This makes the anchor
clickable *and* fixes issues with matches being modifiable.

```js
var tribute = new Tribute({
  values: [
    {key: 'Jordan Humphreys', value: 'Jordan Humphreys', email: 'jordan@zurb.com'},
    {key: 'Sir Walter Riley', value: 'Sir Walter Riley', email: 'jordan+riley@zurb.com'}
  ],
  selectTemplate: function (item) {
    return '<span contenteditable="false"><a href="http://zurb.com" target="_blank" title="' + item.original.email + '">' + item.original.value + '</a></span>';
  }
});
```
