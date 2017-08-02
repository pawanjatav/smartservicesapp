angular.module('http.service.module', []).service('httpServices', ['$q', '$http', '$ionicLoading', '$rootScope', '$state', function ($q, $http, $ionicLoading, $rootScope, $state) {

   
  //var url =  'http://localhost:49267/service.svc';
     var url = 'http://smartservicesapp.com/Service.svc';  
      $rootScope.blogvalues = [];
      this.get = function (urlres,loading) {
         
          var q = $q.defer();
          if (loading == 'loadmore' || loading == 'category') {
             // alert(loading);
             
          }
          else {
              $ionicLoading.show();
             // alert('unknown');
          }
     
      $http.get(url+urlres).then(function (result) {
         
          q.resolve(result);
         $ionicLoading.hide();
      }, function (error) {
          q.reject(error);
          $ionicLoading.show({ template: 'Some error occured' });
          setTimeout(function () {
              $ionicLoading.hide()
          }, 3000)
      })
      return q.promise;
  }
  this.post = function (urlres, data) {
   
      var q = $q.defer();
      $ionicLoading.show();
      $http.post(url+urlres, data).then(function (result) {
         $ionicLoading.hide();
          q.resolve(result);
      }, function (error) {
          q.reject(error);
          $ionicLoading.show({ template: 'Some error occured' });
          setTimeout(function () {
              $ionicLoading.hide()
          }, 3000)
      });
      return q.promise;
  }


  this.Bloglist = function (BlogID, CategoryID,Page,PageSize,loading) {
      var q = $q.defer();
      //  alert(BlogID + ',' + CategoryID);
      if (loading == 'initializeagain')
      {
          $rootScope.blogvalues = [];
      }
     
      this.get('/GetBlogList/' + BlogID + '/' + CategoryID + '/' + Page + '/' + PageSize,loading).then(function (response) {
          console.log(response.data.GetBlogListResult);
          for (var i = 0; i < response.data.GetBlogListResult.length; i++)
          {
              $rootScope.blogvalues.push(response.data.GetBlogListResult[i]);
          }
          
          $rootScope.blogvalues.map((i, j) => {
              if (i.UserLikes != null)
              {
                  i.UserLikesCount = i.UserLikes.split(',').length-1;
              }
              
          })
          console.log($rootScope.blogvalues);
        //  console.log(JSON.stringify( response.data.GetBlogListResult));
        //  $ionicLoading.hide();
          q.resolve(response.data.GetBlogListResult);
          $state.go("dashboard");
      }, function (error) {  q.reject(error);
      $ionicLoading.show({ template: 'Some error occured' });
      setTimeout(function () {
          $ionicLoading.hide()
      }, 3000)
      });  return q.promise;
  }

     

}]);