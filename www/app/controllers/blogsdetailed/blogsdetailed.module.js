angular.module('blogsdetailed.module', ['blogsdetailed.module.controller']).config(function ($stateProvider) {

    $stateProvider.state('blogsdetailed', {
        url: '/blogsdetailed/{BlogId}/{CategoryID}',
        templateUrl: 'views/blog.detailed.html',
        controller: 'blogsdetailed.controller',
	})
});