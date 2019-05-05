export const createDomElement = function(element = 'text') {
  let elementToCreate = 'input';
  if (element === 'contenteditable') {
    elementToCreate = 'div';
  }
  let wrapperDiv = document.createElement('div');
  wrapperDiv.id = 'tribute-wrapper-div';
  let input = document.createElement(elementToCreate);
  input.id = `tribute-${element}`;
  wrapperDiv.appendChild(input);
  document.body.appendChild(wrapperDiv);
  return input;
}

export const clearDom = function() {
  let wrapperDiv = document.querySelector('#tribute-wrapper-div');
  if (wrapperDiv) {
    wrapperDiv.parentNode.removeChild(wrapperDiv);
  }
  let tributeContainer = document.querySelector('.tribute-container');
  if (tributeContainer) {
    tributeContainer.parentNode.removeChild(tributeContainer);
  }
}

export const fillIn = function(input, text) {
  input.focus();
  $(input).sendkeys(text);
  input.dispatchEvent(new KeyboardEvent('keydown'));
  input.dispatchEvent(new KeyboardEvent('keyup'));
}

export const simulateMouseClick = function(targetNode) {
  function triggerMouseEvent(targetNode, eventType) {
    let clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(eventType, true, true);
    targetNode.dispatchEvent(clickEvent);
  }
  ["mouseover", "mousedown", "mouseup", "click"].forEach(function (eventType) {
    triggerMouseEvent(targetNode, eventType);
  });
}
