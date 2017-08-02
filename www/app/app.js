// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('trust', ['ionic',
    'login.module',
    'dashboard.module',
    'registration.module',
    'blogsdetailed.module',
    'addblogs.module',
'http.service.module',
'main.module.controller',
'ionic-toast',
'mypost.module',
'forgetpassword.module',
'ngCordova',
'changepassword.module'
])

.run(function ($ionicPlatform, $state, $rootScope) {
  
    $rootScope.checkBlogDetail = true;
    $rootScope.$on('$stateChangeStart',
function (event, toState, toParams, fromState, fromParams) {
    // do something
    if (toState.name == 'mypost') {
        
        $rootScope.isMypost = true;
        return;
    }
    if(fromState.name=='mypost')
    {
        $rootScope.isMypost = false;
    }
    console.log($rootScope.isMypost)
})
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
  


      var push = PushNotification.init({
            android: {
                senderID: "982524787977"
            },
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        });

        push.on('registration', function (data) {
            // data.registrationId
       //  alert(JSON.stringify(data));
           
            localStorage.setItem("GCMID", data.registrationId);
        });
      
        push.on('notification', function (data) {
            // alert(JSON.stringify(data));
            $rootScope.checkBlogDetail = false;
            if (!data.additionalData.foreground) {
                console.log(data);
                $rootScope.checkBlogDetail = true;
                $state.go('blogsdetailed', { BlogId: data.additionalData.blogId, CategoryID: 5 });
            }
            
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
        });
       
        push.on('error', function (e) {
            // e.message
        });
















    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).config(function ($urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);

    $urlRouterProvider.otherwise('dashboard');
})
