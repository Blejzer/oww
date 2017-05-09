(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('ArchiveController', ArchiveController);



    ArchiveController.$inject = ['$rootScope', ];

    function ArchiveController ($rootScope) {

        console.log('ArchiveController loaded');

        var vm = this;
        var test = moment(vm.week).format('YYYYWW');
        console.log('test', test);
        vm.bar = 0;


        vm.submitDate = function () { //function to call on form submit
            console.log('vm.title', vm.sel1);
            console.log('vm.week', vm.week);
            var test = moment(vm.week).format('YYYYWW');
            console.log('test', test);


        }

    }


})();