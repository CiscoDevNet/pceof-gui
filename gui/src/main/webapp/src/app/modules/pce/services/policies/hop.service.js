define([], function () {
    'use strict';

    function HopService(HopModel) {
        this.createHop = createHop;

        /**
         * Implementation
         */

        /**
         * Creates Hop object, fills it with HopData (if available), adds methods and returns the object.
         * @param HopData {Object} Data for one Hop object
         * @returns {Object} Hop object with service methods
         */
        function createHop (hopData) {
            var obj = new HopModel();

            if(hopData) {
                obj.setData(hopData);
            }

            return obj;
        }
    }

    HopService.$inject=['HopModel'];

    return HopService;

});
