define([], function () {
    'use strict';

    function HopListService($filter, HopListModel, NetworkService) {
        this.createHopList = createHopList;
        this.getOrderedNodeIds = getOrderedNodeIds;
        this.sortHopsByProperty = sortHopsByProperty;

        /**
         * Implementation
         */

        /**
         * Creates HopList object and adds methods and returns the object.
         * @returns {Object} HopList object with service methods
         */
        function createHopList () {
            var obj = new HopListModel();

            return obj;
        }

        /**
         *
         * @param hopList
		 * @param nodeList
         * @param orderProperty
         * @returns {Array}
         */
        function getOrderedNodeIds(hopList, nodeList, orderProperty) {
            return sortHopsByProperty(hopList, orderProperty).map(function(h) {
               return NetworkService.getNodeByDataPath(nodeList, h.data['node-name']);
            });
        }

        /**
         * Sorts hopList array by 'property' parameter
         * @param hopList
		 * @param property
         * @returns {Array} Array of sorted hop objects
         */
        function sortHopsByProperty(hopList, property) {
            return $filter('orderBy')(hopList, property);
        }
    }

    HopListService.$inject=['$filter', 'HopListModel', 'NetworkService'];

    return HopListService;

});
