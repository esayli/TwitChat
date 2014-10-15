'use strict';

angular.module('twitChatApp')
    .controller('MainCtrl', function ($scope,$timeout) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        // Build the date object
        $scope.date = {};

        // Update function
        var updateTime = function() {
            $scope.date.raw = new Date();
            $timeout(updateTime, 1000);
        };

        // Kick off the update function
        updateTime();


    });
