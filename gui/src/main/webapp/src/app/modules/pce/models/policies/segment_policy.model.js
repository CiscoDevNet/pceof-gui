define([], function () {
    'use strict';

    function SegmentPolicyModel($filter, SegmentListService) {
        var self = null;
        /**
         * constructor for SegmentPolicy model
         * @constructor
         */
        function SegmentPolicy (){
            self = this;
            this.data = {};
            this.pathBundleId = null;
        }

        SegmentPolicy.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * extends SegmentPolicy prototype
         * @param segmentPolicyData
         */
        function setData (segmentPolicyData, pathBundleId){
            self.data['segment-name'] = segmentPolicyData['segment-name'];
            self.data['segment-type'] = segmentPolicyData['segment-type'];
            self.data['use-override'] = segmentPolicyData['use-override'];
            self.data.segment = setSegmentListData(segmentPolicyData.segment);

            function setSegmentListData(segmentListData) {
                var segmentList = SegmentListService.createSegmentList(),
                    orderedData = $filter('orderBy')(segmentListData, 'order');

                segmentList.setData(orderedData);

                return segmentList;
            }

            self.pathBundleId = pathBundleId;
        }

        return SegmentPolicy;
    }

    SegmentPolicyModel.$inject=['$filter', 'SegmentListService'];

    return SegmentPolicyModel;

});
