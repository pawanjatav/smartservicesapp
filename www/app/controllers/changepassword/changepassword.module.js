angular.module('changepassword.module', ['changepassword.module.controller']).config(function ($stateProvider) {

    $stateProvider.state('changepassword', {
        url: '/changepassword',
        templateUrl: 'views/changepassword.html',
        controller: 'changepassword.controller',
	})
});