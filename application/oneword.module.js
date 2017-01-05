(function() {
"use strict";

/**
 * oneWordWorld module that includes router, file upload
 * ngCookies
 * Look for the included files in their respective folders.
 */
angular.module('oneWordWorld', ['ui.router', 'fileUpload', 'kukis'])

})();



// .config.js(config.js);
//
// config.js.$inject = ['$urlRouterProvider', '$stateProvider'];
// function config.js($urlRouterProvider, $stateProvider) {
//
//     // If user goes to a path that doesn't exist, redirect to public root
//     $urlRouterProvider.otherwise('/');
//
//     $stateProvider
//         .state('home', {
//           url: '/',
//         views: {
//
//             // the main template will be placed here (relatively named)
//             '': { templateUrl: 'views/home.html' }
//             // 'week@home': {
//             //     templateUrl: 'views/week.html'
//             // },
//             // 'oneWordInput@home': {
//             //     templateUrl: 'views/onewordinput.html'
//             // },
//             // 'results@home': {
//             //     templateUrl: 'views/results.html'
//             // }
//         }
//
//     })
//     .state('event', {
//       url: '/event',
//       views: {
//
//           // the main template will be placed here (relatively named)
//           '': { templateUrl: 'views/event.html' }
//           // 'week@home': {
//           //     templateUrl: 'views/week.html'
//           // },
//           // 'oneWordInput@home': {
//           //     templateUrl: 'views/onewordinput.html'
//           // },
//           // 'results@home': {
//           //     templateUrl: 'views/results.html'
//           // }
//       }
//
//     })
//     .state('person', {
//       url: '/person',
//       views: {
//
//           // the main template will be placed here (relatively named)
//           '': { templateUrl: 'views/person.html' }
//           // 'week@home': {
//           //     templateUrl: 'views/week.html'
//           // },
//           // 'oneWordInput@home': {
//           //     templateUrl: 'views/onewordinput.html'
//           // },
//           // 'results@home': {
//           //     templateUrl: 'views/results.html'
//           // }
//       }
//
//     });
//   };