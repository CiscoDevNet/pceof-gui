define([], function () {
	'use strict';

	function GlobalParametersModel() {
		/**
		 * constructor for Registration model
		 * @constructor
		 */

		var self;

		function GlobalParameters (){
			this.data = {};
			self = this;
		}



		GlobalParameters.prototype.setData = setData;

		/**
		 * Implementations
		 */

		/**
		 * extends GlobalParameters prototype
		 * @param globalParametersData
		 */
		function setData (globalParametersData){
			/*jshint validthis:true */

			for (var property in globalParametersData) {
				if (globalParametersData.hasOwnProperty(property)) {
					self.data[property] = globalParametersData[property];
				}
			}
		}

		return GlobalParameters;
	}

	return GlobalParametersModel;

});
