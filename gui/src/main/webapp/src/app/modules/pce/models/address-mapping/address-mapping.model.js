define([], function () {
    'use strict';

    function AddressMappingModel() {
        /**
         * constructor for AddressMapping model
         * @constructor
         */
        function AddressMapping(){
            this.checked=false;
            this.data = {
                'ip-address' : '',
                'timestamp': '',
                'mac-address': '',
                ingress: ''
            };
            this.expirationTime = 0;
            this.expirationCountDown = 0;

            this.setData = setData;

        }

        /**
         * Implementations
         */


        /**
         * Sets Data
         * @param amData
         */
        function setData (amData){
            /*jshint validthis:true */
            var self = this;
            self.data['ip-address'] = amData['ip-address'];
            self.data['timestamp'] = amData['timestamp'];
            self.data['mac-address'] = amData['mac-address'];
            self.data['ingress'] = amData['ingress'];
        }

        return AddressMapping;
    }

    return AddressMappingModel;

});
