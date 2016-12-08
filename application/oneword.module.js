(function() {
"use strict";

/**
 * oneWordWorld module that includes the public module as a dependency
 */
angular.module('oneWordWorld', ['ui.router'])
.config(config);

config.$inject = ['$urlRouterProvider', '$stateProvider'];
function config($urlRouterProvider, $stateProvider) {


    // If user goes to a path that doesn't exist, redirect to public root
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
        url: '/home',
        views: {

            // the main template will be placed here (relatively named)
            '': { templateUrl: 'views/home.html' },

            // the child views will be defined here (absolutely named)
            'person@home': { templateUrl: 'views/test1.html' },

            // for column two, we'll define a separate controller
            'event@home': {
                templateUrl: 'views/test1.html'
            }
        }

    });



      };

})();
