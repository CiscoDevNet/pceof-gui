define([], function () {
    'use strict';

    function PathBundleService(PathBundleModel) {
        this.createPathBundle = createPathBundle;


        /**
         * Implementation
         */

        /**
         * Creates PathBundle object, fills it with pathBundleData (if available), adds methods and returns the object.
         * @param pathBundleData {Object} Data for one PathBundle object
         * @returns {Object} PathBundle object with service methods
         */
        function createPathBundle (pathBundleData) {
            var obj = new PathBundleModel();

            if(pathBundleData) {
                obj.setData(pathBundleData);
            }

            return obj;
        }
    }

    PathBundleService.$inject=['PathBundleModel'];

    return PathBundleService;

});
