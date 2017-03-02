define([], function () {
    'use strict';

    function PathListService(PathListModel) {
        this.createPathList = createPathList;

        /**
         * Implementation
         */

        /**
         * Creates PathList object and adds methods and returns the object.
         * @returns {Object} PathList object with service methods
         */
        function createPathList () {
            var obj = new PathListModel();

            return obj;
        }
    }

    PathListService.$inject=['PathListModel'];

    return PathListService;

});
