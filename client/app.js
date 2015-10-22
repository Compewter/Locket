angular.module('Locket', [
  'Locket.chat',
  'Locket.auth',
  'Locket.authFactory',
  'Locket.socketFactory',
  'ui.router',
  // 'Locket.encryptionFactory',
  'luegg.directives'
])
.config(function ($stateProvider, $urlRouterProvider) {
  console.log('working');

  $stateProvider
    .state('chat', {
      params: {currentUser: null},
      url: '/',
      templateUrl: 'app/features/chat/chat.html',
      controller: 'chatController'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/features/auth/login.html',
      controller: 'authController'
    });

  $urlRouterProvider.otherwise('/login');
});
