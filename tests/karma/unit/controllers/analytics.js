describe('AnalyticsCtrl controller', function() {

  'use strict';

  var createController,
      AnalyticsModules,
      $rootScope,
      scope,
      stateGo,
      stateIs;

  beforeEach(module('inboxApp'));

  beforeEach(inject(function(_$rootScope_, $controller) {
    $rootScope = _$rootScope_;
    AnalyticsModules = sinon.stub();
    stateGo = sinon.stub();
    stateIs = sinon.stub();
    scope = $rootScope.$new();
    scope.filterModel = { };
    scope.clearSelected = function() {};
    createController = function(startState) {
      return $controller('AnalyticsCtrl', {
        '$scope': scope,
        '$rootScope': $rootScope,
        '$stateParams': { },
        '$state': {
          current: { name: startState },
          go: stateGo,
          is: stateIs
        },
        'AnalyticsModules': AnalyticsModules,
        'Tour': function() {},
        '$timeout': function(cb) {
          cb();
        }
      });
    };
  }));

  afterEach(function() {
    KarmaUtils.restore(AnalyticsModules, stateGo, stateIs);
  });

  it('set up controller with no modules', function(done) {
    AnalyticsModules.returns(KarmaUtils.mockPromise(null, []));
    stateIs.returns(false);
    createController('anc');
    scope.$digest();
    setTimeout(function() {
      chai.expect(scope.selected).to.equal(undefined);
      done();
    });
  });

  it('renders specified module', function(done) {
    AnalyticsModules.returns(KarmaUtils.mockPromise(null, [
      { state: 'reporting' },
      { state: 'anc' }
    ]));
    stateIs.returns(false);
    createController('anc');
    scope.$digest();
    setTimeout(function() {
      chai.expect(scope.selected.state).to.equal('anc');
      done();
    });
  });

  it('jumps to child state if single module present', function(done) {
    AnalyticsModules.returns(KarmaUtils.mockPromise(null, [
      { state: 'anc' }
    ]));
    stateIs.returns(true);
    createController('analytics');
    scope.$digest();
    setTimeout(function() {
      chai.expect(stateGo.callCount).to.equal(1);
      chai.expect(stateGo.calledWith('anc')).to.equal(true);
      done();
    });
  });

  it('does not jump to child state if multiple modules present', function(done) {
    AnalyticsModules.returns(KarmaUtils.mockPromise(null, [
      { state: 'reporting' },
      { state: 'anc' }
    ]));
    stateIs.returns(true);
    createController('analytics');
    scope.$digest();
    setTimeout(function() {
      chai.expect(stateGo.callCount).to.equal(0);
      done();
    });
  });
});

