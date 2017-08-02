angular.module('mypost.module', ['mypost.module.controller']).config(function ($stateProvider) {

    $stateProvider.state('mypost', {
        url: '/mypost/:catid',
        templateUrl: 'views/mypost.html',
        controller: 'mypost.controller',
    })
});