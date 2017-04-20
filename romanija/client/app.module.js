(function () {
    "use strict";

    /**
     * oneWordWorld module that includes router, file upload
     * ngCookies and btford.socket-io modules
     * Look for the included files in their respective folders.
     */
    angular.module('authServer', ['fileUpload', 'angularMoment'])
        .controller('MyCtrl', ['Upload', '$window', '$scope', 'moment', function (Upload, $window, $scope, moment) {
            var vm = this;
            vm.bar = 0;


            vm.uploadEvent = function (file, title, week) {
                Upload.upload({
                    url: '/event', //webAPI exposed to upload the file
                    data: {file: file, title: title, week: week} //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
                    if (resp.data.error_code === 0) { //validate success
                        $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.err_desc);
                        $window.location='main';
                    } else {
                        $window.alert('an error occured' + resp.data.error_code + resp.data.err_desc);
                        console.log('resp ', resp);
                    }
                }, function (resp) { //catch error
                    // console.log('Error status: ' + resp.status);
                    $window.alert('Error status: ' + resp.status);
                }, function (evt) {
                    console.log('evt ', evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                    vm.bar = progressPercentage; // capture upload progress
                });
            };

            vm.uploadPerson = function (file, title, week) {
                Upload.upload({
                    url: '/person', //webAPI exposed to upload the file
                    data: {file: file, title: title, week: week} //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
                    if (resp.data.error_code === 0) { //validate success
                        $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: '+ resp.data.err_desc);
                        $window.location='main';
                    } else {
                        $window.alert('an error occured', resp.data.error_code);
                        console.log('resp ', resp);
                    }
                }, function (resp) { //catch error
                    // console.log('Error status: ' + resp.status);
                    $window.alert('Error status: ' + resp.status);
                }, function (evt) {
                    console.log('evt ', evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                });
            };


            vm.submitEvent = function () { //function to call on form submit
                console.log('vm.title', vm.title);
                console.log('vm.week', vm.week);
                console.log('vm.upload_form.title', vm.upload_form.title.$valid);
                var test = moment(vm.week).format('YYYYWW');
                console.log('test', test);

                if (vm.upload_form.file.$valid && vm.file && vm.upload_form.title.$valid) { //check if from is valid
                    console.log('valid file');
                    vm.uploadEvent(vm.file, vm.title, test); //call upload function
                }
            }
            vm.submitPerson = function () { //function to call on form submit
                console.log('vm.title', vm.title);
                console.log('vm.upload_form.title', vm.upload_form.title.$valid);
                var test = moment(vm.week).format('YYYYWW');
                console.log('vm.week', test);

                if (vm.upload_form.file.$valid && vm.file && vm.upload_form.title.$valid) { //check if from is valid
                    console.log('valid file');
                    vm.uploadPerson(vm.file, vm.title, test); //call upload function
                }
            }
        }]);

})();