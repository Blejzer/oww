(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('ArchiveController', ArchiveController);



    ArchiveController.$inject = ['$rootScope', '$scope', '$state', 'socket'];

    function ArchiveController ($rootScope, $scope, $state, socket) {

        console.log('ArchiveController loaded');

        var vm = this;
        // vm.test = moment(vm.week).format('YYYYWW');
        // console.log('test', vm.test);
        vm.bar = 0;
        var archive = {};


        vm.submitDate = function () { //function to call on form submit
            console.log('vm.title', vm.sel1);
            console.log('vm.week', vm.week);
            var test = moment(vm.week).format('YYYYWW');
            var event_id;
            console.log('test', test);
            archive.week = test;
            archive.type = vm.sel1;
            // $rootScope.archive = archive;
            if(vm.sel1='event'){
                socket.emit('checkevnt', archive.week);
                console.log('checkevnt emited');


            } else{
                $rootScope.archive.person.week = test;
                console.log('person chosen', $rootScope.archive);
                $state.go('person');
            }

        };
        socket.on('checkOK', function (json) {
            console.log('checkOK received');
            var result = JSON.parse(json);
            console.log('checkOK received', result);
            archive.event = result[0].event_id;
            $rootScope.archive = archive;
            // socket.emit('newEventPageLoaded', archive.event);
            console.log('event chosen', $rootScope.archive);
            $state.go('event');
        });
        // socket.on('checkOK', function(json){
        //     var evt = JSON.parse(json);
        //     $scope.globalList = evt;
        //     $scope.edata = evt;
        // });

    }


})();