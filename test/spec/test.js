'use strict';

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
  });
});