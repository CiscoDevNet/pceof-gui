define([], function () {
    'use strict';

    function PceMenuItemModel() {
        /**
         * constructor for PceMenu model
         * @constructor
         */
        function PceMenuItem(){
            this.active = false;
            this.caption = '';
            this.icon = '';
            this.url = '';
            this.subMenu = null;

            this.setData = setData;
            this.setSubMenu = setSubMenu;
        }

        function setData(menuData){
            /*jshint validthis:true */
            var self = this;

            self.active = menuData.active ? menuData.active : false;
            self.caption = menuData.caption ? menuData.caption : '';
            self.icon = menuData.icon ? menuData.icon : '';
            self.url = menuData.url ? menuData.url : '';
        }

        function setSubMenu(subMenu){
            /*jshint validthis:true */
            var self = this;

            self.subMenu = subMenu;
        }

        return PceMenuItem;
    }

    return PceMenuItemModel;

});
