define([], function () {
    'use strict';

    function SegmentPolicyListService(SegmentPolicyListModel) {
        this.createSegmentPolicyList = createSegmentPolicyList;

        /**
         * Implementation
         */

        /**
         * Creates SegmentPolicyList object and adds methods and returns the object.
         * @returns {Object} SegmentPolicyList object with service methods
         */
        function createSegmentPolicyList () {
            var obj = new SegmentPolicyListModel();

            obj.getSegmentPolicyArray = getSegmentPolicyArray;

            return obj;
        }

        /**
         * Creates flat array of items from Segment Policy list structure
         * @returns {Array}
         */
        function getSegmentPolicyArray() {
            /*jshint validthis:true */
            var result = [],
                self = this;

            self.data.forEach(function(sp) {
                if(sp.data.segment) {
                    sp.data.segment = sp.data.segment.getSegmentArray();
                }

                result.push(sp.data);
            });

            return result;
        }
    }

    SegmentPolicyListService.$inject=['SegmentPolicyListModel'];

    return SegmentPolicyListService;

});
