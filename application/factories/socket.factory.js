(function () {
    'use strict';
    angular.module('oneWordWorld')
        .factory('socket', ['socketFactory', function (socketFactory) {
                return socketFactory();
        }]);
})();