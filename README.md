# OpenDaylight PCE-Openflow <a style="float:right " href="https://dcloud.cisco.com/"><img src="dcloud.png" alt="IMAGE ALT TEXT HERE" align="right"/></a>   


<img src="https://raw.githubusercontent.com/CiscoDevNet/pceof-gui/master/screenshots/pceof.png" alt="alt text" width=300px height=300px>

OpenDaylight (ODL) is an open source application development and delivery platform (also referred to in some circles as a controller). Openflow is a protocol for
programming flow tables on switches. PCE-Openflow (PCE-OF) is a new ODL application that applies policy-based path computation and programming thus providing a level of "smart" traffic engineering to openflow networks. 

## Team

- Jan Medved
- Daniel Malachovsky
- Tyler Levine
- Alexei Zverev
- Zhaoxing (Andrew) Li
- Martin Lakatos
- Daniel Kuzma
- Stanislav Jamrich
- Chris Metz
- Andrej Vanko
- Giorgi Guliashvili

### Project Link

[PCE-OF Project](https://github.com/CiscoDevNet/pceof-gui). 

Note: This release provides the PCE-OF GUI source code as a reference app. Subsequent releases over the next few months include ODL + network instance in dcloud so that interested users can run app. The entire package will soon be released to the open source community.

### Social Tags

SDN, Opendaylight, Open Source, NeXt, Openflow, Path Computation Element, PCE, Policy, RESTCONF, YANG, Topology, BGP

### Project Kick-off Date

November 2015

### Current Status

Complete

## Application Overview

Early incarnations of software defined networking (SDN) involved control and data plane separation. SDN has evolved where the control plane can be expressed
by applications using APIs to talk to a controller - the controller then talking to one or more network elements using different protocols. This model enables applications to play a major role in network management and operations.

Openflow is a protocol used between the controller and switches to program per-switch flow tables. The end result(s) are one or more inter switch per-flow paths connecting hosts and/or sites to one another. In general openflow paths are computed and programmed by human operators employing a simple user interface (UI) communicating with ODL configured as an openflow controller. In this mode of operation path selection and programming is left to the operator's discretion. Other considerations (or policies), for example maximum allowed link utilization or automatic fast reroute, that could impact data transer performance ARE NOT factored in. Clearly this could lead to less than ideal resource utilization and degraded performance. A requirement to consider such policies in path selection and deployment is required.

PCE-OF is a new and novel ODL application incorporating policy-based path computation and programming across openflow networks. Policies are configured and taken into account as paths are computed and programmed into the network. 

Figure 1 belows depicts the general architecture of the PCE-OF solution.
![](https://raw.githubusercontent.com/CiscoDevNet/pceof-gui/master/screenshots/pce-of-app-picture.jpg)
*Figure 1. PCE-OF Architecture*

The PCE-OF solution is composed of ODL, PCE-OF ODL plug-ins and a UI (aka GUI). ODL uses its standard openflow southbound plug-ins to program flows tables and extract stats from openflow switches. The standard ODL software components including MD-SAL and RESTCONF are present. The PCE-OF plug-ins implemented in ODL support:

- Policy configuration and operations. Policy examples include path-specific constraints such as node/link whitelisting, maximum-path-cost and active/backup
- Path computation between source/destination (IP addresses, ports, BGP prefixes)based on Configured Policies
- BGP prefix collection and transport into PCE-OF path computation plug-in
- Stats/events collection

Policy-based paths are built across the openflow network to connect hosts(s), servers, sites or, even BGP routers that provide reachability to external networks. Another important scaling feature if supported on the switches, is mapping of individual flows into a single path-specific flow thus consuming less TCAM overhead on the switch. 

The GUI provides the user interface into the system. It includes a dynamic topology view allowing for easy interaction with application operations (e.g. policy configuration, deployed paths, etc.). The GUI will be discussed below. Note that the PCE-OF solution is built entirely using open source components including ODL, AngularJS, NodeJS and NeXt among others. 

Traffic engineering functions have been supported across IP/MPLS networks for many years. PCE-OF brings traffic engineering to openflow networks.

## PCE-OF GUI

The PCE-OF GUI provides the operator with a web-based user interface into the system. The openflow network topology is displayed, policies configured and deployed and specific paths (determined by operator defined policies) are visually overlaid. In addition flow statistics, BGP routes and address mapping can be easily accessed through the GUI.

The GUI is designed and implemented using AngularJS, a commonly used model-view-controller (MVC) UI framework. A simple look/feel is supported using the Angular Material and NeXt libraries. Internally the system defines models and services applied against those models; controllers for manipulating data for viewing; views (e.g. html page) displayed in a browser and bound to controllers. This MVC design pattern provides a modularized development and can be re-used across multiple applications 

Figure 2 belows shows the PCE-OF GUI "landing page".
![](https://raw.githubusercontent.com/CiscoDevNet/pceof-gui/master/screenshots/topology-active.png)
*Figure 2. PCE-OF GUI*

There is a 10min video of PCE-Openflow in action located [here](https://www.youtube.com/watch?v=hRDKgn_zd4g). What follows is a brief description of the important PCE-OF functions presented in the GUI.

### Topology

Renders a view of the OF network topology composed of nodes (OF switches and any attached hosts, switches or routers) and connections. The topology view reacts to network operations and events and provides interfactions with other features. In the example above switches are labeled FB (forwarding boxes).

### Nodes

Information on switches, routers and hosts including status, list of ports and connected links.

### Connections

Information on connections between nodes. A connection could be a bundle composed of one or more physical links. Selecting a connection from the panel will highlight it on the topology and vice-versa.

### Policy

Two options here: config and operational. Config enables the operator to add new polices or modified existing policies. After the policies are configured they are deployed into the network and become operational.

Operational shows policies deployed in the network. Paths defined and deployed based on policy can be and selected and then overlaid onto the topology view.

### Flows

Shows OF switch properties and stats counters. Also shows details on flows table entries inside an OF switch.

### Address Mappings

Shows table of the discovered node's IP and MAC addresses.

### BGP Routes

Prefixes, next_hops and VRFs learned from attached BGP routers.

### Utilization

Several sub-functions including:

- Registrations. enables link stats gathering, events to be retrieved once certain parameters exceed a threshold

- Events. List of events based on registration

- Statistics. Link stats based on registration, display individual or aggregate utilization in % or bits per second (bps). Flow stats for individual, table aggregates for installed flows. Per-switch port stats includding transferred data, packets, errors, etc. And finally openflow stats for queue, meter and groups.

### Configuration

Parameters for the controller

## Feature Summary

- Policy-based Traffic Engineering for Openflow Networks
- Developed for ODL
- Built using open software including Java, NeXt and AngularJS among others
- Simple WEB browser GUI for topology visuzation and interactive policy management/programming
- Detailed stats collection
- Flexible policy configuration including constraint-based path computation and programming based source/destion IP address, ports and BGP prefixes

## Installation Instructions

Note: this package provides the code for the GUI only at this time. 

For the installation process you will need to install the following CLI utilities: [Git](https://git-scm.com), [Bower](http://bower.io), [npm](https://www.npmjs.com).

### Download the code

To download the code, use GitHub's web-interface at: https://github.com/CiscoDevNet/pceof-gui,

or download using [Git](https://git-scm.com):

```
git clone https://github.com/CiscoDevNet/pceof-gui.git
```

When this is done, hack the code!

## References

- [https://wiki.opendaylight.org](https://wiki.opendaylight.org)

- [https://developer.cisco.com/site/neXt/](https://developer.cisco.com/site/neXt/)

- [https://github.com/CiscoDevNet/opendaylight-sample-apps](https://github.com/CiscoDevNet/opendaylight-sample-apps)

- [AngularJS](https://angularjs.org/)

## License
The MIT License (MIT)

Copyright (c) 2015-2016 Cisco Systems

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
