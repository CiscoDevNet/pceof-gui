var controllers = [
    'app/modules/pce/controllers/address-mappings.controller',
    'app/modules/pce/controllers/policies/add_policy.controller',
    'app/modules/pce/controllers/bgp-routes/bgp-route-dialog.controller',
    'app/modules/pce/controllers/bgp-routes/bgp-routes.controller',
    'app/modules/pce/controllers/configuration/configuration.controller',
    //'app/modules/pce/controllers/configuration/configuration-fs-modal.controller',
    'app/modules/pce/controllers/configuration/configuration-modal.controller',
    'app/modules/pce/controllers/error-handler.controller',
    'app/modules/pce/controllers/flow-management/flow-management.controller',
    'app/modules/pce/controllers/flow-management/flows-table.controller',
    'app/modules/pce/controllers/links.controller',
    'app/modules/pce/controllers/nodes.controller',
    'app/modules/pce/controllers/notifications/notifications.controller',
    'app/modules/pce/controllers/notifications/notifications-table.controller',
    'app/modules/pce/controllers/pce.controller',
    'app/modules/pce/controllers/policies/policy.controller',
    'app/modules/pce/controllers/topology.controller',
    'app/modules/pce/controllers/statistics.controller',
    'app/modules/pce/controllers/notifications/add-edit-registration.controller'
];

var services = [
    'app/modules/pce/services/address-mapping/address-mapping.service',
    'app/modules/pce/services/address-mapping/address-mappings-list.service',
    'app/modules/pce/services/bgp-routes/bgp-route.service',
    'app/modules/pce/services/bgp-routes/bgp-routes-list.service',
    'app/modules/pce/services/configuration.service',
    'app/modules/pce/services/policies/element_policy.service',
    'app/modules/pce/services/policies/element_policy_list.service',
    'app/modules/pce/services/utils/errorhandler.service',
    'app/modules/pce/services/flow-management.service',
    'app/modules/pce/services/notifications/global-parameters.service',
    'app/modules/pce/services/policies/hop.service',
    'app/modules/pce/services/policies/hop_list.service',
    'app/modules/pce/services/links.service',
    'app/modules/pce/services/network.service',
    'app/modules/pce/services/nodes.service',
    'app/modules/pce/services/notifications/notification.service',
    'app/modules/pce/services/notifications/notificationlist.service',
    'app/modules/pce/services/policies/path.service',
    'app/modules/pce/services/policies/path_bundle.service',
    'app/modules/pce/services/policies/path_bundle_list.service',
    'app/modules/pce/services/policies/path_list.service',
    'app/modules/pce/services/pce.service',
    'app/modules/pce/services/pce-menu.service',
    'app/modules/pce/services/policies/policy.service',
    'app/modules/pce/services/policies/policylist.service',
    'app/modules/pce/services/notifications/registration.service',
    'app/modules/pce/services/notifications/registrationlist.service',
    'app/modules/pce/services/notifications/registered-events.service',
    'app/modules/pce/services/policies/segment.service',
    'app/modules/pce/services/policies/segment_list.service',
    'app/modules/pce/services/policies/segment_policy.service',
    'app/modules/pce/services/policies/segment_policy_list.service',
    'app/modules/pce/services/statistics.service',
    'app/modules/pce/services/notifications/stats.service',
    'app/common/services/utils.service',
    'app/modules/pce/services/utils/wizard.service',

];

