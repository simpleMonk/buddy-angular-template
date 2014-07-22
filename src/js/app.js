angular.module('app', ['ngResource', 'ngRoute', 'todo']).run(function ($rootScope) {
    $rootScope.log = function (thing) {
        console.log(thing);
    };

    $rootScope.alert = function (thing) {
        alert(thing);
    };
});

