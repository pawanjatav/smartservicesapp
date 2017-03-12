angular.module('blogsdetailed.module.controller', []).controller( 'blogsdetailed.controller', function ($ionicPopup,$stateParams, $scope, $ionicSlideBoxDelegate, httpServices, $state) {
  
     $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
  var BlogIDs = $stateParams.BlogId;
  $scope.UserId = window.localStorage.getItem('UserID');
  getComment();
  $scope.convertDate = function (mydate) {
      var p = mydate;
      var g = parseInt(p.replace("/Date(", "").replace(")/", ""));
      return g;
  }
 

  httpServices.get('/GetBlogList/'+BlogIDs+'/'+null).then(function (response) {

      $scope.blogvalues = response.data.GetBlogListResult;
      $scope.blogvalues.map((i, j) => {
          if (i.UserLikes != null) {
              i.UserLikesCount = i.UserLikes.split(',').length - 1;
          }

      })
  }, function (error) {
  });
  $scope.likeBlog = function (blogId, index) {
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
          if ($scope.blogvalues[index].UserLikes != null) {
              array = $scope.blogvalues[index].UserLikes.split(',');
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
          httpServices.get('/UserLikes/' + blogId + '/' + window.localStorage.getItem('UserID')).then(function (res) {
              if ($scope.blogvalues[index].UserLikes != null) {
                  $scope.blogvalues[index].UserLikesCount = parseInt($scope.blogvalues[index].UserLikesCount) + 1;
                  $rootScope.blogvalues[index].UserLikes+=status+',';
              } else {
                  $scope.blogvalues[index].UserLikesCount = '1';
                  $rootScope.blogvalues[index].UserLikes+=status+',';
              }
          }, function (er) {

              console.log(er)
          })
      }


  }
  $scope.addComment = function (txtContent) {
      var status = localStorage.getItem("UserID");
      //  alert(    httpServices.Bloglist('L', null));
      if (status === null || status === undefined || status === 'undefined' || status === '') {
          $state.go('login');
      }
      var data={
          Comment:txtContent,
          UserID: $scope.UserId,
          BlogId: BlogIDs,
          CommentId:0
      }
      httpServices.post('/AddUpdateBlogComment', data).then(function (res) {
          console.log(data);
          getComment();
      }, function (er) {

      });
  }
  $scope.editShow = function (id) {
      $scope.Comment.map((i, j) => {
          if (id == i.CommentId) {
              i.commentShow = true;
          }
      })
  }
  $scope.editComment = function (CommentText,id) {
      var data = {
          Comment: CommentText,
          UserID: $scope.UserId,
          BlogId: BlogIDs,
          CommentId: id
      }

      httpServices.post('/AddUpdateBlogComment', data).then(function (res) {
          console.log(res);
          $scope.Comment.map((i, j) => {
              if (i.CommentId == id)
              {
                  i.commentShow = false;
              }
          })
      }, function (er) {

          console.log(er)
      })
  }
  $scope.DeleteBlogComment = function (id) {

      httpServices.get('/DeleteBlogComment/' + id).then(function (res) {
         // $scope.Comment = res.data.UserCommentResult;
          
          getComment();
      }, function (er) {
          console.log(er);
      });
  }
  function getComment() {
      httpServices.get('/UserComment/' + BlogIDs).then(function (res) {
          $scope.Comment = res.data.UserCommentResult;
          $scope.Comment.map((i, j) => {
              i.commentShow = false;
          })
          console.log($scope.Comment);
      }, function (er) {
          console.log(er);
      });
  }
})