var models = [
    'app/modules/pce/models/address-mapping/address-mapping.model',
    'app/modules/pce/models/address-mapping/address-mappings-list.model',
    'app/modules/pce/models/bgp-routes/bgp-route.model',
    'app/modules/pce/models/bgp-routes/bgp-routes-list.model',
    'app/modules/pce/models/policies/element_policy.model',
    'app/modules/pce/models/policies/element_policy_list.model',
    'app/modules/pce/models/flow.model',
    'app/modules/pce/models/notifications/global-parameters.model',
    'app/modules/pce/models/policies/hop.model',
    'app/modules/pce/models/policies/hop_list.model',
    'app/modules/pce/models/network.model',
    'app/modules/pce/models/notifications/notification.model',
    'app/modules/pce/models/notifications/notificationlist.model',
    'app/modules/pce/models/policies/path.model',
    'app/modules/pce/models/policies/path_list.model',
    'app/modules/pce/models/policies/path_bundle.model',
    'app/modules/pce/models/policies/path_bundle_list.model',
    'app/modules/pce/models/pce.model',
    'app/modules/pce/models/pce-menu.model',
    'app/modules/pce/models/pce-menu-item.model',
    'app/modules/pce/models/policies/policy.model',
    'app/modules/pce/models/policies/policylist.model',
	'app/modules/pce/models/notifications/registration.model',
	'app/modules/pce/models/notifications/registrationlist.model',
    'app/modules/pce/models/policies/segment.model',
    'app/modules/pce/models/policies/segment_list.model',
    'app/modules/pce/models/policies/segment_policy.model',
    'app/modules/pce/models/policies/segment_policy_list.model',
    'app/modules/pce/models/notifications/stats.model',
];

var components = [
    'app/components/topology/next_topology.module'
];

var consts = [
    'app/modules/pce/constants'
];

var directives = [];

