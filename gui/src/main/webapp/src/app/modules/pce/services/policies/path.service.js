define([], function () {
    'use strict';

    function PathService(HopListService, PathModel) {
        this.createPath = createPath;
        this.getPathNameFromHops = getPathNameFromHops;

        /**
         * Implementation
         */

        /**
         * Creates Path object, fills it with PathData (if available), adds methods and returns the object.
         * @param PathData {Object} Data for one Path object
         * @returns {Object} Path object with service methods
         */
        function createPath (PathData) {
            var obj = new PathModel();

            if(PathData) {
                obj.setData(PathData);
            }

            return obj;
        }

        /**
         * Takes list of hops from path objects, sorts them by 'order' property, takes first and last object
         * and creates descriptive name from it
         * @param pathData data from path object
         * @returns {string} descriptive path name
         */
        function getPathNameFromHops(pathData) {
            var sortedHops = HopListService.sortHopsByProperty(pathData.hop.data, 'data.order');

            return sortedHops[0].data['node-name'] + ' -> ' + sortedHops[sortedHops.length-1].data['node-name'];
        }
    }

    PathService.$inject=['HopListService', 'PathModel'];

    return PathService;

});
