angular.module('forgetpassword.module.controller', []).controller('forgetpassword.controller', function ($scope, $state, httpServices, ionicToast, $rootScope, $ionicHistory) {
    var count = 0;

    $scope.data = {};
    $scope.forgetPassword = function (data1) {
       // alert(JSON.stringify(data1));
        httpServices.get("/ForgetPassword/" + data1.email).then(
            function (res) {
                console.log(res);
                //   alert(JSON.stringify(res));
                if (res.data.ForgetPasswordResult.Success.toUpperCase() == 'SUCCESS') {

                    ionicToast.show('Mail sent on your e-mail address.', 'top', false, 4000);
                } else {
                    ionicToast.show(res.data.ForgetPasswordResult.Success, 'top', false, 2500);
                }


            },

            function (er) {
                ionicToast.show('Some thing wrong occured.', 'top', false, 2500);
                console.log(er);
                //alert(JSON.stringify(er));
            })

    }
})