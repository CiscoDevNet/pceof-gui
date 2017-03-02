define([], function () {
    'use strict';

    function SegmentService(SegmentModel) {
        this.createSegment = createSegment;

        /**
         * Implementation
         */

        /**
         * Creates Segment object, fills it with segmentData (if available), adds methods and returns the object.
         * @param segmentData {Object} Data for one Segment object
         * @returns {Object} Segment object with service methods
         */
        function createSegment (segmentData) {
            var obj = new SegmentModel();

            if(segmentData) {
                obj.setData(segmentData);
            }

            return obj;
        }
    }

    SegmentService.$inject=['SegmentModel'];

    return SegmentService;

});
