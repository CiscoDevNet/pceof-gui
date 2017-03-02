define([], function () {
    'use strict';

    function PathModel(HopListService) {
        /**
         * constructor for Path model
         * @constructor
         */
        function Path (){
            this.data = {};
        }

        Path.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * extends Path prototype
         * @param pathData
         */
        function setData (pathData){
            /*jshint validthis:true */
            this.data['path-name'] = pathData['path-name'];
            this.data.status = pathData.status;
            this.data.hop = setHopListData(pathData.hop);

            function setHopListData(hopListData) {
                var hopList = HopListService.createHopList();

                hopList.setData(hopListData);

                return hopList;
            }
        }

        return Path;
    }

    PathModel.$inject=['HopListService'];

    return PathModel;

});
