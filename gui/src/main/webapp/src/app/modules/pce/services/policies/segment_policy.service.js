define([], function () {
    'use strict';

    function SegmentPolicyService(SegmentPolicyModel) {
        this.createSegmentPolicy = createSegmentPolicy;

        /**
         * Implementation
         */

        /**
         * Creates SegmentPolicy object, fills it with SegmentPolicyData (if available), adds methods and returns the object.
         * @param segmentPolicyData {Object} Data for one SegmentPolicy object
         * @returns {Object} SegmentPolicy object with service methods
         */
        function createSegmentPolicy (segmentPolicyData, pathBundleId) {
            var obj = new SegmentPolicyModel();

            if(segmentPolicyData) {
                obj.setData(segmentPolicyData, pathBundleId);
            }

            return obj;
        }
    }

    SegmentPolicyService.$inject=['SegmentPolicyModel'];

    return SegmentPolicyService;

});
