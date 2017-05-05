(function () {
    'use strict';
    angular.module('oneWordWorld')
        .factory('socket', ['socketFactory', function (socketFactory) {
            // console.log('inside socketFactory:');
            return socketFactory();
        }]);
})();