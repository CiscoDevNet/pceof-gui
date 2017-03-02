define([], function () {
    'use strict';

    function PceMenuModel() {
        /**
         * constructor for PceMenu model
         * @constructor
         */
        function PceMenu(){

            this.items = [];

            this.setItems = setItems;
        }

        function setItems(pceMenuItemObjsArr){
            /*jshint validthis:true */
            var self = this;

            self.items = pceMenuItemObjsArr;
        }

        return PceMenu;
    }

    return PceMenuModel;

});
