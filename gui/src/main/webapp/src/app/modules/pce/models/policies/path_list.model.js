define([], function () {
    'use strict';

    function PathListModel(PathService) {
        /**
         * constructor for PathList model
         * @constructor
         */
        function PathList (){
            this.data = [];
        }

        PathList.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * Fills PathList with data
         * @param PathListData {Array} Array of path bundle items from server
         */
        function setData (PathListData){
            /*jshint validthis:true */
            var self = this;

            PathListData.forEach(function(pathData) {
                self.data.push(PathService.createPath(pathData));
            });
        }

        return PathList;
    }

    PathListModel.$inject=['PathService'];

    return PathListModel;

});
