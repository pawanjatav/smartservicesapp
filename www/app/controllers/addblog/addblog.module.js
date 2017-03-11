angular.module('addblogs.module', ['addblogs.module.controller']).config(function ($stateProvider) {

    $stateProvider.state('addblog', {
        url: '/addblog',
        templateUrl: 'views/blog.add.html',
        controller: 'addblogs.controller',
	})
});