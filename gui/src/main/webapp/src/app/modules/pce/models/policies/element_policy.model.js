define([], function () {
    'use strict';

    function ElementPolicyModel() {
        var self = null;
        /**
         * constructor for ElementPolicy model
         * @constructor
         */
        function ElementPolicy (){
            self = this;
            this.data = {};
            this.pathBundleId = null;
        }

        ElementPolicy.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * extends ElementPolicy prototype
         * @param elementPolicyData
         */
        function setData (elementPolicyData, pathBundleId){
            self.data.id = elementPolicyData.id;
            self.data['element-type'] = elementPolicyData['element-type'];
            self.data['use-override'] = elementPolicyData['use-override'];

            self.pathBundleId = pathBundleId;
        }

        return ElementPolicy;
    }

    ElementPolicyModel.$inject=[];

    return ElementPolicyModel;

});
