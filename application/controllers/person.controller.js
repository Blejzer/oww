(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('PersonController', PersonController);


    /**
     * Configures the routes and views
     */
    PersonController.$inject = ['$rootScope','$scope', 'socket', '$state'];
    function PersonController($rootScope, $scope, socket, $state) {
        var pctrl = this;
        var person_id = $rootScope.person.person_id;
        console.log('$rootScope.person: ', $rootScope.person);

        // Pie Chart configuration!
        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.a;}, // d.a (a is key of parsed json response)
                y: function(d){return d.c;}, // d.c (c is value of parsed json response)
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };
        $scope.$on('$stateChangeSuccess', function () {
            socket.emit('newPersonPageLoaded', person_id);
            // socket.emit('personCtnPageLoaded', person_id);
        });

        // $scope.$on('$stateChangeSuccess', function () {
        //     switch ($state.current.name) {
        //         case "person": {
        //             socket.emit('personPageLoaded', person_id);
        //         }
        //             break;
        //         case "pcontinent": {
        //             socket.emit('personCtnPageLoaded', person_id);
        //         }
        //             break;
        //         default:
        //     }
        //     console.log('Person page $stateChangeSuccess fired');
        // });
        //
        socket.on('personPageSuccess', function(json){

            var glbprsn = JSON.parse(json);
            $scope.globalList = glbprsn;
            $scope.pdata = glbprsn;
        });
        socket.on('personCtnPageSuccess', function(json){

            // var evt = JSON.parse(json);
            console.log('person from personCtnPageSuccess: ', json);
            var resultingArray =[];
            var words = [];
            var cntnprsn = JSON.parse(json);
            cntnprsn.forEach(function(cont){
                words = cont.pwords;
                resultingArray.push({
                    cont: cont.cont,
                    pwords: words
                })
            });
            $scope.contList = resultingArray;
        });

        socket.on('disconnect', function(){
            console.log('event page socket disconnected');
            socket.removeAllListeners();
        });

    }


})();