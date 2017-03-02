define([], function () {
    'use strict';

    function PathBundleListModel(PathBundleService) {
        /**
         * constructor for PathBundleList model
         * @constructor
         */
        function PathBundleList (){
            this.data = [];
        }

        PathBundleList.prototype.collapseAll = collapseAll;
        PathBundleList.prototype.expandAll = expandAll;
        PathBundleList.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * Sets expanded property to false on all items in the list
         */
        function collapseAll() {
            /*jshint validthis:true */
            var self = this;

            self.data.forEach(function(pathBundle) {
                pathBundle.collapse();
            });
        }

        /**
         * Sets expanded property to true on all items in the list
         */
        function expandAll() {
            /*jshint validthis:true */
            var self = this;

            self.data.forEach(function(pathBundle) {
                pathBundle.expand();
            });
        }

        /**
         * Fills PathBundleList with data
         * @param pathBundleListData {Array} Array of path bundle items from server
         */
        function setData (pathBundleListData){
            /*jshint validthis:true */
            var self = this;

            if(pathBundleListData) {
                pathBundleListData.forEach(function (pathBundleData) {
                    self.data.push(PathBundleService.createPathBundle(pathBundleData));
                });
            }
        }

        return PathBundleList;
    }

    PathBundleListModel.$inject=['PathBundleService'];

    return PathBundleListModel;

});
