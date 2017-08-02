angular.module('changepassword.module.controller', []).controller('changepassword.controller', function ($scope,$ionicLoading, $ionicPopup, $state, $ionicHistory, httpServices, $rootScope) {
    $scope.changePassword = function (data) {
        
        if (data.reenterpassword.trim() != data.NewPassword.trim()) {

            var myPopup = $ionicPopup.confirm({
                template: 'New Password and Re entered password do not match.',
                title: 'Alert',

                // scope: $scope,

            });
            myPopup.then(function (res) {
                return;
            })
        }
        else {
            data.RegistrationID = localStorage.getItem('UserID');


        httpServices.post('/ChangePassword ', data).then(function (response) {
            console.log(response);
            //$scope.myPosts = response.data.GetBlogListbyUserIDResult;
            // pagepost++;
            if (response.data.Success == 'Password has been changed successfully') {


                $ionicLoading.show({ template: response.data.Success });
                setTimeout(function () {
                    $ionicLoading.hide()
                    $state.go('dashboard');
                }, 3000)
            }
            else {
                if (response.data.Success != null || response.data.Success != 'null')
                {

                $ionicLoading.show({ template: response.data.Success });
                    setTimeout(function () {
                        $ionicLoading.hide()
                    }, 2000)
                }
                else {
                    $ionicLoading.show({ template: response.data.Success });
                    setTimeout(function () {
                        $ionicLoading.hide()
                    }, 2000)
                }
            }
           
             
                
          
        }, function (error) {

        });
        }
    }
   
  
    
})