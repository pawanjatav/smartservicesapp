angular.module('main.module.controller', []).controller('main', function ($ionicPopup,$stateParams,$ionicModal, $timeout,$scope, $ionicScrollDelegate, $state, httpServices, $ionicLoading, ionicToast, $rootScope) {

    $rootScope.profilePicture = "img/classprofile.png";
    var admobid = {};
    $scope.catId = 'null';
    $scope.blogids = 'L';
    $scope.UserId = window.localStorage.getItem('UserID');
    setTimeout(function () {

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
    },10000)
    $ionicModal.fromTemplateUrl('views/notificationmodal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
       
    });
    $scope.openModal = function () {
        $scope.notification = (localStorage.getItem('IsNotification') == 'true');
        console.log($scope.notification);
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    $scope.toggleNotification = function (not) {
        console.log(not);
        localStorage.setItem('IsNotification',not);
        httpServices.post('/UpdateNotification', { UserID: localStorage.getItem('UserID'), Isnotifiy: not }).then(function (res) {


        })
    }

    $scope.signOut = function () {
        $rootScope.loginStatus = false;
        $rootScope.profilePicture = "img/classprofile.png";
        $rootScope.profileName = "";
        $scope.UserId = ''; 
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
    var first = 1;
    $scope.getCategoryBlog = function (BlogID, CategoryID) {
        first = 1;
        $rootScope.blogvalues = [];
        $scope.catId = CategoryID;
        $ionicScrollDelegate.scrollTop(true);
        $scope.blogids = BlogID;
        httpServices.Bloglist(BlogID, CategoryID,first,5);
    }
  
   
    $scope.getCategoryName = function (catId) {
        var a;
        angular.forEach($scope.values, function (item, index) {

            if (item.CategoryID == catId) {
                console.log("called category id" + catId);
             //   alert(item.CategoryName)
                a = item.CategoryName;
            }
        })
        return a;
    }
    $scope.privacyName = function (priId) {
        var a;
        angular.forEach($scope.Privacyvalues, function (item, index) {

            if (item.PrivacyID == priId) {
              //  console.log("called category id" + catId);
                //   alert(item.CategoryName)
                a = item.PrivacyTypeName;
            }
        })
        return a;
    }
    httpServices.get('/GetPrivacyTypeList/L').then(function (response) {
        //     alert(response);
        $scope.Privacyvalues = response.data.GetPrivacyTypeListResult;
        console.log($scope.Privacyvalues);
    })
    httpServices.get('/GetCategoryList/L','category').then(function (response) {
        $scope.values = response.data.GetCategoryListResult;
    }, function (error) {

    });
    $scope.goToMyPost = function (catId) {
        $state.go('mypost', {catid:catId});
    }
    $scope.registerPage = function () {
        httpServices.get('/GetUserInfo/' + localStorage.getItem('UserID')).then(function (response) {
            var data = response.data.GetUserInfoResult;
            $state.go('registration', { isEdit: JSON.stringify(data[0]) });
        })
        
    }
    $scope.loadMore = function () {
        //  alert(JSON.stringify(blogId+'          '+catId))
        setTimeout(function () {
          //  alert($rootScope.checkBlogDetail);
            if ($rootScope.checkBlogDetail) {
              //  alert('called checkblog details');
                httpServices.Bloglist($scope.blogids, $scope.catId, first, 5, 'loadmore').then(function (resp) {
                    if (resp == undefined || resp.length == 0) {

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
                    first++;

                }, function (er) {

                });
            }

        },200)
        
       
    }
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