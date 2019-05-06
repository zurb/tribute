export const attachTribute = function(collectionObject, inputElementId) {
  let tribute = new Tribute(collectionObject);
  tribute.attach(document.getElementById(inputElementId));
  return tribute;
}

export const detachTribute = function(tribute, inputElementId) {
  tribute.detach(document.getElementById(inputElementId));
}