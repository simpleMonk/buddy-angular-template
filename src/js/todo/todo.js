var todoController = require('./controllers/todo-controller.js');

angular.module('todo', [])
    .controller('TodoController', ['$scope', todoController]);
