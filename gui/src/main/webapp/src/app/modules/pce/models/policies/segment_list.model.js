define([], function () {
    'use strict';

    function SegmentListModel(SegmentService) {
        var self = null;
        /**
         * constructor for SegmentList model
         * @constructor
         */
        function SegmentList (){
            self = this;
            this.data = [];
        }

        SegmentList.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * Fills SegmentList with data
         * @param segmentListData {Array} Array of Segment items from server
         */
        function setData (segmentListData){
            segmentListData && segmentListData.forEach(function(segmentData) {
                self.data.push(SegmentService.createSegment(segmentData));
            });
        }

        return SegmentList;
    }

    SegmentListModel.$inject=['SegmentService'];

    return SegmentListModel;

});
