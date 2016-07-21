# Tribute
A cross-browser `@mention` engine written in ES6, no dependencies. Tested in Firefox, Chrome, iOS Safari, Safari, IE 9+, Edge 12+, Android 4+, and Windows Phone.

## Installing
There are a few ways to install Tribute; [Bower](http://bower.io/), as an [NPM Module](https://npmjs.com/package/tributejs), or by [downloading](https://github.com/zurb/tribute/archive/master.zip) from the `dist` folder in this repo.

### Bower
Bower is a great way to manage your JS dependencies. You can install Tribute by running the following command:

```shell
bower install tribute
```

You can then link to Tribute in your code with the following markup:

```html
<link rel="stylesheet" href="bower_components/tribute/dist/tribute.css" />
<script src="bower_components/tribute/dist/tribute.js"></script>
```

### NPM Module
You can install Tribute by running:

```shell
npm install tributejs
```

Or by adding Tribute to your `package.json` file.

### Download or Clone
Or you can [download the repo](https://github.com/zurb/tribute/archive/master.zip) or clone it localy with this command:

```shell
git clone git@github.com:zurb/tribute.git
```

You can then copy the files in the `dist` directory to your project.

```html
<link rel="stylesheet" href="js/tribute.css" />
<script src="js/tribute.js"></script>
```

That's it! Now you are ready to initialize Tribute.

## Initializing
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

### Attaching to elements
Once initialized, Tribute can be attached to an `input`, `textarea`, or an element that supports `contenteditable`.

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

## A Collection
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

  // template for when no match is found (optional),
  // If not template provided, menu is hidden.
  noMatchTemplate: null,

  // specify an alternative parent container for the menu
  menuContainer: document.body,

  // column to search against in the object
  lookup: 'key',

  // column that contains the content to insert by default
  fillAttr: 'value',

  // REQUIRED: array of objects to match
  values: []
}
```

### Template Item
Both the `selectTemplate` and the `menuItemTemplate` have access to the `item` object. This is a meta object containing the matched object from your values collection, wrapped in a search result.

```js
{
  index: 0
  original: {} // your original object from values array
  score: 5
  string: "<span>J</span><span>o</span>rdan Hum<span>p</span>hreys"
}
```

### Replace Event
You can bind to the `tribute-replaced` event to know when we have updated your targeted Tribute element.

If your element has an ID of `myElement`:
```js
document.getElementById('myElement').addEventListener('tribute-replaced', function (e) {
  console.log('Text replaced!');
});
```

### No Match Event
You can bind to the `tribute-no-match` event to know when no match is found in your collection.

If your element has an ID of `myElement`:
```js
document.getElementById('myElement').addEventListener('tribute-no-match', function (e) {
  console.log('No match found!');
});
```

## Tips
Some useful approaches to common roadblocks when implementing @mentions.

### Updating a collection with new data
You can update an instance of Tribute on the fly. If you have new data you want to insert into a collection you can access the collection values array directly:

```js
tribute.collection[0].values.push([
  {name: 'Howard Johnson', occupation: 'Panda Wrangler', age: 27},
  {name: 'Fluffy Croutons', occupation: 'Crouton Fluffer', age: 32}
]);
```

This would update the first configuration object in the collection array with new values. You can access and update any attribute on the collection in this way.

### Programmatically detecting an active Tribute dropdown
If you need to know when Tribute is active you can access the `isActive` property of an instance.

```js
if (tribute.isActive) {
  console.log('Somebody is being mentioned!');
} else {
  console.log("Who's this guy talking to?");
}
```

### Links inside contenteditable are not clickable.
If you want to embed a link in your `selectTemplate` then you need to make sure that the
anchor is wrapped in an element with `contenteditable="false"`. This makes the anchor
clickable *and* fixes issues with matches being modifiable.

```js
var tribute = new Tribute({
  values: [
    {key: 'Jordan Humphreys', value: 'Jordan Humphreys', email: 'getstarted@zurb.com'},
    {key: 'Sir Walter Riley', value: 'Sir Walter Riley', email: 'getstarted+riley@zurb.com'}
  ],
  selectTemplate: function (item) {
    return '<span contenteditable="false"><a href="http://zurb.com" target="_blank" title="' + item.original.email + '">' + item.original.value + '</a></span>';
  }
});
```

### How do I add an image to the items in the list?
You can override the default `menuItemTemplate` with your own output on initialization. This allows you to replace the `innerHTML` of the `li` of each item in the list. You can use `item.string` to return the markup for the fuzzy match.

```js
{
  //..other config options
  menuItemTemplate: function (item) {
    return '<img src="'+item.original.avatar_url + '">' + item.string;
  }
}
```

### Embedding Tribute in a scrollable container.
Sometimes you may need to have the Tribute menu attach to a scrollable parent element so that if the user scrolls the container the menu will scroll with it. To do this, you can set `menuContainer` to the node that is the scrollable parent.

```js
{
  //..other config options
  menuContainer: document.getElementById('wrapper')
}
```

## Contributing
We welcome contributions to Tribute. There are many areas where we would love to see community contributions that we have outlined below, but first, let's go over how to develop in Tribute.

Install dependencies:
```sh
npm install
```

Run gulp:
```sh
gulp
```

That's it! Now you can use the `example/index.html` to test out changes to the code base. All changes to `js` and `scss` will recompile on the fly.

Once you have made your changes, feel free to submit a pull request.

**What's next**

The major focus that we could use your help with is creating wrappers for different JavaScript frameworks. Some of the ones we are interested in are outlined below. We also see a couple of areas for improving compatability with different rendering situations, such as in iframes inside of rich text editors.

**Some ideas that are for grabs**
* Angular 1 wrapper
* Angular 2 wrapper
* React wrapper
* Ember component
* Compatability with WYSIWYG editors (TinyMCE, etc)
* Testing


