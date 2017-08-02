angular.module('mypost.module.controller', []).controller('mypost.controller', function ($scope,$ionicPopup, $timeout,$stateParams, $ionicScrollDelegate, $state, $ionicPopover, httpServices, ionicToast, $rootScope, $ionicHistory) {
   // var count = 0;
   // $scope.passhow = false;
    $scope.catidpost = 'null';
    var pagepost = 1;
    if ($stateParams.catid != '')
    {

        $scope.catidpost = $stateParams.catid;
        console.log($scope.catidpost);
    }
  //  $scope.newBlog = JSON.parse(localStorage.getItem("blogadded"));
    var template = '<ion-popover-view style="height:100px; width:90%"><ion-content class="ion-contentColor dark-border"><div class="row"><div class="col text-center" data-ng-click="takeFromCamera()"><img src="img/1469647735_camera.ico"  height="77px" width="77px"/></div><div class="col text-center" data-ng-click="setProfilePicture()"><img src="img/1469647872_image.ico"  height="77px" width="77px"/></div></div> </ion-content></ion-popover-view>';
    $scope.popover = $ionicPopover.fromTemplateUrl('views/popoverEdit.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });
    $scope.convertDate = function (mydate) {
        var p = mydate;
        var g = parseInt(p.replace("/Date(", "").replace(")/", ""));
        return g;
    }
    $scope.shareWith = function (txtContent, file) {
        console.log(txtContent);
        var img = (angular.isUndefined(file)) ? '' : "http://smartservicesapp.com/Uploads/BlogDoc/" + file;
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
    $scope.UserId = window.localStorage.getItem('UserID');
    $scope.openPopover = function ($event, bId, ind) {

        $scope.popover.show($event);
        $scope.BlogIdpop = bId;
        $scope.index = ind
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

            $scope.myPosts.splice($scope.index, 1);
            $scope.popover.hide();
            httpServices.post('/DeleteBlog', { BlogId: id, ImageName: '' }).then(function (response) {


            }, function (error) {
            });
            }
        });
       
    }
    $scope.myPosts = [];
    $scope.loadMore1 = function () {
       // alert();
        httpServices.get('/GetBlogListbyUserID/'+$scope.catidpost+'/' + localStorage.getItem('UserID') + '/'+pagepost+'/5', 'mypost').then(function (response) {
            console.log(response);
            angular.forEach(response.data.GetBlogListbyUserIDResult,function(item,index){
                $scope.myPosts.push(item);
            
            })
            
            pagepost++;
            if (response.data.GetBlogListbyUserIDResult == undefined || response.data.GetBlogListbyUserIDResult == 0) {

                var scroll = $ionicScrollDelegate.getScrollPosition();
                var scrollPos = scroll.top - 300;
                var myPopup = $ionicPopup.confirm({
                    template: 'No more data to load.',
                    title: 'Alert',

                    // scope: $scope,

                });
                $ionicScrollDelegate.scrollBy(0, scrollPos, [true]);

            }
            else {

                $timeout(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            }
          //  $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function (error) {

        });
    }
   
})
//http://smartservicesapp.com/Service.svc/GetBlogListbyUserID/%7BCATEGORYID%7D/%7BUSERID%7D/%7BPAGE%7D/%7BPAGESIZE%7D