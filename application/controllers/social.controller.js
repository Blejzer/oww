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
        .controller('SocialController', SocialController);


    SocialController.$inject = ['$rootScope','$scope'];

    function SocialController($rootScope, $scope) {

        var ectrl = this;

        ectrl.event = $rootScope.event;

        $scope.event = ectrl.event;

        // $scope.$apply();

        // console.log('fbevent page started');

        $scope.$on('$viewContentLoaded', function () {
            // console.log('SocialController inside $viewContentLoaded', $scope.event);
        });

    }

})(); // end of use strict!