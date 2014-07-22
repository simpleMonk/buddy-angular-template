describe("module:todo", function () {

    var rootScope, scope, todoController;

    beforeEach(function (done) {
        var app = angular.mock.module('app');
        var todo = angular.mock.module('todo');
        done();
    });
    beforeEach(inject(function ($rootScope, $controller) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        todoController = $controller('TodoController', {
            $scope: scope
        });
    }));
    it("should have angular loaded", function () {
        expect(angular.version.full).to.equal('1.3.0-beta.14');
    });

    it("should have a message in todoController", function () {
        expect(scope.message).to.equal('testem message');
    });

});


