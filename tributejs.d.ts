// Type definitions for TributeJS v2.3.5
// Project: https://github.com/zurb/tribute
// Definitions by: Jordan Humphreys <https://github.com/mrsweaters/>

export interface TributeOptions {
  // symbol that starts the lookup
  trigger?: string,

  // element to target for @mentions
  iframe?: any,

  // class added in the flyout menu for active item
  selectClass?: string,

  // function called on select that returns the content to insert
  selectTemplate?: () => string,

  // template for displaying item in menu
  menuItemTemplate?: () => string,

  // template for when no match is found (optional),
  // If no template is provided, menu is hidden.
  noMatchTemplate?: any,

  // specify an alternative parent container for the menu
  menuContainer?: any,

  // column to search against in the object (accepts function or string)
  lookup?: string | () => void,

  // column that contains the content to insert by default
  fillAttr?: string,

  // array of objects to match
  values?: array<any>,

  // specify whether a space is required before the trigger character
  requireLeadingSpace?: boolean,

  // specify whether a space is allowed in the middle of mentions
  allowSpaces?: boolean,

  // optionally specify a custom suffix for the replace text
  // (defaults to empty space if undefined)
  replaceTextSuffix?: string,

  // pass an array of config objects
  collection?: array<Object>,
}

export default class Tribute {
  constructor(options: TributeOptions);

  isActive: boolean;

  append(index: number, values: array<Object>, replace?: boolean): void;

  appendCurrent(values: array<Object>, replace?: boolean): void;

}
