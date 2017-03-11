angular.module('login.module', ['login.module.controller']).config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller:'login.controller as l',
    })
});