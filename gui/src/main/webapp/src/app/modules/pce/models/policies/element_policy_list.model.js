define([], function () {
    'use strict';

    function ElementPolicyListModel(ElementPolicyService) {
        var self = null;
        /**
         * constructor for ElementPolicyList model
         * @constructor
         */
        function ElementPolicyList (){
            self = this;
            this.data = [];
        }

        ElementPolicyList.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * Fills ElementPolicyList with data
         * @param elementPolicyListData {Array} Array of Element Policy items from server
         */
        function setData (elementPolicyListData, pathBundleId){
            elementPolicyListData.forEach(function(elementPolicyData) {
                self.data.push(ElementPolicyService.createElementPolicy(elementPolicyData, pathBundleId));
            });
        }

        return ElementPolicyList;
    }

    ElementPolicyListModel.$inject=['ElementPolicyService'];

    return ElementPolicyListModel;

});
