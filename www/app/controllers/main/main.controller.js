angular.module('main.module.controller', []).controller('main', function ($ionicPopup,$scope, $state, httpServices, $ionicLoading, ionicToast, $rootScope) {

    $rootScope.profilePicture = "img/classprofile.png";
    var admobid = {};
    document.addEventListener('deviceready', function () {
        if (/(android)/i.test(navigator.userAgent)) { // for android & amazon-fireos

            admobid = {
                banner: 'ca-app-pub-3970295648068144/3455097310', // or DFP format "/6253334/dfp_example_ad"
                interstitial: 'ca-app-pub-3970295648068144/4931830511'
            };
        } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
            admobid = {
                banner: 'ca-app-pub-3970295648068144/3455097310', // or DFP format "/6253334/dfp_example_ad"
                interstitial: ' ca-app-pub-3970295648068144/4931830511'
            };
        } else { // for windows phone
            admobid = {
                banner: 'ca-app-pub-3970295648068144/3455097310', // or DFP format "/6253334/dfp_example_ad"
                interstitial: ' ca-app-pub-3970295648068144/4931830511'
            };
        }

        if (AdMob) AdMob.createBanner({
            adId: admobid.banner,
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            autoShow: true
        });

    }, false)
   
    $scope.signOut = function () {
        $rootScope.loginStatus = false;
        $rootScope.profilePicture = "img/classprofile.png";
        $rootScope.profileName = "";
       
        localStorage.setItem("UserID", "");
        localStorage.setItem("loginStatus", "");
        localStorage.setItem("profileName", "");
        localStorage.setItem("profilePic", "");
    }
    var status = localStorage.getItem("UserID");
    //  alert(    httpServices.Bloglist('L', null));
    if (status === null || status === undefined || status === 'undefined' || status === '') {
        $state.go('login');
    }
    else {
        $rootScope.loginStatus = localStorage.getItem("loginStatus");
        $rootScope.profileName = localStorage.getItem("profileName");
        $rootScope.profilePicture = localStorage.getItem("profilePic");
        
    }
    $scope.getCategoryBlog = function (BlogID, CategoryID) {
        httpServices.Bloglist(BlogID, CategoryID);
    }
    httpServices.Bloglist('L', null);


    httpServices.get('/GetCategoryList/L').then(function (response) {
        $scope.values = response.data.GetCategoryListResult;
    }, function (error) {

    });
    $scope.likeBlog = function (blogId,index) {
        var status = localStorage.getItem("UserID");
        if (status === null || status === undefined || status === 'undefined' || status === '') {
            var myPopup = $ionicPopup.confirm({
                template: 'Please Login to like the blog.',
                title: 'Alert',
               
               // scope: $scope,
               
            });
            myPopup.then(function (res) {
                $state.go('login');
            });
        }
        else {
            var array = [];
            if ($rootScope.blogvalues[index].UserLikes != null) {
                array = $rootScope.blogvalues[index].UserLikes.split(',');
                console.log(array);
                for (var i = 0; i < array.length; i++) {
                    if (status == array[i]) {
                        var myPopup = $ionicPopup.confirm({
                            template: 'You have already liked this blog.',
                            title: 'Alert',

                            // scope: $scope,

                        });
                        return;
                    }
                }
            }
             
           // var temp = 0;
           
          
            httpServices.get('/UserLikes/' + blogId + '/' + window.localStorage.getItem('UserID')).then(function (res) {
                if ($rootScope.blogvalues[index].UserLikes != null) {
                    $rootScope.blogvalues[index].UserLikesCount = parseInt($rootScope.blogvalues[index].UserLikesCount) + 1;
                    $rootScope.blogvalues[index].UserLikes+=status+',';
                } else {
                    $rootScope.blogvalues[index].UserLikesCount = '1';
                    $rootScope.blogvalues[index].UserLikes+=status+',';
                }
            }, function (er) {

                console.log(er)
            })
        }
        
        
    }

})