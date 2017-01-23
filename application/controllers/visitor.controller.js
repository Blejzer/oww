(function () {
    'use strict';
    angular.module('oneWordWorld')
        .controller('VisitorController', VisitorController);

    VisitorController.$inject = ['$scope', 'OwwVPS'];
    function VisitorController($scope, OwwVPS) {

        $scope.visitor = {};

        $scope.init = function () {

        }

        OwwVPS.on('notification', function (data) {
            $scope.$apply(function () {
                console.log("notification data: ", data.visitor);
                $scope.visitor = data.visitor;
            });
        });


    }


    // KukizController.$inject = ['$scope', 'OwwUPS'];
    // function KukizController($scope, OwwUPS) {
    //     $scope.visitor = '';
    //     // $scope.currentCustomer = {};
    //
    //
    //     $scope.init = function () {
    //         // OwwUPS.emit('add-customer', $scope.currentCustomer);
    //     };
    //
    //     OwwUPS.on('notification', function (data) {
    //         $scope.$apply(function () {
    //             console.log("notification data: ", data.visitor);
    //             $scope.visitor = data.visitor;
    //         });
    //     });
    //
    // }

})();