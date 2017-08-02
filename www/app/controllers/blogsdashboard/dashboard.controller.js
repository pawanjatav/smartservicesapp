angular.module('dashboard.module.controller', []).controller('dashboard.controller', function ($scope,$ionicPopup,$cordovaSocialSharing, $state,$ionicPopover, $ionicHistory, httpServices, $rootScope) {

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
    $scope.popover1 = $ionicPopover.fromTemplateUrl('views/popoverShare.html', {
        scope:$scope
    }).then(function (pop) {
        $scope.popover1 = pop;
    })
    $scope.shareWith = function (txtContent, file) {
        console.log(txtContent);
        var img = (angular.isUndefined(file)) ? '' : "http://smartservicesapp.com/Uploads/BlogDoc/"+file;
        console.log(img)
       // var option={, 'Blog', '', img}
        var options = {
            message: txtContent, // not supported on some apps (Facebook, Instagram)
            subject: 'Smart Services', // fi. for email
            files: [img], // an array of filenames either locally or remotely
            url: 'https://play.google.com/store/apps/details?id=com.bahubali.game&hl=en',
            //chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        }
        $cordovaSocialSharing
    .shareWithOptions(options) // Share via native share sheet
    .then(function (result) {
        // Success!
    }, function (err) {
        // An error occured. Show a message to the user
    });

    }
    $scope.popoverOpen = function ($event) {
        $scope.popover1.show($event);
    }
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
        $scope.popover.hide();
        var myPopup = $ionicPopup.confirm({
            template: 'Do you want to delete?',
            title: 'Alert',

            // scope: $scope,

        });
        myPopup.then(function (res) {
            if (res) {

            $rootScope.blogvalues.splice($scope.index, 1);
            $scope.popover.hide();
            httpServices.post('/DeleteBlog', { BlogId: id, ImageName: '' }).then(function (response) {


            }, function (error) {
            });
            }
        });
       
    }
    $scope.convertDate = function (mydate) {
        var p = mydate;
           var g = parseInt(p.replace("/Date(", "").replace(")/", ""));
        return g;
    }
    
})