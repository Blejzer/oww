(function () {
    'use strict';

    angular.module('oneWordWorld')
        .config(config);

    config.$inject = ['$urlRouterProvider', '$stateProvider','$locationProvider'];
    function config($urlRouterProvider, $stateProvider, $locationProvider) {

        // If user goes to a path that doesn't exist, redirect to public root
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                views: {

                    // the main template will be placed here (relatively named)
                    '': {   templateUrl: 'views/home.html',
                            controller: 'HomeController'}
                    // 'week@home': {
                    //     templateUrl: 'views/week.html'
                    // },
                    // 'oneWordInput@home': {
                    //     templateUrl: 'views/onewordinput.html'
                    // },
                    // 'results@home': {
                    //     templateUrl: 'views/results.html'
                    // }
                }

            })
            .state('event', {
                url: '/event',
                views: {

                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'views/event.html',
                        controller: 'EventController'}
                    // 'week@home': {
                    //     templateUrl: 'views/week.html'
                    // },
                    // 'oneWordInput@home': {
                    //     templateUrl: 'views/onewordinput.html'
                    // },
                    // 'results@home': {
                    //     templateUrl: 'views/results.html'
                    // }
                }

            })
            .state('person', {
                url: '/person',
                views: {

                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'views/person.html',
                        controller: "PersonController"}
                    // 'week@home': {
                    //     templateUrl: 'views/week.html'
                    // },
                    // 'oneWordInput@home': {
                    //     templateUrl: 'views/onewordinput.html'
                    // },
                    // 'results@home': {
                    //     templateUrl: 'views/results.html'
                    // }
                }

            })
            .state('newevent', {
                url: '/newevent',
                views: {

                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'views/newevent.html'}
                    // 'week@home': {
                    //     templateUrl: 'views/week.html'
                    // },
                    // 'oneWordInput@home': {
                    //     templateUrl: 'views/onewordinput.html'
                    // },
                    // 'results@home': {
                    //     templateUrl: 'views/results.html'
                    // }
                }

            });

        $locationProvider.html5Mode(true);

    }
})();
