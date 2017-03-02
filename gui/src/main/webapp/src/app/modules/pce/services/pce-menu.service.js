define([], function () {
    'use strict';

    function PceMenuItemService(PceMenuModel, PceMenuItemModel, Restangular) {

        this.createPceMenu = createPceMenu;
        this.loadMainMenu = loadMainMenu;


        /**
         * Implementations
         */

        /**
         * Creates PceMenu object, fills it with menuData (if available), adds methods and returns the object.
         * @param menuData
         * @returns PceMenuModel
         */
        function createPceMenu (menuData) {
            var result = new PceMenuModel(),
                itemsList = [];

            if(menuData) {
                itemsList = menuData.map(createItem);

                function createItem(dataObj){
                    var newItemObj = new PceMenuItemModel();
                    newItemObj.setData(dataObj);
                    if(dataObj.hasOwnProperty('submenu') && dataObj.submenu.length){
                        newItemObj.setSubMenu(createPceMenu(dataObj.submenu));
                    }
                    return newItemObj;
                }
            }
            result.setItems(itemsList);

            result.pageExists = pageExists;
            result.setActivePage = setActivePage;
            return result;

        }

        function setActivePage(pageName){
            /*jshint validthis:true */
            var self = this;
            var result = false;

            self.items.forEach(setActive);

            function setActive(menuItemObj){
                if(menuItemObj.subMenu === null){
                    menuItemObj.active = menuItemObj.url === '#/pce/' + pageName;
                }
                else{
                    menuItemObj.active = menuItemObj.subMenu.setActivePage(pageName);
                }
                result = result || menuItemObj.active;
            }
            return result;
        }

        function pageExists(pageName){
            /*jshint validthis:true */
            var self = this;
            var result = false;

            self.items.forEach(existingPage);

            function existingPage(menuItemObj){
                if(menuItemObj.subMenu === null){
                    result = result || menuItemObj.url === '#/pce/' + pageName;
                }
                else{
                    result = result || menuItemObj.subMenu.pageExists(pageName);
                }

            }
            return result;

        }

        function loadMainMenu(){
            return Restangular.oneUrl('mainMenu','./app/modules/pce/data/pce-menu.json').get();
        }
    }

    PceMenuItemService.$inject=['PceMenuModel', 'PceMenuItemModel', 'Restangular'];

    return PceMenuItemService;

});
