define([], function () {
    'use strict';

    function SegmentPolicyListModel(SegmentPolicyService) {
        var self = null;
        /**
         * constructor for SegmentPolicyList model
         * @constructor
         */
        function SegmentPolicyList (){
            self = this;
            this.data = [];
        }

        SegmentPolicyList.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * Fills SegmentPolicyList with data
         * @param SegmentPolicyListData {Array} Array of Segment Policy items from server
         */
        function setData (SegmentPolicyListData, pathBundleId){
            SegmentPolicyListData.forEach(function(segmentPolicyData) {
                self.data.push(SegmentPolicyService.createSegmentPolicy(segmentPolicyData, pathBundleId));
            });
        }

        return SegmentPolicyList;
    }

    SegmentPolicyListModel.$inject=['SegmentPolicyService'];

    return SegmentPolicyListModel;

});
