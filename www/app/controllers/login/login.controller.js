angular.module('login.module.controller', []).controller('login.controller', function ($scope, $state, httpServices, ionicToast, $rootScope, $ionicHistory) {
    var count = 0;
    $scope.passhow = false;
    $scope.authenticateUser = function (data) {
        if (count == 0) {
            $scope.passhow = true;
            count++;
        }
        else {
         
            httpServices.post('/LoginUser', data).then(function (response) {
                if (response.data.Source != 0) {
                    ionicToast.show(response.data.Success, 'bottom', false, 2500);
                    $rootScope.loginStatus = true;
                    localStorage.setItem("loginStatus", true);
                 //   alert(JSON.stringify(response));
                    $ionicHistory.clearHistory();
                    ionicToast.show(response.data.Success, 'bottom', false, 2500);
                    localStorage.setItem("UserID", response.data.Source);
                    httpServices.get('/GetUserInfo/' + response.data.Source).then(function (dat) {
                      //  alert(JSON.stringify(dat));
                        $rootScope.profilePicture ="http://smartservicesapp.com/Uploads/profilepic/"+ dat.data.GetUserInfoResult[0].FilePathName;
                        $rootScope.profileName = "Hello! " + dat.data.GetUserInfoResult[0].FirstName;
                        localStorage.setItem('profileName', $rootScope.profileName);
                        localStorage.setItem('profilePic', $rootScope.profilePicture);
                      //  alert("Hello! " + dat.data.GetUserInfoResult[0].FirstName)
                        $state.go('dashboard');
                    }, function (error) {

                    })
                   
                }
                else {
                    
                    
                }
            }, function (error) {
                ionicToast.show('Login failed', 'top', false, 2500);

            })

        }
    }
})