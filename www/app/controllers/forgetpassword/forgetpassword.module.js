angular.module('forgetpassword.module', ['forgetpassword.module.controller']).config(function ($stateProvider) {

    $stateProvider.state('forgetpassword', {
        url: '/forgetpassword',
        templateUrl: 'views/forgetpassword.html',
        controller:'forgetpassword.controller',
    })
});