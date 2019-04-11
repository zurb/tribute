(function () {
  'use strict';
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
  
  describe('Multi-char trigger', function () {
    it('lastIndexWithLeadingSpace should detect multi-char trigger correctly', () => {
      const options = [
        {key: 'Phil Heartman', value: 'pheartman'},
        {key: 'Gordon Ramsey', value: 'gramsey'}
      ];
      const tribute = new Tribute({
        values: options
      });
      const TributeRange = require('../../src/TributeRange.js');
      var tributeRange = new TributeRange(tribute);
      

      expect(tributeRange.lastIndexWithLeadingSpace(" {{", "{{")).toEqual(1);
      
      expect(tributeRange.lastIndexWithLeadingSpace("{{", "{{")).toEqual(0);
      expect(tributeRange.lastIndexWithLeadingSpace("a{{", "{{")).toEqual(-1);
      expect(tributeRange.lastIndexWithLeadingSpace(" {", "{{")).toEqual(-1);
    });
  });
  
})();

