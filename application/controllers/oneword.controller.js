(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('OwwController', OwwController);

    OwwController.$inject = ['$rootScope', '$scope', '$location', '$window'];
    function OwwController($rootScope, $scope, $location, $window) {
        $scope.ewords = [];
        $scope.pwords = [];
        $rootScope.$on('$viewContentLoaded', function (event) {
            $window.ga('send', 'pageview', {page: $location.url()});
        });

        var socket = io.connect();

        function ChangeChannel(newroom) {
            socket.on('changeChannel', newroom);
        }

        socket.on('newconn', function (num) {
            $scope.users = num;
            // $('#users').text(num);
        });

        socket.on('eventWord', function (evt) {
            // $scope.ewords.push(evt);
            // $('#events').prepend($('<li>').text(evt));
        });

        $scope.submitEword = function () {
            $scope.ewords.push(this.e);
            socket.emit('event', 'event', this.e);
            this.e = '';
            return false;
        }

        // socket.on('eventList', function(json){
        //     console.log(json);
        //     // da bi dobili ponovo objekat iz stringa
        //     var evt = JSON.parse(json);
        //     console.log(evt);
        //     $('#eventList').children().remove();
        //     var tr;
        //     for (var i = 0; i < evt.length; i++) {
        //         tr = $('<tr/>');
        //         tr.append("<td> " + evt[i].a + "</td>");
        //         tr.append("<td>&nbsp</td>");
        //         tr.append('<td class="text-right"> ' + ' ' +evt[i].c + "</td>");
        //         $('#eventList').append(tr);
        //     }
        // });


    }
})();


// $('#formPerson').submit(null, function(){
//   console.log("Person");
//   socket.emit('person', 'person', $('#p').val());
//   $('#p').val('');
//   return false;
// });
// socket.on('eventWord', function(evt){
//     $('#events').prepend($('<li>').text(evt));
//
// });

//
// socket.on('personWord', function(prs){
//   $('#persons').prepend($('<li>').text(prs));
// });
// socket.on('personList', function(json){
//   // da bi dobili ponovo objekat iz stringa
//   var evt = JSON.parse(json);
//   $('#personList').children().remove();
//   var tr;
//     for (var i = 0; i < evt.length; i++) {
//         tr = $('<tr/>');
//         tr.append("<td> " + evt[i].a + "</td>");
//         tr.append("<td>&nbsp</td>");
//         tr.append('<td class="text-right"> ' + ' ' +evt[i].c + "</td>");
//         $('#personList').append(tr);
//     }
// });
