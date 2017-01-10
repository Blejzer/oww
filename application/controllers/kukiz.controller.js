(function () {
    'use strict';
    angular.module('oneWordWorld')
        .controller('KukizController', KukizController);


    KukizController.$inject = ['$scope', 'OwwUPS'];
    function KukizController($scope, OwwUPS) {
        $scope.customer = '';
        $scope.currentCustomer = {};


        $scope.init = function() {
            OwwUPS.emit('add-customer', $scope.currentCustomer);
        };

        OwwUPS.on('notification', function(data) {
            $scope.$apply(function () {
                console.log("notification data: ", data.customer);
                $scope.customer = data.customer;
            });
        });

    }

    })();