define([], function () {
    'use strict';

    function PolicyListModel(PolicyService) {
        /**
         * constructor for PolicyList model
         * @constructor
         */
        function PolicyList (){
            this.data = [];
        }

        PolicyList.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * Fills PolicyList with data
         * @param policyListData {Array} Array of policy items from server
         */
        function setData (policyListData){
            /*jshint validthis:true */
            var self = this;

            policyListData.forEach(function(policyData) {
                self.data.push(PolicyService.createPolicy(policyData));
            });
        }

        return PolicyList;
    }

    PolicyListModel.$inject=['PolicyService'];

    return PolicyListModel;

});