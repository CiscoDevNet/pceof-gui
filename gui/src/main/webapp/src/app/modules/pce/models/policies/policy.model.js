define([], function () {
    'use strict';

    function PolicyModel(PathBundleListService) {
        var self = null;
        /**
         * constructor for Policy model
         * @constructor
         */
        function Policy (){
            self = this;

            this.data = {};
            this.type = 'Prefix';
        }

        Policy.prototype.setData = setData;

        /**
         * Implementations
         */

        /**
         * extends Policy prototype
         * @param policyData
         */
        function setData (policyData){
            /*jshint validthis:true */
            self.data['policy-id'] = policyData['policy-id'];
            self.data.priority = policyData.priority;
            self.data.status = policyData.status;
            self.data['flow-attributes'] = policyData['flow-attributes'];
            self.data['flow-spec'] = policyData['flow-spec'];
            self.data['path-bundle'] = setPathBundleListData(policyData['path-bundle']);

            self.type = getPolicyType();

            function setPathBundleListData(pathBundleListData) {
                var pathBundleList = PathBundleListService.createPathBundleList();

                pathBundleList.setData(pathBundleListData);

                return pathBundleList;
            }

            // TODO: do it nice and good!
            function getPolicyType() {
                if(self.data['path-bundle'] &&
                   self.data['path-bundle'].data[0] &&
                   self.data['path-bundle'].data[0].data.constraints &&
                   self.data['path-bundle'].data[0].data.constraints['segment-policy']) {
                    return 'Segment';
                }
                else if(self.data['path-bundle'] &&
                        self.data['path-bundle'].data[0] &&
                        self.data['path-bundle'].data[0].data.constraints &&
                        self.data['path-bundle'].data[0].data.constraints['element-policy']) {
                    return 'Element';
                }
                else if(self.data['flow-spec'] &&
                        self.data['flow-spec'].source['node-id']) {
                    return 'Tunnel';
                }
                else {
                    return 'Prefix';
                }
            }
        }

        return Policy;
    }

    PolicyModel.$inject=['PathBundleListService'];

    return PolicyModel;

});
