/*******************************************************
 * Copyright (C) Nikola Kujaca - All Rights Reserved    *
 * Unauthorized copying of this file, via any medium    *
 * is strictly prohibited proprietary and confidential  *
 * Written by Nikola Kujaca <nikola.kujaca@gmail.com>,  *
 * 1411972                                              *
 ********************************************************/
(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('FbController', FbController);


    FbController.$inject = ['$rootScope', '$scope', 'FacebookFactory', 'FacebookService'];

    function FbController ($rootScope, $scope, FacebookFactory, FacebookService) {
        var fbAppId = '415516472142865';

        FacebookFactory.setLang('en_US'); // set lang
        FacebookFactory.init({
            appId: fbAppId, // required, default = null
            status: true, // optional, default = true
            cookie: false, // optional, default = false
            xfbml: false, // optional, default = false
            version: 'v2.9' // optional, default = v2.4
        })


        var vm = this;
        // vm.person = $rootScope.person;
        // vm.event = $rootScope.event;

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
                console.log('logout response: ', response);
                $scope.status = false;
            })
        }

        $scope.disconnect = function () {
            FacebookService.disconnect(function (response) {
                console.log('disconnect response: ', response);
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

        $scope.sharePerson = function (person) {
            console.log('verify scope values: ', person.image);
            FacebookService.share({
                href: 'http://www.worldsword.com/person/'+person.person_id+'/',
                title: 'Person of the week',
                description: person.title,
                image: person.image
            }, function (response) {
                $scope.me = response;
                $scope.status = true;
            })
        }
        $scope.shareEvent = function (event) {
            console.log('verify scope values: ', event.image);
            FacebookService.share({
                href: 'http://www.worldsword.com/event',
                title: 'Event of the week',
                description: event.title,
                image: event.image
            }, function (response) {
                $scope.me = response;
                $scope.status = true;
            })
        }
    }


})();