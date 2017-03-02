define([], function () {
    'use strict';

    function UtilsService($filter) {
        this.findObjInArray = findObjInArray;
		this.convertISOtoDate = convertISOtoDate;

        /**
         * Base filtering helper function
         * @param array
         * @param expression
         * @param property
         * @param all
         * @returns {*}
         */
        function findObjInArray(array, expression, property, all) {
            var result = $filter('filter')(array, expression);
            return result.length ? all ? result : property ? result[0][property] : result[0] : null;
        }

		/**
		 * Converts ISO 8601 to an object with props: year, month, day, hours, minutes, seconds
		 * @param dateString {String} Date and time in ISO 8601 format
		 */
		function convertISOtoDate(dateString){

			var date = new Date(dateString);
			var fDate = {
				'year': date.getUTCFullYear(),
				'month': (date.getUTCMonth() + 1),
				'day': date.getUTCDay(),
				'hours': date.getUTCHours(),
				'minutes': date.getUTCMinutes(),
				'seconds': date.getUTCSeconds()
			};

			return fDate;
		}

    }

    UtilsService.$inject=['$filter'];

    return UtilsService;

});