define(['angular'].concat(controllers).concat(services).concat(models).concat(directives).concat(consts).concat(components),

    function(angular,
        // controllers
            AddressMappingsCtrl, AddPolicyCtrl, BGPRouteDialogCtrl, BGPRoutesCtrl, ConfigurationCtrl, ConfigurationModalCtrl, ErrorHandlerCtrl,
            FlowManagementCtrl, FlowsTableCtrl, LinksCtrl, NodesCtrl, NotificationsCtrl, NotificationsTableCtrl,
            PceCtrl, PolicyCtrl,  TopologyCtrl,  StatisticsCtrl, AddEditRegistrationDialogCtrl,

        // services
            AddressMappingService, AddressMappingsListService, BGPRouteService, BGPRoutesListService, ConfigurationService, ElementPolicyService, ElementPolicyListService,
            ErrorHandlerService, FlowManagementService, GlobalParametersService, HopService, HopListService, LinksService,
            NetworkService, NodesService, NotificationService, NotificationListService, PathService, PathBundleService,
            PathBundleListService, PathListService, PceService, PceMenuService, PolicyService, PolicyListService, RegistrationService,
            RegistrationListService, RegisteredEventsService, SegmentService, SegmentListService, SegmentPolicyService, SegmentPolicyListService,
            StatisticsService, StatsService, UtilsService, WizardService,

        // models
            AddressMappingModel, AddressMappingsListModel, BGPRouteModel, BGPRoutesListModel, ElementPolicyModel, ElementPolicyListModel, FlowModel,
            GlobalParametersModel, HopModel, HopListModel, NetworkModel, NotificationModel, NotificationListModel,
            PathModel, PathListModel, PathBundleModel, PathBundleListModel, PceModel, PceMenuModel, PceMenuItemModel, PolicyModel, PolicyListModel,
            RegistrationModel, RegistrationListModel, SegmentModel, SegmentListModel, SegmentPolicyModel,
            SegmentPolicyListModel, StatsModel, constants) {

        'use strict';

        angular
            .module('app.pce', ['app', 'app.nextTopo'])
            .config(config);

        function config() {


        }

        angular.module('app.pce')
            // services
            .service('AddressMappingService', AddressMappingService)
            .service('AddressMappingsListService', AddressMappingsListService)
            .service('BGPRouteService', BGPRouteService)
            .service('BGPRoutesListService', BGPRoutesListService)
            .service('UtilsService', UtilsService)
            .service('HopService', HopService)
            .service('HopListService', HopListService)
            .service('PathService', PathService)
            .service('PathListService', PathListService)
            .service('PathBundleService', PathBundleService)
            .service('PathBundleListService', PathBundleListService)
            .service('PceService', PceService)
            .service('PceMenuService', PceMenuService)
            .service('PolicyListService', PolicyListService)
            .service('PolicyService', PolicyService)
            .service('NetworkService', NetworkService)
            .service('FlowManagementService', FlowManagementService)
            .service('StatisticsService', StatisticsService)
			.service('NotificationService', NotificationService)
			.service('NotificationListService', NotificationListService)
			.service('RegistrationService', RegistrationService)
			.service('RegistrationListService', RegistrationListService)
			.service('RegisteredEventsService', RegisteredEventsService)
			.service('GlobalParametersService', GlobalParametersService)
			.service('StatsService', StatsService)
			.service('ErrorHandlerService', ErrorHandlerService)
            .service('NodesService', NodesService)
            .service('ConfigurationService', ConfigurationService)
            .service('LinksService', LinksService)
            .service('SegmentService', SegmentService)
            .service('SegmentListService', SegmentListService)
            .service('SegmentPolicyService', SegmentPolicyService)
            .service('SegmentPolicyListService', SegmentPolicyListService)
            .service('ElementPolicyService', ElementPolicyService)
            .service('ElementPolicyListService', ElementPolicyListService)
            .service('WizardService', WizardService)

            // models
            .factory('AddressMappingModel', AddressMappingModel)
            .factory('AddressMappingsListModel', AddressMappingsListModel)
            .factory('BGPRouteModel', BGPRouteModel)
            .factory('BGPRouteModel', BGPRouteModel)
            .factory('BGPRoutesListModel', BGPRoutesListModel)
            .factory('HopModel', HopModel)
            .factory('HopListModel', HopListModel)
            .factory('PathModel', PathModel)
            .factory('PathListModel', PathListModel)
            .factory('PathBundleModel', PathBundleModel)
            .factory('PathBundleListModel', PathBundleListModel)
            .factory('PceModel', PceModel)
            .factory('PceMenuModel', PceMenuModel)
            .factory('PceMenuItemModel', PceMenuItemModel)
            .factory('PolicyListModel', PolicyListModel)
            .factory('PolicyModel', PolicyModel)
            .factory('NetworkModel', NetworkModel)
            .factory('FlowModel', FlowModel)
            .factory('SegmentModel', SegmentModel)
            .factory('SegmentListModel', SegmentListModel)
            .factory('SegmentPolicyModel', SegmentPolicyModel)
            .factory('SegmentPolicyListModel', SegmentPolicyListModel)
            .factory('ElementPolicyModel', ElementPolicyModel)
            .factory('ElementPolicyListModel', ElementPolicyListModel)

			.factory('NotificationModel', NotificationModel)
			.factory('NotificationListModel', NotificationListModel)
			.factory('RegistrationModel', RegistrationModel)
			.factory('RegistrationListModel', RegistrationListModel)
			.factory('GlobalParametersModel', GlobalParametersModel)
			.factory('StatsModel', StatsModel)

            //controllers
            .controller('PceCtrl', PceCtrl)
            .controller('PolicyCtrl', PolicyCtrl)
            .controller('BGPRoutesCtrl', BGPRoutesCtrl)
            .controller('BGPRouteDialogCtrl', BGPRouteDialogCtrl)
            .controller('NodesCtrl', NodesCtrl)
            .controller('TopologyCtrl', TopologyCtrl)
            .controller('FlowManagementCtrl', FlowManagementCtrl)
            .controller('StatisticsCtrl', StatisticsCtrl)
            .controller('NotificationsCtrl', NotificationsCtrl)
            .controller('FlowsTableCtrl', FlowsTableCtrl)
            .controller('AddPolicyCtrl', AddPolicyCtrl)
            .controller('ErrorHandlerCtrl', ErrorHandlerCtrl)
            .controller('NotificationsTableCtrl', NotificationsTableCtrl)
            .controller('ConfigurationCtrl', ConfigurationCtrl)
            //.controller('ConfigurationFsModalCtrl', ConfigurationFsModalCtrl)
            .controller('ConfigurationModalCtrl', ConfigurationModalCtrl)
            .controller('LinksCtrl', LinksCtrl)
			.controller('AddEditRegistrationDialogCtrl', AddEditRegistrationDialogCtrl)
			.controller('AddressMappingsCtrl', AddressMappingsCtrl)

            .constant("constants", constants);
    });