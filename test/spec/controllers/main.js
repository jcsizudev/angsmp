'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('angsmpApp'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a test to the scope', function () {
    expect(scope.test).toBeDefined();
  });
});
