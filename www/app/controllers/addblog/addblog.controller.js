angular.module('addblogs.module.controller', []).controller('addblogs.controller', function ($scope,$cordovaCamera, $ionicLoading, $ionicHistory, $state, httpServices, ionicToast) {
    //  $scope.images = ["img/classprofile.png"];
     $scope.images = [];
    var status = localStorage.getItem("UserID");
    //  alert(    httpServices.Bloglist('L', null));
    if (status === null || status === undefined || status === 'undefined' || status === '') {
        $state.go('login');
    }

    $scope.addImage = function () {
var options={
           

            quality: 50,
            correctOrientation: true,
            encodingType: Camera.EncodingType.JPEG,
           
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: Camera.MediaType.PICTURE

        };
  $cordovaCamera.getPicture(options).then(function (imageData) {

        $scope.images.push(imageData);
        setTimeout(function(){

        $scope.images.apply();    
        },500);
     
    },function(er){


    });

   
}


    $scope.addBlog = function (data) {
        var BlogIDs = 0;
        //  debugger;
        // Add Blog records 
        data.UserID = parseInt(localStorage.getItem("UserID"));
        if (data.CategoryID == "" || data.CategoryID == undefined) {
            $ionicHistory.clearHistory();
            ionicToast.show("Please select Category.", 'bottom', false, 2500);
            return;
        }
        if (data.PrivacyID == "" || data.PrivacyID == undefined) {
            $ionicHistory.clearHistory();
            ionicToast.show("Please select privacy.", 'bottom', false, 2500);
            return;
        }

        data.PrivacyID = parseInt(data.PrivacyID);
        data.CategoryID = parseInt(data.CategoryID);

        httpServices.post('/AddBlog', data).then(function (response) {
     
            BlogIDs = response.data.Source;
           // alert(JSON.stringify(response));
           //  debugger;
            if ($scope.images.length >0) {
                document.addEventListener("deviceready", onDeviceReady, false);
            }
            else {
                httpServices.Bloglist('L',null);
            }

        }, function (error) {
            //    alert("AddBlog :: " + JSON.stringify(error))
        });


        function onDeviceReady() {

            for (var i = 0; i < $scope.images.length; i++) {


                var fileURL = $scope.images[i];

                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);

                options.mimeType = "text/plain";
                var params = {};

                options.params = { "BlogIDs": BlogIDs };
                var ft = new FileTransfer();
              //  alert(fileURL);
                //alert(JSON.stringify(options));
                $ionicLoading.show();
                ft.upload(fileURL, encodeURI("http://smartservicesapp.com/PicBlog.ashx"), function (r) {
                //  alert(JSON.stringify(r));
                    var result = { blog: data, image: $scope.images }
                    localStorage.setItem("blogadded", JSON.stringify(result));
                    var value = $ionicHistory.clearCache();
                    value.then(function () {
                        httpServices.Bloglist('L', null);
                    })
                }, function (error) {
                    alert("An error has occurred: Code = " + error.code);
                    alert("upload error source " + error.source);
                    alert("upload error target " + error.target);
                }, options);
            }
        }



    }
    httpServices.get('/GetPrivacyTypeList/L').then(function (response) {
        //     alert(response);
        $scope.Privacyvalues = response.data.GetPrivacyTypeListResult;
    }, function (error) {
    });



})