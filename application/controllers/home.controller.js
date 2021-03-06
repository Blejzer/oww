(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$rootScope', '$scope', '$location', '$window', 'socket', 'FacebookFactory', 'FacebookService'];
    function HomeController($rootScope, $scope, $location, $window, socket, FacebookFactory, FacebookService) {
        $scope.ewords = [];
        $scope.pwords = [];
        $scope.event = [];
        $scope.person = [];

        // $scope.$on('$viewContentLoaded', function () {
        //     console.log('HomeController inside $viewContentLoaded', $scope.event);
        // });

        $scope.$on('listPerson', function (p1, p2) {
            // console.log("listPerson event fired: ", p2);
            $scope.person = p2;
        });
        $scope.$on('listEvent', function (p1, p2) {
            // console.log("listEvent event fired: ", p2);
            $scope.event = p2;
        });



        $scope.submitEword = function () {
            socket.emit('event', 'event', this.e, this.event.event_id);
            console.log('eword: ', this.e);
            $scope.ei = this.e;
            this.e = '';
            return false;
        };

        $scope.submitPword = function () {
            socket.emit('person', 'person', this.p,this.person.person_id);
            console.log('pword: ', this.p);
            $scope.pi = this.p;
            this.p = '';
            return false;
        };

        $scope.$on('$stateChangeSuccess', function () {
            $scope.event = $rootScope.event;
            $scope.person = $rootScope.person;
            // $scope.eventList = $rootScope.eventList;
            // $scope.personList = $rootScope.personList;
            // console.log('$stateChangeSuccess $scope.event: ', $rootScope.event);

        });

        socket.on('test', function (listEvent, listPerson) {
            // console.log('HomeController inside test socket on');
            $scope.$apply(function() {
                $scope.event = listEvent;
                $scope.person = listPerson;
                $rootScope.person = listPerson;
                $rootScope.event = listEvent;
            });
        });

        /*
        * working with socket.io
        */
        socket.on('eventWord', function (evt) {
            $scope.ewords.unshift(evt);
            // console.log('ewords.unshift: ', evt);
        });

        socket.on('personWord', function (evt) {
            $scope.pwords.unshift(evt);
            // console.log('pwords.unshift: ', evt);
        });

        socket.on('eventList', function(json){
            var evt = JSON.parse(json);
            $scope.eventList = evt;
            $rootScope.eventList = $scope.eventList;
        });

        socket.on('personList', function(json){
            var evt = JSON.parse(json);
            $scope.personList = evt;
            $rootScope.personList = $scope.personList;
        });
        socket.on('disconnect', function(){
            console.log('home page socket disconnected');
            socket.removeAllListeners();
        });


        /*
        * Facebook part of the home controller
        */

        var fbAppId = '415516472142865';
        var fbTestAppId = '418774601817052';


        FacebookFactory.setLang('en_US'); // set lang
        FacebookFactory.init({
            appId: fbAppId, // required, default = null
            status: true, // optional, default = true
            cookie: false, // optional, default = false
            xfbml: false, // optional, default = false
            version: 'v2.9' // optional, default = v2.4
        })

        $scope.status = false;

        $scope.getAuth = function (callback) {
            FacebookService.auth(function (response) {
                $scope.token = response.authResponse.accessToken // Get token
                FacebookService.me(function (response) {
                    $scope.me = response;
                    $scope.status = true;
                })
            })
        }
        $scope.logout = function () {
            FacebookService.logout(function (response) {
                // console.log('logout response: ', response);
                $scope.status = false;
            })
        }

        $scope.disconnect = function () {
            FacebookService.disconnect(function (response) {
                // console.log('disconnect response: ', response);
                $scope.status = false;
            })
        }

        $scope.shareWorld = function () {
            FacebookService.share({
                href: 'http://www.worldsword.com/',
                title: 'World`s Word',
                description: 'World`s word is a place where you should try and express yourself in ONE word only!',
                image: 'http://www.worldsword.com/images/OneWordWorld1.png'
            }, function (response) {
                $scope.me = response;
                $scope.status = true;
            })
        }

        $scope.sharePerson = function () {
            FacebookService.share({
                href: 'http://www.worldsword.com/socialp',
                title: 'Person of the week',
                description: $scope.person.title,
                image: $scope.person.image
            }, function (response) {
                $scope.me = response;
                $scope.status = true;
            })
        }
        $scope.shareEvent = function () {
            FacebookService.share({
                href: 'http://www.worldsword.com/sociale',
                title: 'Event of the week',
                description: $scope.event.title,
                image: $scope.event.image
            }, function (response) {
                $scope.me = response;
                $scope.status = true;
            })
        }

    }
})();

