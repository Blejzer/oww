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
                url: '/:tag',
                views: {
                    'navbar@': { templateUrl: 'views/addons/navbar.html'},
                    '': {   templateUrl: 'views/home.html',
                            controller: 'HomeController'}
                }
            })
            .state('person', {
                url: '/person/:person_id',
                views: {
                    'navbar@': { templateUrl: 'views/addons/navbar2.html'},
                    '': {
                        templateUrl: 'views/person1.html',
                        controller: 'PersonController'}
                }
            })
            .state('aboutus', {
                url: '/aboutus',
                views: {
                    'navbar@': { templateUrl: 'views/addons/navbar2.html'},
                    '': {
                        templateUrl: 'views/aboutus.html'}
                }
            })
            .state('terms', {
                url: '/terms',
                views: {
                    'navbar@': { templateUrl: 'views/addons/navbar2.html'},
                    '': {
                        templateUrl: 'views/terms.html'}
                }
            })
            .state('event', {
                url: '/event/:event_id',
                views: {
                    'navbar@': { templateUrl: 'views/addons/navbar2.html'},
                    '': {
                        templateUrl: 'views/event2.html',
                        controller: 'EventController'}
                }
            })
            .state('archive', {
                url: '/archive',
                views: {
                    'navbar@': { templateUrl: 'views/addons/navbar2.html'},
                    '': {
                        templateUrl: 'views/archive.html',
                        controller: 'ArchiveController'}
                }
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        // $locationProvider.hashPrefix('!');
        // $locationProvider.html5Mode(true);

    };

})();

