define([], function () {
    'use strict';

    function SegmentModel() {
        var self = null;
        /**
         * constructor for Segment model
         * @constructor
         */
        function Segment (){
            self = this;

            this.data = {};
        }

        Segment.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * extends Segment prototype
         * @param segmentData
         */
        function setData (segmentData){
            self.data.order = segmentData.order;
            self.data.id = segmentData.id;
            self.data['element-type'] = segmentData['element-type'];
        }

        return Segment;
    }

    SegmentModel.$inject=[];

    return SegmentModel;

});
