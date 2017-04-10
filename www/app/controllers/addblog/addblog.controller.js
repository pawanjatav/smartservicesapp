angular.module('addblogs.module.controller', []).controller('addblogs.controller', function ($scope,$cordovaCamera,$stateParams, $ionicLoading, $ionicHistory, $state, httpServices, ionicToast) {
    //  $scope.images = ["img/classprofile.png"];
    $scope.images = [];
    $scope.data = {};
    var status = localStorage.getItem("UserID");
    //  alert(    httpServices.Bloglist('L', null));
    if (status === null || status === undefined || status === 'undefined' || status === '') {
        $state.go('login');
    }

    if ($stateParams.blogid!='')
    {
        httpServices.get('/GetPrivacyTypeList/L').then(function (response) {
            //     alert(response);
            $scope.Privacyvalues = response.data.GetPrivacyTypeListResult;
            
        httpServices.get('/GetBlogList/' + $stateParams.blogid + '/' + null + '/1/5', 'abc').then(function (response) {

            $scope.blogvaluesData = response.data.GetBlogListResult;
            $scope.images = $scope.blogvaluesData[0].Fileinfo;
            $scope.images.map((i, j) => {
               // alert(i);
                $scope.images[j] = {imgName:'http://smartservicesapp.com/Uploads/BlogDoc/' + i,isLocal:false};
            })
            $scope.data.textContent = $scope.blogvaluesData[0].textContent;
            $scope.PrivacyID = $scope.blogvaluesData[0].PrivacyID;
            $scope.data.PrivacyID = $scope.blogvaluesData[0].PrivacyID;
            $scope.CategoryID = $scope.blogvaluesData[0].CategoryID;
            $scope.data.CategoryID = $scope.blogvaluesData[0].CategoryID;
          //  console.log($scope.data);
            console.log($scope.blogvaluesData);
        }, function (error) {
        });
        }, function (error) {
        });
    }
    else {
        httpServices.get('/GetPrivacyTypeList/L').then(function (response) {
            //     alert(response);
            $scope.Privacyvalues = response.data.GetPrivacyTypeListResult;
        }, function (error) {
        });
    }
    $scope.deleteImg = function ($index, img) {
        if (img.isLocal)
        {
            $scope.images.splice($index, 1);
        }
        else {

        $scope.images.splice($index, 1);
        httpServices.post('/DeleteBlogImage', { BlogId: $stateParams.blogid, ImageName: img.imgName.substr(img.imgName.lastIndexOf('/')+1) }).then(function (response) {

           
        }, function (error) {
        });
        }
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

      var imgPath = imageData.substr(0, imageData.lastIndexOf('?'));
      if (imgPath == "") {
          $scope.images.push({ imgName: imageData, isLocal: true });
          setTimeout(function () {

              $scope.images.apply();
          }, 500);
      }
      else {

          $scope.images.push({ imgName: imgPath, isLocal: true });
          setTimeout(function () {

              $scope.images.apply();
          }, 500);

      }

       
     
    },function(er){


    });

   
}


    $scope.addBlog1 = function (data) {
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
        if ($stateParams.blogid == '')
        {
            data.BlogId = 0;
        }
        else {
            data.BlogId = $stateParams.blogid;
        }
        httpServices.post('/AddBlog', data).then(function (response) {
     
            BlogIDs = response.data.Source;
           
           // alert(JSON.stringify(response));
            //  debugger;
            
            if ($scope.images.length >0) {
                document.addEventListener("deviceready", onDeviceReady, false);
            }
            else {
                $state.go('dashboard');
                httpServices.Bloglist('L',null,1,5,'initializeagain');
            }

        }, function (error) {
            //    alert("AddBlog :: " + JSON.stringify(error))
        });


        function onDeviceReady() {
            var i = 0;
            console.log($scope.images);
           // for (var i = 0; i < $scope.images.length; i++)
          function upImages()  {
            //  alert();
              if ($scope.images.length > i && $scope.images[i].isLocal) {
                 
                  if ($scope.images[i].isLocal) {
                      
                  var fileURL = $scope.images[i].imgName;
                  console.log(fileURL);
                  var options = new FileUploadOptions();
                  options.fileKey = "file";
                  options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);

                  options.mimeType = "text/plain";
                  var params = {};

                  options.params = { "BlogIDs": BlogIDs };
                  var ft = new FileTransfer();
                  //  alert(fileURL);
                      //alert(JSON.stringify(options));
                  console.log(fileURL);
                  $ionicLoading.show();
                  ft.upload(fileURL, encodeURI("http://smartservicesapp.com/PicBlog.ashx"), function (r) {
                      //  alert(JSON.stringify(r));
                      console.log(r)
                      console.log(i)
                      var result = { blog: data, image: $scope.images[i] }

                      localStorage.setItem("blogadded", JSON.stringify(result));
                      if ($scope.images.length > i) {
                          console.log('called condition');
                          i++;
                          upImages();
                         
                      }
                      else {
                          var value = $ionicHistory.clearCache();
                          console.log('uploaded successfully');
                          value.then(function () {
                              $ionicLoading.hide();
                              httpServices.Bloglist('L', null, 1, 5, 'initializeagain');
                          })
                          return null;
                      }
                     
                  }, function (error) {
                      alert("An error has occurred: Code = " + error.code);
                      alert("upload error source " + error.source);
                      alert("upload error target " + error.target);
                  }, options);
                 
                  }
                 
                }
              else {
                  if ($scope.images.length - 1 >= i) {
                      i++;
                      upImages();
                  } else {
                      var value = $ionicHistory.clearCache();
                      console.log('uploaded successfully');
                      value.then(function () {
                          $ionicLoading.hide();
                          httpServices.Bloglist('L', null, 1, 5, 'initializeagain');
                      })
                      return null;
                  }
                
                  
              }
          }
          upImages();
        }



    }
   



})