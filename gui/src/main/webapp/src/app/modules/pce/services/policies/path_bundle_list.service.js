define([], function () {
    'use strict';

    function PathBundleListService(PathBundleListModel) {
        this.createPathBundleList = createPathBundleList;

        /**
         * Implementation
         */

        /**
         * Creates PathBundleList object and adds methods and returns the object.
         * @returns {Object} PathBundleList object with service methods
         */
        function createPathBundleList () {
            var obj = new PathBundleListModel();

            obj.getPathBundleArray = getPathBundleArray;

            return obj;
        }

        function getPathBundleArray() {
            /*jshint validthis:true */
            var result = [],
                self = this;

            self.data.forEach(function(pb) {
                if(pb.data.constraints && pb.data.constraints['element-policy']) {
                    pb.data.constraints['element-policy'] = pb.data.constraints['element-policy'].getElementPolicyArray();
                }

                if(pb.data.constraints && pb.data.constraints['segment-policy']) {
                    pb.data.constraints['segment-policy'] = pb.data.constraints['segment-policy'].getSegmentPolicyArray();
                }

                result.push(pb.data);
            });

            return result;
        }
    }

    PathBundleListService.$inject=['PathBundleListModel'];

    return PathBundleListService;

});
