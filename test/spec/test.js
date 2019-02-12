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
})();
