define(['angular'],
	function (angular) {
		"use strict";

		angular
            .module('app.filters', [])
            .filter('isNum', function(){
                return function(val, max){
                    return !isNaN(val) ? val > max ? max : val : 1;
                };
            });



    }
);
