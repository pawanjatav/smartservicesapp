angular.module('registration.module', ['registration.module.controller']).config(function ($stateProvider) {

    $stateProvider.state('registration', {
        url: '/registration',
        templateUrl: 'views/registration.html',
        controller: 'registration.controller',
	})
});