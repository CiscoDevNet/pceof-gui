define([], function () {
    'use strict';
    // todo: error handling
    function AddressMappingService($interval, AddressMappingModel, Restangular) {

        this.createAddressMapping = createAddressMapping;

        /**
         * Implementations
         */

        /**
         * Creates AddressMapping object, fills it with amData (if available), adds methods and returns the object.
         * @param amData {Object} Data for one AddressMapping object
         * @returns {Object} BGPRoute object with service methods
         */
        function createAddressMapping (amData) {
            var obj = new AddressMappingModel();

            if(amData) {
                obj.setData(amData);
            }

            obj.setExpirationTime = setExpirationTime;
            obj.toggleChecked = toggleChecked;
            obj.renew = renew;


            return obj;
        }

        function toggleChecked(){
            /*jshint validthis:true */
            var self = this;

            self.checked = !self.checked;
        }

        function setExpirationTime(timeout){
            /*jshint validthis:true */
            var self = this;
            var interval = 1000;

            self.expirationTime = Date.parse(self.data.timestamp) + timeout;

            self.expirationCountDown = Date.parse(self.data.timestamp) + timeout - Date.now();

            var int = $interval(function(){
                self.expirationCountDown = Date.parse(self.data.timestamp) + timeout - Date.now();
            }, interval);
        }

        function getIngressTpId(ingress){
            var searchFor = "opendaylight-inventory:node-connector[opendaylight-inventory:id=",
                pos = 0,
                result = '';

            pos = ingress.indexOf(searchFor);

            if(pos !== -1){
                result = ingress.substring(pos+searchFor.length+1);
                result = result.substring(0, result.length-2);
            }

            return result;
        }

        function renew(){
            /*jshint validthis:true */
            var self = this;

            if(self.data['ip-address'] && self.data.ingress){
                var ingressTpId = getIngressTpId(self.data.ingress),
                    restObj = Restangular.one('restconf').one('operations').one('nd:active-mac-discovery'),
                    dataObj = {
                        input: {
                            'ip-address' : self.data['ip-address'],
                            'ingress-tp-id' : ingressTpId,
                        }
                    };

                return restObj.post('input', dataObj);
            }
        }
    }

    AddressMappingService.$inject=['$interval', 'AddressMappingModel', 'Restangular'];

    return AddressMappingService;

});
