define(['lodash'], function () {
    'use strict';

    StatisticsService.$inject=['Restangular', 'NetworkService'];

    /**
     * Service to handle network object
     */
    function StatisticsService(Restangular, NetworkService) {

        var service = {
            concatTableData:concatTableData,
            generalStatisticsByNodes: generalStatisticsByNodes,
            getAggregateFlowStatistics: getAggregateFlowStatistics,
            getDevices: getDevices,
            getFlowStatistics: getFlowStatistics,
            getFlowTableStatistics: getFlowTableStatistics,
            getGroupMeterStatistics: getGroupMeterStatistics,
            getLinkStatistics: getLinkStatistics,
            getRegistrations: getRegistrations,
            getStatisticsConfig: getStatisticsConfig,
            getStatisticsDataByDevice: getStatisticsDataByDevice,
            getTableColumns: getTableColumns,
            portStatisticsByNode: portStatisticsByNode,
            queueStatisticsByNode: queueStatisticsByNode,
            tableStatisticsByNodes: tableStatisticsByNodes,
            tableStatisticsByNode: tableStatisticsByNode,
            updateDataValue: updateDataValue,
            updateDeviceNames: updateDeviceNames,
            updateTpId: updateTpId
        };

        return service;

        /**
         * Utils - Service for filtering table data by selected devices
         * @param devices
         * @param data
         * @returns {*}
         */
        function getStatisticsDataByDevice(devices, data){
            var getDevArray = function(){
                    return devices.map(function (dev) {
                       return dev.label ? dev.label : dev.id;
                    });
                },
                devList = getDevArray();

            return data.filter(function(item){
                return devList.indexOf(item.device) !== -1;
            });
        }

        /**
         * Utils - Service for getting all device data into one array
         * @param data
         * @returns {Array}
         */
        function concatTableData(data){
            var tableData = [];
            data.forEach(function (dev) {
                if (dev['stats-array']){
                    dev['stats-array'].forEach(function (stat) {
                        tableData.push(stat);
                    });
                }
            });

            return tableData;
        }

        /**
         * Utils - Service for getting table columns from available properties
         * @param data
         * @returns {Array}
         */
        function getTableColumns(data){
            var columns = [];
            if ( data.length && data[0]['stats-array'].length ){
                var count = 0;
                for( var prop in data[0]['stats-array'][0] ){
                    if(prop === 'DeviceType' || prop === 'DeviceName' || prop === '$$hashKey') {
                        continue;
                    }

                    var column = {
                        name: prop,
                        show: prop === 'BytesTransmitted' || count < 4/*|| columnToShow.indexOf(prop) !== -1*/
                        //custsortable: prop.replace(/-/g,'')
                    };

                    columns.push(column);
                    count++;
                }
            }

            return columns;
        }

        /**
         * Utils - Remove unnecessary depth of statistics obj, copying into parent property
         * @param data
         * @returns {*}
         */
        function updateDataValue(data) {
            data.forEach(function (device) {
                device['stats-array'].forEach(function (connector) {
                    for (var prop in connector) {
                        connector[prop] = connector[prop].value;
                    }
                });
            });

            return data;
        }

        /**
         * Utils - Update device labels in data
         * @param data
         * @param devices
         */
        function updateDeviceNames(data, devices){
            var devicesNamesById = {};

            devices.forEach(function (d) {
                devicesNamesById[d.id] = d.label;
            });

            data.forEach(function (d) {
                if ( devicesNamesById[d.id] ){
                    d.label = devicesNamesById[d.id];
                }
            });
        }

        /**
         * Local - general statistics utils - getting statistics data by single node
         * @param node
         * @param propName
         * @param name
         * @returns {*}
         */
        function generalStatisticsByNode(node, sObj) {
            var deviceId = node.label ? node.label : node.id,
                deviceName = node['flow-node-inventory:description'],
                devObj = {};

            devObj['stats-array'] = [];
            devObj.device = deviceId;

            var objStats = generalStatisticsByProperty(node, deviceId, deviceName, sObj);
            devObj['stats-array'].push(objStats);

            return objStats ? devObj : null;
        }

        /**
         * Local - general meter statistics - getting statistics data by single node with ordering
         * @param node
         * @param sObj
         * @returns {*}
         */
        function gMeterStatisticsByNode(node, sObj) {
            var nodeContainer = node[sObj.parentContainer] || [],
                deviceId = node.label ? node.label : node.id,
                deviceName = node['flow-node-inventory:description'],
                devObj = {};


            devObj['stats-array'] = [];
            devObj.device = deviceId;

            nodeContainer.forEach(function (nc) {
                var objStats = generalStatisticsByProperty(nc, deviceId, deviceName, sObj);

                setPositionToStatistics(objStats);
                changeObjectPropertyPosition(objStats, 'GroupId', 2);
                changeObjectPropertyPosition(objStats, 'MeterId', 2);
                objStats = sortObjectByPosition(objStats);

                devObj['stats-array'].push(objStats);
            });

            return nodeContainer.length ? devObj : null;
        }

        /**
         * Local - general statistics utils - creating statistics object
         * @param statsObj
         * @param device
         * @param deviceName
         * @param property
         * @param name
         * @returns {*}
         */
        function generalStatisticsByProperty(statsObj, device, deviceName, sObj, type) {
            var nc_stats = statsObj[sObj.container] || [],
                typeName = sObj.type.toLowerCase(),
                destObjStats = {},
                obj = {},
                customFunctionality = {
                    connector: function(){
                        destObjStats.Id = {value: statsObj.id};
                    }
                };

            destObjStats.Device = {value: device};
            destObjStats.DeviceType = {value: device};
            destObjStats.DeviceName = {value: deviceName};

            if ( customFunctionality[type] ) {
                customFunctionality[type]();
            }

            obj = getPropToSameLvl(nc_stats, typeName, obj);
            for (var prop in obj) {
                destObjStats[getCorrectPropName(prop)] = obj[prop];
            }

            return Object.keys(obj).length !== 0 ? destObjStats : null;
        }

        /**
         * Service for getting statistics depend on service function by nodes
         * @param nodes
         * @param sObj
         * @returns {Array}
         */
        function generalStatisticsByNodes(nodes, sObj) {
            var statistics = [];

            nodes.forEach(function (node) {
                var nodeStats = service[sObj.serviceFunct](node, sObj);

                if (nodeStats) {
                    statistics.push(nodeStats);
                }

            });

            return statistics;
        }

        /**
         * Link statistics - get registrationlist
         * @param successCbk
         * @param errorCbk
         */
        function getRegistrations(successCbk, errorCbk) {
            var restObj = Restangular.one('restconf').one('config').one('ofl3-statistics:ofl3-statistics');

            restObj.get().then(function (data) {
                successCbk(data['ofl3-statistics']['stat-registration']);
            }, function (res) {
                errorCbk(res.data, res.status);
            });
        }

        /**
         * Link statistics - get link statistics by settings
         * @param input
         * @param successCbk
         * @param errorCbk
         */
        function getLinkStatistics(options, successCbk, errorCbk) {
            var restObj = Restangular.one('restconf').one('operations'),
                reqData = {
                    input : {
                        'original-samples': options['original-samples'],
                        'registration-id': options['registration-id']['registration-id'],
                        window: options.window,
                        'response-type': options['response-type'],
                        'response-units': options['response-units']
                    }
                };

            restObj.post('ofl3-statistics:get-statistics', reqData).then(function (data) {
                successCbk(prepareLinksData(data.output, options));
            }, function (res) {
                errorCbk(res.data, res.status);
            });
        }

        /**
         * Local - link statistics - prepare data for showing in table
         * @param data
         */
        function prepareLinksData(data, options){
            var tableData = {
                samples: [],
                summary: []
            };

            // preparing original samples data if checked
            if(data['original-samples'] && data['original-samples'].length) {

                data['original-samples'].forEach(function(origSample){
                    var statObject = {'link-id': origSample['link-id'], 'stats-array': []};
                    origSample.samples.forEach(function(sample) {
                        var sampleVal = {
                            'link-id': origSample['link-id'],
                            'order': sample.order,
                            'value': sample.value
                        };

                        statObject['stats-array'].push(sampleVal);
                    });

                    tableData.samples.push(statObject);
                });
            }

            // preparing summary data
            if ( data.summary ){
                if ( angular.isNumber(data.summary.value) ){
                    var obj = {},
                        reg = options['registration-id'];

                    if ( reg.link || reg['link-group-id'] ) {
                        // set shown label in summary data based on link array or link group id
                        var label = reg.link ? reg.link.join(', ') : reg['link-group-id'],
                            prop = reg.link ? 'link' : 'link-group-id';

                        obj[prop] = label;
                    } else {
                        obj.name = options['response-type'] + ' [' + options['response-units'] + ']';
                    }

                    obj.value = data.summary.value;

                    tableData.summary.push({'stats-array': [obj]});
                } else {
                    tableData.summary.push({'stats-array': data.summary.value});
                }

                tableData.summary = updateSummaryValueUnits(tableData.summary, options['response-units']);
            }

            return tableData;
        }

        /**
         * Utils - function for adding units into summary values
         * @param data
         */
        function updateSummaryValueUnits(data, unit){
            if ( data.length ) {
                data[0]['stats-array'].forEach(function (item) {
                    item.value += (unit === 'link-utilization' ? ' %' : ' bps');
                });
            }

            return data;
        }



        /**
         * Queue statistics - service for getting statistics for queue
         * @param node
         * @param sObj
         * @returns {*}
         */
        function queueStatisticsByNode(node, sObj) {
            var node_connectors = node['node-connector'] || [],
                deviceId = node.label ? node.label : node.id,
                deviceName = node['flow-node-inventory:description'],
                devObj = {};

            devObj['stats-array'] = [];
            devObj.device = deviceId;

            node_connectors.forEach(function (nc) {
                var queueObj = nc['flow-node-inventory:queue'];

                if (queueObj) {
                    queueObj.forEach(function (q) {
                        q.id = nc.id;
                        var objStats = generalStatisticsByProperty(q, deviceId, deviceName, sObj, 'connector');
                        objStats.Connector = objStats.Id;
                        delete objStats.Id;
                        objStats.QueueId = {
                            value: q['queue-id']
                        };

                        setPositionToStatistics(objStats);
                        changeObjectPropertyPosition(objStats, 'QueueId', 2);
                        changeObjectPropertyPosition(objStats, 'Connector', 3);
                        objStats = sortObjectByPosition(objStats);

                        devObj['stats-array'].push(objStats);
                    });
                }
            });

            return node_connectors.length ? devObj : null;
        }

        /**
         * Port statistics - utils - update termination port id
         * @param data
         * @param nodes
         */
        function updateTpId(sData, tpData){
            sData.forEach(function (s) {
                s['stats-array'].forEach(function (item) {
                    var tpObj = tpData[item.Device],
                        tpName = findTpByDeviceName(tpObj, item.Id);
                    //console.log('cs', item.Id, tpName);

                    item.Id = tpName;
                });
            });

            function findTpByDeviceName(tps, dName){
                var port = dName.split(':').pop();

                function findPort(portId){
                    
                    var fPort = tps.filter(function (tp) {
                        return tp.data['ofl3-topology:port-id'] === portId;
                    });

                    return fPort.length ? fPort[0].data['tp-id'] : dName;
                }

                function findLocal(dName, port) {
                    return (port === "LOCAL") ? port : dName;
                }

                return parseInt(port) ? findPort(parseInt(port)) : findLocal(dName, port);
            }
        }

        /**
         * Ports statistics - get port statistics from single node with all connectors
         * @param node
         * @param sObj
         * @returns {*}
         */
        function portStatisticsByNode(node, sObj) {
            var node_connectors = node['node-connector'] || [],
                deviceId = node.label ? node.label : node.id,
                deviceName = node['flow-node-inventory:description'],
                devObj = {};

            devObj['stats-array'] = [];
            devObj.device = deviceId;

            node_connectors.forEach(function (nc) {
                var objStats = generalStatisticsByProperty(nc, deviceId, deviceName, sObj, 'connector');

                devObj['stats-array'].push(objStats);
            });

            return node_connectors.length ? devObj : null;
        }

        /**
         * Group Meter statistics - Service for getting meter feature statistics by nodes
         * @param nodes
         * @param sObj
         * @returns {Array}
         */
        function getGroupMeterStatistics(nodes, sObj) {
            var meterStats = [];

            //console.warn('sObj', sObj);

            nodes.forEach(function (node) {
                var meterStatsObj = sObj.type === 'METERFEATURES' ? generalStatisticsByNode(node, sObj) : gMeterStatisticsByNode(node, sObj);

                if (meterStatsObj) {
                    meterStats.push(meterStatsObj);
                }
            });

            return meterStats;
        }

        /**
         * Table statistics - Local - get statistics data by type
         * @param data
         * @param type
         * @returns {*}
         */
        function getTableStatisticsByType(data, type){
            return data.map(function (item) {
                var statsArray = item['table-statistics'].map(function (table) {
                    var obj = {};
                    obj.Device = table.device;
                    obj.DeviceType = table.DeviceType;
                    obj.DeviceName = table.DeviceName;
                    obj.TableId = table.id;
                    for (var prop in table[type]) {
                        obj[getCorrectPropName(prop)] = table[type][prop];
                    }
                    return obj;
                });
                return {
                    device: item.device,
                    'stats-array': statsArray
                };
            });
        }

        /**
         * Table statistics - getting Aggregate Flow Statistics
         * @param data
         * @returns {*}
         */
        function getAggregateFlowStatistics(data) {
            return getTableStatisticsByType(data, 'afs');
        }

        /**
         * Table statistics - getting Flow Table Statistics
         * @param data
         * @returns {*}
         */
        function getFlowTableStatistics(data) {
            return getTableStatisticsByType(data, 'fts');
        }

        /**
         * Table statistics - getting Flow Statistics
         * @param data
         * @returns {*}
         */
        function getFlowStatistics(data) {
            return data.map(function (item) {
                var flowStatsArray = [],
                    filteredArray = item['table-statistics'].filter(function (table) {
                        return table.fs.length ? true : false;
                    }),
                    device = item.device;

                var statsArray = filteredArray.map(function (table) {
                    return {
                        id: table.id,
                        DeviceType: table.DeviceType,
                        DeviceName: table.DeviceName,
                        stats: table.fs
                    };
                });

                statsArray.forEach(function (table) {
                    table.stats.forEach(function (flow) {
                        var obj = {};

                        obj.Device = {value: device};
                        obj.DeviceType = {value: device};//table.DeviceType;
                        obj.DeviceName = {value: table.DeviceName.value};
                        obj.TableId = table.id;
                        for (var prop in flow) {
                            obj[getCorrectPropName(prop)] = flow[prop];
                        }
                        flowStatsArray.push(obj);
                    });
                });

                return {
                    device: item.device,
                    'stats-array': flowStatsArray
                };

            });
        }

        /**
         * Table statistics - Service for getting each type table statistics for all devices
         * @param nodes
         * @returns {Array}
         */
        function tableStatisticsByNodes(nodes) {
            var tableStats = [];

            nodes.forEach(function (node) {
                var nodeStats = service.tableStatisticsByNode(node);

                if (nodeStats) {
                    tableStats.push(nodeStats);
                }
            });

            return tableStats;
        }

        /**
         * Table statistics - Service for getting each type table statistics per device
         * @param node
         * @returns {*}
         */
        function tableStatisticsByNode(node) {
            var tables = node['flow-node-inventory:table'] || [],
                deviceId = node.label ? node.label : node.id,
                deviceName = node['flow-node-inventory:description'],
                devObj = {},
                getAfsStats = function (objAfs) {
                    //agregate stats
                    var destObjStats = {};
                    destObjStats = getPropToSameLvl(objAfs, 'afs', destObjStats);

                    return destObjStats;
                },
                getFtsStats = function (objFts) {
                    //table flow stats
                    var destObjStats = {};
                    destObjStats = getPropToSameLvl(objFts, 'fts', destObjStats);

                    return destObjStats;
                },
                getFsStats = function (arrayFs) {
                    //flow statistics
                    var getFlowStats = function(flow) {
                            var objFs = flow['opendaylight-flow-statistics:flow-statistics'] || {},
                                obj = {},
                                id = flow.id;

                            if (Object.keys(objFs).length) {
                                obj['flow-id'] = {value: id};
                                obj = getPropToSameLvl(objFs, 'fs', obj);
                                return obj;
                            } else {
                                return null;
                            }

                        },
                        destArrayStats = [];

                    arrayFs.forEach(function (flow) {
                        var flowStat = getFlowStats(flow);

                        if (flowStat) {
                            destArrayStats.push(flowStat);
                        }
                    });

                    return destArrayStats;
                };

            devObj['table-statistics'] = [];
            devObj.device = deviceId;
            //devObj.DeviceType = deviceId;

            // put all type of table statistics into single table array
            tables.forEach(function (table) {
                var objTable = {},
                    objAfs = table['opendaylight-flow-statistics:aggregate-flow-statistics'] || {},
                    objFts = table['opendaylight-flow-table-statistics:flow-table-statistics'] || {},
                    arrayFs = table.flow || [];


                objTable.afs = getAfsStats(objAfs);
                objTable.fts = getFtsStats(objFts);
                objTable.fs = getFsStats(arrayFs);
                objTable.id = {value: table.id};
                objTable.device = {value: deviceId};
                objTable.DeviceType = {value: deviceId};
                objTable.DeviceName = {value: deviceName};

                devObj['table-statistics'].push(objTable);

            });

            return tables.length ? devObj : null;
        }


        /**
         * Request - Get config stats data
         * @param successCbk
         */
        function getStatisticsConfig(successCbk) {
            var config = Restangular.oneUrl('statsConfig','./app/modules/pce/data/statistics.json');
            config.get().then(function (response) {
                if ( response ) {
                    //console.info('INFO :: statistics config file', response);
                    successCbk(response);
                } else {
                    console.warn('INFO :: couldnt load statistics config file');
                }

            }, function () {
               console.warn('INFO :: couldnt load statistics config file');
            });
        }

        /**
         * Request - Get list of devices with statistics
         * @param successCbk
         * @param errorCbk
         */
        function getDevices(nodes, successCbk, errorCbk) {
            var restObj = Restangular.one('restconf').one('operational').one('opendaylight-inventory:nodes');

            restObj.get().then(function (data) {
                var checkDevices = data.nodes && data.nodes.node && data.nodes.node.length;

                if ( checkDevices ){
                    var devices = data.nodes.node;
                    successCbk(createDevicesObj(excludeMountedDevices(devices)), devices);
                } else {
                    console.warn('WARNING :: No devices data found - ', data.nodes);
                    errorCbk();
                }
            }, function (res) {
                errorCbk(res.data, res.status);
            });

            /**
             * Remove unnecessary devices
              * @param devices
             * @returns {*}
             */
            function excludeMountedDevices(devices) {
                return devices.filter(function (dev) {
                    return dev.hasOwnProperty('netconf-node-inventory:connected') === false;
                });
            }

            /**
             * Create devices obj from raw data
             * @param devices
             * @returns {{}}
             */
            function createDevicesObj(devices){
                var devicesList = [];
                devices.forEach(function(d) {
                    devicesList.push({
                        id: d.id,
                        label: NetworkService.getNodeByDataPath(nodes, d.id),
                        checkedStatus: true
                        //data: d
                    });
                });

                return devicesList;
            }
        }

        /**
         * Local - getting correct property name
         * @param prop
         * @returns {string}
         */
        function getCorrectPropName(prop) {
            var capitaliseFirstLetter = function (string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                },
                stringArray = [];


            stringArray = prop.split('-');
            prop = '';
            stringArray.forEach(function (p) {
                prop += capitaliseFirstLetter(p);
            });

            return prop;
        }

        /**
         * Local - function for capitalizing string
         * @param string
         * @returns {string}
         */
        function capitaliseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        /**
         * Local - function for getting deep obj into obj with properties on same level
         * @param objSource
         * @param name
         * @param obj
         * @param returnObj
         * @returns {*}
         */
        function getPropToSameLvl(objSource, name, obj, returnObj) {
            var functCallBack = function (i, index) {
                getPropToSameLvl(i, (!returnObj ? '' : name + '-') + capitaliseFirstLetter(prop) + '_' + index + '_', obj, true);
            };

            for (var prop in objSource) {
                if (typeof objSource[prop] === 'object' && Object.keys(objSource[prop]).length && !(objSource[prop] instanceof Array)) {
                    getPropToSameLvl(objSource[prop], (!returnObj ? '' : name + '-') + capitaliseFirstLetter(prop), obj, true);
                } else {

                    if (objSource[prop] instanceof Array) {

                        if (typeof objSource[prop][0] === 'object') {
                            objSource[prop].forEach(functCallBack);
                        } else {
                            var arrayString = objSource[prop].join(', ');
                            obj[(!returnObj ? '' : name + '-') + capitaliseFirstLetter(prop)] = {value: arrayString};
                        }

                    } else {
                        obj[(!returnObj ? '' : name + '-') + capitaliseFirstLetter(prop)] = {value: objSource[prop]};
                    }

                }
            }

            if (!returnObj) {
                return obj;
            }
        }

        /**
         * Local - function for setting position property into statistics object
         * @param obj
         */
        function setPositionToStatistics(obj) {
            var counter = 0;
            for (var prop in obj) {
                obj[prop].pos = counter;
                counter++;
            }
        }

        /**
         * Local - function for changing property position in object
         * @param obj
         * @param prop
         * @param pos
         */
        function changeObjectPropertyPosition(obj, prop, pos) {
            var findObj = function (o, p, cbk) {
                for (var prop in o) {
                    if (o[prop].pos === p) {
                        cbk(o[prop]);
                    }
                }
            };

            if (obj[prop]) {
                findObj(obj, pos, function (foundedObj) {
                    foundedObj.pos = obj[prop].pos;
                    obj[prop].pos = pos;
                });
            }
        }

        /**
         * Local - sort object by position property
         * @param obj
         * @returns {{}}
         */
        function sortObjectByPosition(obj) {
            var sortedObj = {},
                toSortArray = [];

            for (var prop in obj) {
                var newObj = {};
                newObj = obj[prop];
                newObj.name = prop;
                toSortArray.push(newObj);
            }

            toSortArray.sort(function (a, b) {
                return a.pos - b.pos;
            });

            toSortArray.forEach(function (i) {
                sortedObj[i.name] = i;
                delete sortedObj[i.name].name;
            });

            return sortedObj;
        }
    }

    return StatisticsService;

});
