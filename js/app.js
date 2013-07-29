'use strict';


// Declare app level module which depends on filters, and services
angular.module('app', ['angles', 'app.filters', 'app.services', 'app.directives', 'app.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/summary.html', controller: 'Summary'});
  }]);


function avg() {
	var total = 0; 
	for (var i in arguments) { 
		total = total + Number(arguments[i]);
	}
	return total/arguments.length;
}