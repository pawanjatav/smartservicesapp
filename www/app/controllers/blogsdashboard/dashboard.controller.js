angular.module('dashboard.module.controller', []).controller('dashboard.controller', function ($scope, $state,$ionicPopover, $ionicHistory, httpServices, $rootScope) {

    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    $ionicHistory.removeBackView();
  //  $scope.gh = $ionicHistory.backView();
   // $scope.gh.canSwipeBack = false;
 //   alert(JSON.stringify($scope.gh));
//    $scope.newBlog = JSON.parse(localStorage.getItem("blogadded"));
    var template = '<ion-popover-view style="height:100px; width:90%"><ion-content class="ion-contentColor dark-border"><div class="row"><div class="col text-center" data-ng-click="takeFromCamera()"><img src="img/1469647735_camera.ico"  height="77px" width="77px"/></div><div class="col text-center" data-ng-click="setProfilePicture()"><img src="img/1469647872_image.ico"  height="77px" width="77px"/></div></div> </ion-content></ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplateUrl('views/popoverEdit.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $scope.UserId = window.localStorage.getItem('UserID');
    $scope.openPopover = function ($event,bId,ind) {
       
        $scope.popover.show($event);
        $scope.BlogIdpop = bId;
        $scope.index=ind
    };
    $scope.editBlog = function (id) {
        $scope.popover.hide();
        $state.go('addblog', { blogid: id });
    }
    $scope.deleteBlog = function (id) {

        $rootScope.blogvalues.splice($scope.index, 1);
        $scope.popover.hide();
        httpServices.post('/DeleteBlog', { BlogId: id, ImageName: '' }).then(function (response) {


        }, function (error) {
        });
    }
    $scope.convertDate = function (mydate) {
        var p = mydate;
           var g = parseInt(p.replace("/Date(", "").replace(")/", ""));
        return g;
    }
    
})