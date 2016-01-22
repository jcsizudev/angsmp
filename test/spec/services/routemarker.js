'use strict';

describe('Service: RouteMarker', function () {

  // load the service's module
  beforeEach(module('angsmpApp'));

  // instantiate service
  var RouteMarker;
  beforeEach(inject(function (_RouteMarker_) {
    RouteMarker = _RouteMarker_;
  }));

  it('should do something', function () {
    expect(!!RouteMarker).toBe(true);
  });

});
