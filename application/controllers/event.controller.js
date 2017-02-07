(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('EventController', EventController);


    /**
     * Configures the routes and views
     */
    EventController.$inject = ['$scope', 'socket'];
    function EventController($scope, socket) {
        var ectrl = this;

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
            console.log('Event page $stateChangeSuccess fired');
            socket.emit('eventPageLoaded');
            socket.emit('eventCtnPageLoaded');
            test(socket);
        });

        function test (socket) {
            console.log('socket.id', socket);
        }

        socket.on('eventPageSuccess', function(json){

            var evt = JSON.parse(json);
            $scope.globalList = evt;
            $scope.edata = evt;
        });
        socket.on('eventCtnPageSuccess', function(json){

            // var evt = JSON.parse(json);
            console.log('evt from eventCtnPageSuccess: ', json);
            var resultingArray =[];
            var words = [];
            json.forEach(function(cont){
                 words = cont.ewords;
                resultingArray.push({
                    cont: cont.cont,
                    ewords: words
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


//
// $scope.changeState = function () {
//     //$state.go('contact.detail');
//     console.log('event controller: change state invoked');
// };
