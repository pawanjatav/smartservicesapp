angular.module('blogsdetailed.module.controller', []).controller('blogsdetailed.controller', function ($stateParams, $scope, $ionicSlideBoxDelegate, httpServices, $state) {
  
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
  }, function (error) {
  });
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