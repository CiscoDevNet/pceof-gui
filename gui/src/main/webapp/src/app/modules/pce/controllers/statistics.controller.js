define([], function () {
    'use strict';

    StatisticsCtrl.$inject=['$scope', 'StatisticsService', '$filter', '$mdDialog', '$location'];

    function StatisticsCtrl($scope, StatisticsService, $filter, $mdDialog, $location) {

        var rawData = null,
            dialogShown = false;

        $scope.firstLoading = true;

        $scope.statsConfig = null;
        $scope.devicesList = {};
        $scope.selectedStatistics = {
            main: null,
            sub: null
        };

        //general table data prop
        $scope.table = {
            columns: null,
            vColumns: null,
            data: null,
            vData: null
        };

        //summary table data prop for link statstics
        $scope.sTable = {
            columns: null,
            data: null,
            vData: null
        };

        $scope.filter = {
            options: {
                debounce: 500
            },
            show : false
        };

        $scope.query = {
            order: 'order',
            limit: 10,
            page: 1,
            filter: ''
        };

        $scope.options = {
            boundaryLinks: true,
            pageSelector: true,
            rowSelection: true,
            autoSelect: false
        };

        $scope.sType = null;

        // links statistics params
        $scope.linkStatisticsRegistrations = [];
        $scope.linkStatisticsSetup = {};

        // methods
        $scope.checkTopologyData = checkTopologyData;
        $scope.init = init;
        $scope.loadDevicesData = loadDevicesData;
        $scope.loadLinksParams = loadLinksParams;
        $scope.openDialog = openDialog;
        $scope.removeFilter = removeFilter;
        $scope.updateGeneralStats = updateGeneralStats;
        $scope.updateLinkStats = updateLinkStats;
        $scope.updateStatistics = updateStatistics;
        $scope.updateTableStatistics = updateTableStatistics;
        $scope.validateLsWindow = validateLsWindow;

        $scope.init();

        /**
         * Initialization
         */
        function init() {
            $scope.showProgressBar();

            StatisticsService.getStatisticsConfig(function (config) {
                $scope.statsConfig = config;
                $scope.linkStatisticsSetup = config.linkStatsConfig.setup;
                //console.info('INFO :: statistics config -> ', $scope.statsConfig);

                $scope.checkTopologyData(function () {
                    $scope.loadDevicesData();
                });

                $scope.loadLinksParams();
            });
        }

        /**
         * Utils - Dialog win if link statistics not found
         */
        function openDialog() {

            if ( !dialogShown ) {
                dialogShown = true;

                var confirm = $mdDialog.confirm()
                    .title('Warning')
                    .textContent('No link statistics data found.')
                    .ok('Create registration')
                    .cancel('Ok');
                $mdDialog.show(confirm).then(function() {
                    $location.path('/pce/notifications');
                    dialogShown = false;
                }, function() {
                    dialogShown = false;
                    $scope.hideProgressBar();
                });
            }
        }

        /**
         * Main - Load statistics data
         */
        function loadDevicesData() {

            StatisticsService.getDevices($scope.topologyData.nodes,
                function(devices, data){
                    console.info('INFO :: devices obj - ', devices);
                    //console.info('INFO :: raw data - ', data);
                    rawData = data;
                    $scope.devicesList = devices;
                    StatisticsService.updateDeviceNames(rawData, $scope.devicesList);
                    $scope.hideProgressBar();
                    $scope.firstLoading = false;
                },
                function() {
                    $scope.hideProgressBar();
                    $scope.firstLoading = false;
                    console.warn('ERROR :: cannot get devices info from controller');
                }
            );
        }

        /**
         * General method for setting statistics
         */
        function updateGeneralStats(){

            if ( $scope.selectedStatistics.main.subFunct ){

                $scope.table.data = StatisticsService.updateDataValue(StatisticsService[$scope.selectedStatistics.main.subFunct](rawData ? rawData : [], $scope.selectedStatistics.main));
                $scope.table.columns = StatisticsService.getTableColumns($scope.table.data);
                updateStatisticsData();

                //console.info('INFO :: $scope.table.data - ',$scope.table.data);
                //console.log('$scope.table.vData',$scope.table.vData);
                //console.log('$scope.table.columns', $scope.table.columns);
            }
        }

        /**
         * Table statistics - general method for updating
         */
        function updateTableStatistics(){
            var tableStatsData = StatisticsService.tableStatisticsByNodes(rawData ? rawData : []);
            //console.info('INFO :: table statistics raw data - ', tableStatsData);

            if ( $scope.selectedStatistics.sub ) {

                $scope.table.data = StatisticsService.updateDataValue(StatisticsService[$scope.selectedStatistics.sub.funct](tableStatsData));
                $scope.table.columns = StatisticsService.getTableColumns($scope.table.data);
                updateStatisticsData();

                //console.info('INFO :: $scope.table.data - ',$scope.table.data);
                //console.log('$scope.table.vData',$scope.table.vData);
                //console.log('$scope.table.columns', $scope.table.columns);
            }
        }

        /**
         * Links statistics - general method for setting link statistics
         */
        function updateLinkStats() {
            $scope.showProgressBar();

            if ($scope.linkStatisticsSetup['registration-id']) {

                StatisticsService.getLinkStatistics($scope.linkStatisticsSetup,
                    function (data) {
                        //console.info('INFO :: links statistics data - ', data);
                        clearTableData();

                        if (data.samples.length) {
                            $scope.table.columns = StatisticsService.getTableColumns(data.samples);
                            $scope.table.data = data.samples;
                            $scope.table.vData = StatisticsService.concatTableData(data.samples);
                        }

                        if (data.summary.length) {
                            $scope.sTable.columns = StatisticsService.getTableColumns(data.summary);
                            $scope.sTable.data = data.summary;
                            $scope.sTable.vData = StatisticsService.concatTableData(data.summary);
                        }

                        $scope.hideProgressBar();

                    },
                    function () {
                        console.warn('WARNING :: getting link statistics error');
                        $scope.hideProgressBar();
                    }
                );
            } else {
                $scope.openDialog();
            }
        }

        /**
         * Link statistics - load necessary data
         */
        function loadLinksParams() {
            StatisticsService.getRegistrations(
                function(data) {
                    $scope.linkStatisticsRegistrations = data;

                    if ( data && data.length ){
                        $scope.linkStatisticsSetup['registration-id'] = data[0];
                    }

                    $scope.selectedStatistics.main = $scope.statsConfig.list[0];
                    $scope.hideProgressBar();

                },
                function() {
                    console.warn('WARNING :: error or no registration data found');
                    $scope.selectedStatistics.main = $scope.statsConfig.list[0];
                    $scope.hideProgressBar();
                    $scope.openDialog();
                }
            );
        }

        /**
         * Main - General method for calling different statistics methods
         */
        function updateStatistics(){
            //console.info('INFO :: selected statistics - ', $scope.selectedStatistics);
            if ( $scope.selectedStatistics.main ) {
                $scope[$scope.selectedStatistics.main.funct]();
            }
        }

        /**
         * Utils - Remove table filter function
         */
        function removeFilter() {
            $scope.filter.show = false;
            $scope.query.filter = '';

            if($scope.filter.form.$dirty) {
                $scope.filter.form.$setPristine();
            }
        }

        /**
         * Utils - Check if topology data
         * @param successCbk
         */
        function checkTopologyData(successCbk) {
            if ( !$scope.topologyLoaded ) {
                $scope.loadTopologyData(successCbk);
            } else {
                successCbk();
            }
        }

        /**
         * Links statistics - utils - validate window property
         */
        function validateLsWindow() {
            $scope.linkStatisticsSetup.window = $filter('isNum')(parseInt($scope.linkStatisticsSetup.window),120);
            $scope.updateLinkStats();
        }

        /**
         * Watcher for selected statistics
         */
        $scope.$watch('selectedStatistics.main', function (newVal, oldVal) {
            clearTableData();
            $scope.updateStatistics();
            $scope.sType = newVal ? newVal.template : null;

            // set substatistics to first one
            if ( newVal && newVal.subStatistics ) {
                $scope.selectedStatistics.sub = newVal.subStatistics[0];
            }
        });

        /**
         * Watcher for selected sub statistics
         */
        $scope.$watch('selectedStatistics.sub', function () {
            $scope.updateStatistics();
        });

        /**
         * Watcher on selected device list
         */
        $scope.$watch('selectedDL', function(newValue, oldValue){
            if ( $scope.table.data && (newValue.length !== oldValue.length) ) {
                //console.warn('selectedDL');
                reloadDataByDevice();
            }
        });

        /**
         * Utils - reload data by selected devices
         */
        function reloadDataByDevice() {
            var fData = StatisticsService.getStatisticsDataByDevice($scope.selectedDL, $scope.table.data);
            $scope.table.vData = StatisticsService.concatTableData(fData);
            //console.log('fData $scope.table.vData', fData, $scope.table.vData);
        }

        /**
         * Utils - execute custom functionality by statistics type
         */
        function updateStatisticsData(){
            var sType = $scope.selectedStatistics.main.type.toLowerCase(),
                custFunc = {
                    'port': function () {
                        StatisticsService.updateTpId($scope.table.data, $scope.terminationPointsData);
                    }
                };

            reloadDataByDevice();

            if ( custFunc[sType] ){
                custFunc[sType]();
            }
        }

        /**
         * Utils - method for clearing table data
         */
        function clearTableData(){
            $scope.table.columns = null;
            $scope.table.vColumns = null;
            $scope.table.data = null;
            $scope.table.vData = null;

            $scope.sTable.columns = null;
            $scope.sTable.data = null;
            $scope.sTable.vData = null;
        }
    }


    return StatisticsCtrl;
});
