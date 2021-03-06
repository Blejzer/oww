(function () {
    'use strict';

    angular.module('authServer')
        .config(config);

    config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];
    function config($urlRouterProvider, $stateProvider, $locationProvider) {

        // If user goes to a path that doesn't exist, redirect to public root
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                views: {

                    'navbar@': { templateUrl: 'views/addons/navbar.html'},

                    // the main template will be placed here (relatively named)
                    '': {   templateUrl: 'views/home.html',
                        controller: 'HomeController'},
                    'footer@': { templateUrl: 'views/addons/footer.html'}
                }

            })
            .state('event', {
                url: '/event',
                views: {
                    'navbar@': { templateUrl: 'views/addons/navbar.html'},
                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'views/Event.html',
                        controller: 'EventController'},
                    'footer@': { templateUrl: 'views/addons/footer.html'}
                }
            })
            .state('econtinent', {
                url: '/econtinent',
                views: {
                    'navbar@': { templateUrl: 'views/addons/navbar.html'},
                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'views/Econtinent.html',
                        controller: 'EventController'},
                    'footer@': { templateUrl: 'views/addons/footer.html'}
                }
            })
            .state('person', {
                url: '/person',
                views: {
                    'navbar@': { templateUrl: 'views/addons/navbar.html'},
                    '': {
                        templateUrl: 'views/Person.html',
                        controller: "PersonController"},
                    'footer@': { templateUrl: 'views/addons/footer.html'}
                }
            })
            .state('pcontinent', {
                url: '/pcontinent',
                views: {
                    'navbar@': { templateUrl: 'views/addons/navbar.html'},
                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'views/Pcontinent.html',
                        controller: 'PersonController'},
                    'footer@': { templateUrl: 'views/addons/footer.html'}
                }
            })
            .state('newevent', {
                url: '/newevent',
                views: {
                    'navbar@': { templateUrl: 'views/addons/navbar.html'},
                    // the main template will be placed here (relatively named)
                    '': {templateUrl: 'views/newevent.html'},
                    'footer@': { templateUrl: 'views/addons/footer.html'}
                }

            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        // $locationProvider.html5Mode(true);

    }
})();
