(function () {
    'use strict';

    angular.module('oneWordWorld')
        .config(config);

    config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
    function config($urlRouterProvider, $stateProvider, $locationProvider) {

        // If user goes to a path that doesn't exist, redirect to public root
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                views: {

                    'navbar@': { templateUrl: 'views/navbar.html'},

                    // the main template will be placed here (relatively named)
                    '': {   templateUrl: 'views/home.html',
                            controller: 'HomeController'}
                }

            })
            .state('event', {
                url: '/event',
                views: {
                    'navbar@': { templateUrl: 'views/navbar.html'},
                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'views/event.html',
                        controller: 'EventController'}
                }
            })
            .state('econtinent', {
                url: '/econtinent',
                views: {
                    'navbar@': { templateUrl: 'views/navbar.html'},
                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'views/Econtinent.html',
                        controller: 'EventController'}
                }
            })
            .state('person', {
                url: '/person',
                views: {
                    'navbar@': { templateUrl: 'views/navbar.html'},
                    '': {
                        templateUrl: 'views/person.html',
                        controller: "PersonController"
                    }
                }
            })
            .state('pcontinent', {
                url: '/pcontinent',
                views: {
                    'navbar@': { templateUrl: 'views/navbar.html'},
                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'views/Pcontinent.html',
                        controller: 'PersonController'}
                }
            })
            .state('newevent', {
                url: '/newevent',
                views: {

                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'views/newevent.html'}
                }

            });

        // $locationProvider.html5Mode({
        //     enabled: true,
        //     requireBase: false
        // });
        $locationProvider.html5Mode(true);

    }
})();
