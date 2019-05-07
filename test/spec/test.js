'use strict';

import bigList from './utils/bigList.json';

import {
  createDomElement,
  clearDom,
  fillIn,
  simulateMouseClick
} from './utils/dom-helpers';

import  {
  attachTribute,
  detachTribute
} from './utils/tribute-helpers';

describe('Tribute instantiation', function () {
  it('should not error in the base case from the README', () => {
    const options = [
      {key: 'Phil Heartman', value: 'pheartman'},
      {key: 'Gordon Ramsey', value: 'gramsey'}
    ];
    const tribute = new Tribute({
      values: options
    });

    expect(tribute.collection[0].values).toEqual(options);
  });
});


describe('Tribute @mentions cases', function () {

  afterEach(function () {
    clearDom();
  });

  ['text', 'contenteditable'].forEach(elementType => {
    it(`when values key is predefined array. For : ${elementType}`, () => {
      let input = createDomElement(elementType);

      let collectionObject = {
        trigger: '@',
        selectTemplate: function (item) {
          if (typeof item === 'undefined') return null;
          if (this.range.isContentEditable(this.current.element)) {
            return '<span contenteditable="false"><a href="http://zurb.com" target="_blank" title="' + item.original.email + '">' + item.original.value + '</a></span>';
          }

          return '@' + item.original.value;
        },
        values: [
          { key: 'Jordan Humphreys', value: 'Jordan Humphreys', email: 'getstarted@zurb.com' },
          { key: 'Sir Walter Riley', value: 'Sir Walter Riley', email: 'getstarted+riley@zurb.com' }
        ],
      }

      let tribute = attachTribute(collectionObject, input.id);

      fillIn(input, ' @');
      let popupList = document.querySelectorAll('.tribute-container > ul > li');
      expect(popupList.length).toBe(2);
      simulateMouseClick(popupList[0]); // click on Jordan Humphreys

      if (elementType === 'text') {
        expect(input.value).toBe(' @Jordan Humphreys ');
      } else if (elementType === 'contenteditable') {
        expect(input.innerHTML).toBe(' <span contenteditable="false"><a href="http://zurb.com" target="_blank" title="getstarted@zurb.com">Jordan Humphreys</a></span>&nbsp;');
      }

      fillIn(input, ' @sir');
      popupList = document.querySelectorAll('.tribute-container > ul > li');
      expect(popupList.length).toBe(1);

      detachTribute(tribute, input.id);
    });

    it(`when values array is large and menuItemLimit is set. For : ${elementType}`, () => {
      let input = createDomElement(elementType);

      let collectionObject = {
        trigger: '@',
        menuItemLimit: 25,
        selectTemplate: function (item) {
          if (typeof item === 'undefined') return null;
          if (this.range.isContentEditable(this.current.element)) {
            return '<span contenteditable="false"><a href="http://zurb.com" target="_blank" title="' + item.original.email + '">' + item.original.value + '</a></span>';
          }

          return '@' + item.original.value;
        },
        values: bigList,
      }

      let tribute = attachTribute(collectionObject, input.id);

      fillIn(input, ' @');
      let popupList = document.querySelectorAll('.tribute-container > ul > li');
      expect(popupList.length).toBe(25);

      fillIn(input, ' @an');
      popupList = document.querySelectorAll('.tribute-container > ul > li');
      expect(popupList.length).toBe(25);

      detachTribute(tribute, input.id);
    });
  });
});

describe('Tribute autocomplete mode cases', function () {

  afterEach(function () {
    clearDom();
  });

  ['text', 'contenteditable'].forEach(elementType => {
    it(`when values key is predefined array. For : ${elementType}`, () => {
      let input = createDomElement(elementType);

      let collectionObject = {
        selectTemplate: function (item) {
          return item.original.value;
        },
        autocompleteMode: true,
        values: [
          { key: 'Jordan Humphreys', value: 'Jordan Humphreys', email: 'getstarted@zurb.com' },
          { key: 'Sir Walter Riley', value: 'Sir Walter Riley', email: 'getstarted+riley@zurb.com' }
        ],
      }

      let tribute = attachTribute(collectionObject, input.id);

      fillIn(input, ' J');
      let popupList = document.querySelectorAll('.tribute-container > ul > li');
      expect(popupList.length).toBe(1);
      simulateMouseClick(popupList[0]); // click on Jordan Humphreys

      if (elementType === 'text') {
        expect(input.value).toBe(' Jordan Humphreys ');
      } else if (elementType === 'contenteditable') {
        expect(input.innerText).toBe('Jordan Humphreys ');
      }

      fillIn(input, ' Si');
      popupList = document.querySelectorAll('.tribute-container > ul > li');
      expect(popupList.length).toBe(1);

      detachTribute(tribute, input.id);
    });
  });

  ['text', 'contenteditable'].forEach(elementType => {
    it(`when values key is a function. For : ${elementType}`, () => {
      let input = createDomElement(elementType);

      let collectionObject = {
        autocompleteMode: true,
        selectClass: 'sample-highlight',

        noMatchTemplate: function () {
          this.hideMenu();
        },

        selectTemplate: function(item) {
          if (typeof item === 'undefined') return null;
          if (this.range.isContentEditable(this.current.element)) {
            return `&nbsp;<a contenteditable=false>${item.original.value}</a>`;
          }

          return item.original.value;
        },

        values: function (text, cb) {
          searchFn(text, users => cb(users));
        },
      }

      function searchFn(text, cb) {
        if (text === 'a') {
          cb([
            { key: "Alabama", value: "Alabama" },
            { key: "Alaska", value: "Alaska" },
            { key: "Arizona", value: "Arizona" },
            { key: "Arkansas", value: "Arkansas" }
          ])
        } else if (text === 'c') {
          cb([
            { key: "California", value: "California" },
            { key: "Colorado", value: "Colorado" }
          ])
        } else {
          cb([]);
        }
      }

      let tribute = attachTribute(collectionObject, input.id);

      fillIn(input, ' a');
      let popupList = document.querySelectorAll('.tribute-container > ul > li');
      expect(popupList.length).toBe(4);
      simulateMouseClick(popupList[0]);

      if (elementType === 'text') {
        expect(input.value).toBe(' Alabama ');
      } else if (elementType === 'contenteditable') {
        expect(input.innerText).toBe(" Alabama ");
      }

      fillIn(input, ' c');
      popupList = document.querySelectorAll('.tribute-container > ul > li');
      expect(popupList.length).toBe(2);
      simulateMouseClick(popupList[1]);

      if (elementType === 'text') {
        expect(input.value).toBe(' Alabama  Colorado ');
      } else if (elementType === 'contenteditable') {
        expect(input.innerText).toBe(' Alabama   Colorado ');
      }

      fillIn(input, ' none');
      let popupListWrapper = document.querySelector('.tribute-container');
      expect(popupListWrapper.style.display).toBe('none');

      detachTribute(tribute, input.id);
    });
  });

});
