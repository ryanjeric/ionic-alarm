// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
/*angular.module('starter', ['ionic']).run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})*/
var app = angular.module('todo', ['ionic', 'ionic-timepicker', 'angularMoment'])
app.config(function(ionicTimePickerProvider) {
    var timePickerObj = {
        inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
        format: 12,
        step: 15,
        setLabel: 'Set',
        closeLabel: 'Close'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);
});
app.controller('TodoCtrl', function($scope, $ionicModal, $filter, $interval, $ionicPopup, ionicTimePicker, moment) {
    $scope.alarms = [];
    $scope.alarm = {};
    $ionicModal.fromTemplateUrl('add-alarm.html', function(modal) {
        $scope.setalarm = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });
    $scope.newalarm = function() {
        $scope.setalarm.show(); //-----> open our modal
    };
    $scope.closesetalarm = function() {
        $scope.setalarm.hide(); // -----> Close our modal
    };
    console.log(localStorage);
    $scope.createalarm = function(alarm) {
        var time = alarm.hour + ":" + alarm.min + " " + alarm.pos; // 12:00 PM Input to this format
        $scope.alarms.push({
            time: time,
            on: true
        });
        localStorage.setItem('alarms', JSON.stringify($scope.alarms)); //store alarms in localstorage as key alarms
        $scope.alarm = {}; // once saved the given data empty the form
        $scope.setalarm.hide(); //close the modal
    };
    $scope.offalarm = function(index) {
        if (index !== -1) {
            if ($scope.alarms[index].on) {
                $scope.alarms[index].on = true;
            } //turn on alarm
            else {
                $scope.alarms[index].on = false;
            } //turn off alarm
        }
        localStorage.setItem('alarms', JSON.stringify($scope.alarms)); //once change made save that in localstorage
    };
    $scope.removealarm = function(index) {
        $scope.alarms.splice(index, 1); //Delete the index object from the array
        localStorage.setItem('alarms', JSON.stringify($scope.alarms)); // we made a change we need to save it in localstorage
    };
    $scope.getalarms = function() {
        $scope.alarms = (localStorage.getItem('alarms') !== null) ? JSON.parse(localStorage.getItem('alarms')) : []; //retrieve form localstorage
        $scope.Time = $filter('date')(new Date(), 'hh:mm a'); //take the current time from machine
        $interval(function() {
            $scope.alarmcheck(); //Check any alarm now once a minute
        }, 1000);
        $interval(function() {
            $scope.Time = $filter('date')(new Date(), 'hh:mm a'); //Check current time one minute once
        }, 1000);
    };
    $scope.alarmcheck = function() {
        var input = $scope.alarms,
            time = $scope.Time; //Take object of arrays and time in local variable 
        var i = 0,
            len = input.length;
        for (; i < len; i++) {
            if (input[i].time.trim() == time.trim() && input[i].on) { //Check there's a alarm for now and it's in on 
                $ionicPopup.alert({
                    title: 'Alarm',
                    template: 'Wake up' // If it is there open popup to display
                });
            } else {
                console.log(time);
            }
        }
    };
    var ipObj1 = {
        callback: function(val) { //Mandatory
            if (typeof(val) === 'undefined') {
                console.log('Time not selected');
            } else {
                var selectedTime = new Date(val * 1000);
                console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
                var timez = moment('2017-01-01 ' + (selectedTime.getUTCHours().length==1 ? '0'+selectedTime.getUTCHours():selectedTime.getUTCHours()) + ':' + (selectedTime.getUTCMinutes() == 0 ? '00' : selectedTime.getUTCMinutes()) + ':00').format("hh:mm A");
                console.log("timez", timez);
                $scope.alarms.push({
                    time: timez,
                    on: true
                });
                localStorage.setItem('alarms', JSON.stringify($scope.alarms)); //store alarms in localstorage as key alarms
            }
        },
        inputTime: 50400, //Optional
        format: 12, //Optional
        step: 1, //Optional
        setLabel: 'Set2' //Optional
    };
    $scope.newalarm2 = function() {
        ionicTimePicker.openTimePicker(ipObj1);
    }
});