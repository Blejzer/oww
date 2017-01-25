(function () {
    'use strict';

    /*
     * OwwUserPersistenceService - OwwUPS
     */
    angular.module('oneWordWorld')
        .factory('OwwUPS', OwwUPS);

    OwwUPS.$inject = ["$cookies"];
    function OwwUPS ($cookies) {
        var visitor = '';

        return {
            setCookieData: function (data) {
                // console.log('OwwUPS, setCookieData, data: ', data);
                $cookies.put('visitor', data);
            },
            getCookieData: function () {
                visitor = $cookies.get('visitor');
                // console.log('getCookieData, visitor: ', $cookies.get('visitor'));
                return visitor;
            },
            clearCookieData: function () {
                visitor = '';
                $cookies.remove('visitor');
            }
        }
    }
})();
