(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('ArchiveController', ArchiveController);



    ArchiveController.$inject = ['$rootScope', '$state', 'socket', '$scope'];

    function ArchiveController ($rootScope, $state, socket, $scope) {

        console.log('ArchiveController loaded');
        if($rootScope.archive){
            console.log('$rootScope.archive exists... removing');
            delete $rootScope.archive;
        }

        var vm = this;
        // vm.test = moment(vm.week).format('YYYYWW');
        // console.log('test', vm.test);
        vm.bar = 0;


        vm.submitDate = function () { //function to call on form submit
            console.log('vm.title ', vm.sel1);
            console.log('vm.week ', vm.week);
            var test = moment(vm.week).format('YYYYWW');
            console.log('test', test);
            // console.log('archive.type: ', archive.type);
            // $rootScope.archive = archive;
            if(vm.sel1){
                socket.emit('checkevnt', vm.sel1.toLowerCase(), test);
                console.log('checkevnt emited');
            }

        };
        socket.on('checkOK', function (json) {
            console.log('checkOK received');
            var result = JSON.parse(json);
            console.log('checkOK received', result[0]);
            $rootScope.archive = result[0];
            // socket.emit('newEventPageLoaded', archive.event);
            console.log('event chosen', $rootScope.archive);
            // $state.go(vm.sel1.toLowerCase());
        });

        socket.on('disconnect', function(){
            // delete $rootScope.archive;
            console.log('archive page socket disconnected');
            socket.removeAllListeners();
        });




        // Pie Chart configuration!
        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.a;}, // d.a (a is key of parsed json response)
                y: function(d){return d.c;}, // d.c (c is value of parsed json response)
                showLabels: true,
                callback: function(){
                    d3.selectAll('.nvd3.text g').style('fill', "white");
                },
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


        // Loaded data from db for charts
        socket.on('eventPageSuccess', function(json){
            var evt = JSON.parse(json);
            $scope.globalList = evt;
            $scope.edata = evt;
        });
        socket.on('eventCtnPageSuccess', function(json){

            var resultingArray =[];
            var words = [];
            var cntnevnt = JSON.parse(json);
            cntnevnt.forEach(function(cont){
                words = cont.ewords;
                resultingArray.push({
                    cont: cont.cont,
                    ewords: words
                })
            });
            $scope.contList = resultingArray;

        });

        socket.on('personPageSuccess', function(json){

            var glbprsn = JSON.parse(json);
            $scope.globalList = glbprsn;
            $scope.pdata = glbprsn;
        });
        socket.on('personCtnPageSuccess', function(json){

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



    }


})();