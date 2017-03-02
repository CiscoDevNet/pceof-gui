define([''], function () {

    'use strict';
    /**
     * Controller for address mappings
     *
     * @param $scope
     * @constructor
     */
    function AddressMappingsCtrl($scope, $filter, $q, AddressMappingsListService, ConfigurationService) {

        $scope.addressMappingsList = null;
        $scope.checkedMappingsCount = 0;
        $scope.checkAllStatus = {
            checked: false,
            indeterminate: false
        }

        $scope.refreshTable = refreshTable;
        $scope.renewChecked = renewChecked;
        $scope.removeMappingsFilter = removeMappingsFilter;
        $scope.setCheckedMappingsCount = setCheckedMappingsCount;
        $scope.toggleAddressMapping = toggleAddressMapping;
        $scope.toggleAll = toggleAll;

        $scope.mappingsFilter = {
            options: {
                debounce: 500
            },
            show : false
        };

        $scope.mappingsTableQuery = {
            order: "data['ip-address']",
            limit: 25,
            page: 1,
            options: [25, 50, 100],
            filter: ''
        };

        init();

        /**
         * Declarations
         */

        function removeMappingsFilter(){
            $scope.mappingsFilter.show = false;
            $scope.mappingsTableQuery.filter = '';

            if($scope.mappingsFilter.form.$dirty) {
                $scope.mappingsFilter.form.$setPristine();
            }

            setCheckedMappingsCount();
        }

        function renewChecked(){
            $scope.showProgressBar();
            $scope.addressMappingsList.renewCheckedMappings().then(function(){
                refreshTable();
                setCheckedMappingsCount();
            });
        }

        function refreshTable(){
            $scope.showProgressBar();
            loadAddressMappingsList().then(function(){
                $scope.hideProgressBar();
                setCheckedMappingsCount();
            });
        }

        function toggleAll(){
            $scope.addressMappingsList.toggleAllAms($scope.mappingsTableQuery.filter, !$scope.checkAllStatus.checked);
            setCheckedMappingsCount();
        }

        function setCheckedMappingsCount(){
            $scope.checkAllStatus = $scope.addressMappingsList.allChecked($scope.mappingsTableQuery.filter);
        }

        function toggleAddressMapping(addressMappingObj){
            $scope.addressMappingsList.toggleAmChecked(addressMappingObj);
            setCheckedMappingsCount();
        }


        function loadAddressMappingsList(){
            var pl = [],
                timeout = 0;

            pl.push($scope.addressMappingsList.getAddressMappingsList());
            pl.push(ConfigurationService.getNeighbourDiscovery('nd', getNDSccs, getNDErr));

            function getNDSccs(data){
                timeout = data['trigger-active-discovery-timeout-millis'];
            }

            function getNDErr(){
                timeout = 60000;
            }

            return $q.all(pl).then(function(){
                $scope.addressMappingsList.setExpirationTimes(timeout);
            });

        }

        function init(){
            $scope.addressMappingsList = AddressMappingsListService.createAddressMappingsList();
            loadAddressMappingsList();
        }

    }

    AddressMappingsCtrl.$inject = ['$scope', '$filter', '$q', 'AddressMappingsListService', 'ConfigurationService'];

    return AddressMappingsCtrl;
});
