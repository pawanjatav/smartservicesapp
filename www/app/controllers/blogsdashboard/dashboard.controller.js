angular.module('dashboard.module.controller', []).controller('dashboard.controller', function ($scope, $ionicHistory, httpServices, $rootScope) {

    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $ionicHistory.removeBackView();
  //  $scope.gh = $ionicHistory.backView();
   // $scope.gh.canSwipeBack = false;
 //   alert(JSON.stringify($scope.gh));
//    $scope.newBlog = JSON.parse(localStorage.getItem("blogadded"));
    


   

    $scope.convertDate = function (mydate) {
        var p = mydate;
           var g = parseInt(p.replace("/Date(", "").replace(")/", ""));
        return g;
    }
    
})