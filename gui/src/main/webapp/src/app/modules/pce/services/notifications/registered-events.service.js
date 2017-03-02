define([], function () {
	'use strict';

	function RegisteredEventsService(Restangular, UtilsService) {

		this.getRegisteredEvents = getRegisteredEvents;
		this.clearRegisteredEvents = clearRegisteredEvents;
		this.readLocalRegisteredEvents = readLocalRegisteredEvents;
		this.writeLocalRegisteredEvents = writeLocalRegisteredEvents;

		var self = this;

		/**
		 * @param successCbk
		 * @param errorCbk
		 */
		function getRegisteredEvents(successCbk, errorCbk) {

			var restObj = Restangular.one('restconf').one('operations').one('ofl3-statistics:get-notifications');

			restObj.post().then(
				function(data) {
					console.log("RPC registeredEvents", data.output);
					var localRegisteredEvents;
					if(data.output.hasOwnProperty('stats-notification')){
						self.writeLocalRegisteredEvents(data.output['stats-notification']);
					}
					localRegisteredEvents = self.readLocalRegisteredEvents();
					successCbk(localRegisteredEvents);
				},
				function(err){
					var errData = {
						"errCode": "GET_REGISTERED_EVENTS_ERROR",
						"errTitle": "Couldn't get registered events",
						"errMsg": "Couldn't get registered events from controller.",
						"errResolution": "Check if controller is down, otherwise check your connection.",
						"errObj": err
					};
					errorCbk(errData);
				}
			);
		}

		/**
		 * Reads serialized JSON string from local storage, makes it object and returns
		 * @returns {Array} Array of events; empty array if no events
		 */
		function readLocalRegisteredEvents(){
			// TODO: parsing and model binding
			var localRegisteredEvents = window.localStorage.getItem('pceRegisteredEvents');
			//console.log("Local registered events", localRegisteredEvents);
			if(localRegisteredEvents === null){
				self.clearRegisteredEvents();
				return [];
			}
			else{
				return JSON.parse(localRegisteredEvents);
			}
		}

		/**
		 * Loops thru the passed array and adds each element to the local storage
		 * @param newElements {Array}
		 */
		function writeLocalRegisteredEvents(newElements){
			var localRegisteredEvents = self.readLocalRegisteredEvents();
			newElements.forEach(function(element){
				element.fTime = UtilsService.convertISOtoDate(element.time);
				localRegisteredEvents.push(element);
			});
			window.localStorage.setItem('pceRegisteredEvents', JSON.stringify(localRegisteredEvents));
		}

		function clearRegisteredEvents(){
			window.localStorage.setItem('pceRegisteredEvents', JSON.stringify([]));
		}

	}

	RegisteredEventsService.$inject=['Restangular', 'UtilsService'];

	return RegisteredEventsService;

});



