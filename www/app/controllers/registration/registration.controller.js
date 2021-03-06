﻿angular.module('registration.module.controller', []).controller('registration.controller', function ($scope,$stateParams, ionicToast,$rootScope, $ionicPopover, $state, httpServices, $ionicLoading) {
    $scope.dataSrc = "img/classprofile.png"
    $scope.data = {};
    $scope.pass = true;
    $scope.FileName = '';
    if ($stateParams.isEdit != '')
    {
        console.log($stateParams.isEdit)
        $scope.data = JSON.parse($stateParams.isEdit);
        $scope.dataSrc = 'http://smartservicesapp.com/Uploads/profilepic/' + $scope.data.FilePathName;
        $scope.pass = false;
    }
    

    $scope.setProfilePicture = function () {
        $scope.popover.hide();
            navigator.camera.getPicture(profilePictureSuccess, profilePictureFail, {
                quality: 50,
                correctOrientation: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 2592,
                targeHeight: 4608,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                mediaType: Camera.MediaType.PICTURE
            });
        
  }
  $scope.takeFromCamera = function () { 
      $scope.popover.hide();   
          navigator.camera.getPicture(profilePictureSuccess, profilePictureFail, {
              quality: 50,             
              correctOrientation: true,
              destinationType: navigator.camera.DestinationType.FILE_URI,
              sourceType: navigator.camera.PictureSourceType.CAMERA,
          });
  }
  $scope.registerUser = function (data1) {
      var data = data1;
      data.GCMId = localStorage.getItem('GCMID');
      document.addEventListener("deviceready", onDeviceReady, false);
  
    

     
      //httpServices.post('/RegisterUser', reqData).then(function (response) {
        
      //    ionicToast.show('Successfully Registered', 'bottom', true, 2500);
      //    $state.go('dashboard');
      //}, function (error) {

      //    ionicToast.show('Some error occured', 'bottom', true, 2500);
      //})

      function onDeviceReady() {

          
          var fileURL = $scope.FileName;
          var options = new FileUploadOptions();
          options.fileKey = "file";
          options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
          options.mimeType = "text/plain";

          var params = {};
          if (!$scope.pass) {
              data.RegistrationID = localStorage.getItem('UserID');
          }
          params = data;

          options.params = params;
          var ft = new FileTransfer();
          $ionicLoading.show();
          if (fileURL == null||fileURL=="")
          {

          }
          console.log('updates come here');
          console.log($scope.FileName)
          if ($scope.FileName == '') {
              httpServices.post('/RegisterUser', data).then(function (suc) {
                  ionicToast.show('Updated Successfully', 'bottom', false, 2500);
                  $state.go('dashboard', null, { reload: true });
              }, function (er) {
                  ionicToast.show('error occured', 'bottom', false, 2500);
              })
          }
          else {

          ft.upload(fileURL, encodeURI("http://smartservicesapp.com/PicUpload.ashx"), function (r) {
              if ($scope.pass) {


                  ionicToast.show('Registered Successfully', 'bottom', false, 2500);
              } else {
                  ionicToast.show('Updated Details Successfully', 'bottom', false, 2500);
              }
              $rootScope.profilePicture = "data:image/jpeg;base64," + r.response;
              $rootScope.loginStatus = true;
              // alert(JSON.stringify(response));
           
            
              $ionicLoading.hide();
              $state.go('dashboard', null, { reload: true });
          }, function (error) {
              alert("An error has occurred: Code = " + error.code);
              alert("upload error source " + error.source);
              alert("upload error target " + error.target);
          }, options);
          }
      }


  }
 
   function profilePictureSuccess(imageUrl) {
    
       document.getElementById('camera').src =imageUrl;
       document.getElementById('camera').height = 180;
       document.getElementById('camera').width = 180;
       $scope.FileName = imageUrl;
       
        
    }
   function profilePictureFail(ex) {
      //  alert('failed called' + JSON.stringify(ex));
   }
   var template = '<ion-popover-view style="height:100px; width:90%"><ion-content class="ion-contentColor dark-border"><div class="row"><div class="col text-center" data-ng-click="takeFromCamera()"><img src="img/1469647735_camera.ico"  height="77px" width="77px"/></div><div class="col text-center" data-ng-click="setProfilePicture()"><img src="img/1469647872_image.ico"  height="77px" width="77px"/></div></div> </ion-content></ion-popover-view>';

   $scope.popover = $ionicPopover.fromTemplate(template, {
       scope: $scope
   });
   $scope.openPopover = function ($event) {
       $scope.popover.show($event);
   };
   $scope.closePopover = function () {
       $scope.popover.hide();
   };
})