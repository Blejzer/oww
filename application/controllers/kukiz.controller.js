(function () {
    'use strict';
    angular.module('OneWordWorld')
        .controller('KukizController', KukizController);


    KukizController.$inject['$scope', 'OwwUPS'];
    function KukizController($scope, OwwUPS) {
        $scope.newCustomers = [];
        $scope.currentCustomer = {};

        $scope.join = function() {
            OwwUPS.emit('add-customer', $scope.currentCustomer);
        };

        OwwUPS.on('notification', function(data) {
            $scope.$apply(function () {
                $scope.newCustomers.push(data.customer);
            });
        });

    }

    })();