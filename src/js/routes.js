angular.module("app").config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);

    $routeProvider.when('/todo', {
        templateUrl: 'templates/todo/todo.tpl.html',
        controller:"TodoController"
    });

    $routeProvider.otherwise({ redirectTo: '/' });
});