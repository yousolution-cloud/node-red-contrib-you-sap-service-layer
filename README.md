<!-- [![NPM version][npm-version-image]][npm-url]
[![NPM downloads per month][npm-downloads-month-image]][npm-url]
[![NPM downloads total][npm-downloads-total-image]][npm-url]
[![MIT License][license-image]][license-url] -->

# Unofficial SAP Service layer nodes for Node-RED.
[![Platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)


This module provides a set of nodes for Node-RED to quickly create integration flows with SAP service layer.

# Installation
[![NPM](https://nodei.co/npm/node-red-contrib-sap-service-layer.png?downloads=true)](https://nodei.co/npm/node-red-contrib-sap-service-layer/)

You can install the nodes using node-red's "Manage palette" in the side bar.

Or run the following command in the root directory of your Node-RED installation

    npm install @yousolution/node-red-contrib-sap-service-layer --save


# Dependencies
The nodes are tested with `Node.js v12.22.6` and `Node-RED v2.0.6`.
 - [axios](https://github.com/axios/axios)
 - [odata-query](https://github.com/techniq/odata-query)

# Changelog
Changes can be followed [here](/CHANGELOG.md).

# Usage
## Basics

### Authenticate (node authenticateSap)

Use this node to authenticate with a valid SAP service layer API access\
The node requires the following credentials:
- host
- port
- company
- user
- password

You can see how to use it in the example flows in the */examples* directory.\
*For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)*

### Retrieve a list of entities (node listSap)

Use this node to retrieve a list of entities
1. Select the type of entity you want to retrieve as a list
2. If you want to add filter/options use oData params *optional*\
Query options on entities:

|option|description|
--------|------------
|$filter|Restrict the set of business objects returned.|
|$orderby|Specify the order in which business objects are returned from the service.|
|$select|Restrict the service to return only the properties requested by the client.|
|$skip|Specify that the result excludes the first n entities.|
|$top|Specify that only the first n records should be returned.|



You can see how to use it in the example flows in the */examples* directory.\
*For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)* 

### Get single entity (node getSap)

Use this node to get a single entity by providing the primary key
1. Select the type of entity you want to retrieve
2. Use *objectId* as primary key of entity
3. Use *oData* to filter the response fields *optional*\
   
Query options on single entity:
   
|option|description|
--------|------------
|$select|Restrict the service to return only the properties requested by the client.|

You can see how to use it in the example flows in the */examples* directory.\
*For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)* 

### Create a new entity (node createSap)

Use this node to create a new entity.
1. Select the type of entity you want to create
2. Use *msg.bodyPost* to provide the entity's fields
3. Use *msg.createParams* to provide object params

You can see how to use it in the example flows in the */examples* directory.\
*For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)* 

### Update an object

Use this node to update an object.
1. Select the type of object you want to update
2. Use *objectId* as primary key of object
3. Use *msg.updateParams* to provide object params

You can see how to use it in the example flows in the */examples* directory.\
*For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)* 

### Delete an Object

Use this node to delete an object.
1. Select the type of object you want to delete
2. Use *objectId* as primary key of object

You can see how to use it in the example flows in the */examples* directory.\
*For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)* 
  
### Count the number of objects per type

Use this node to count the number of objects per type.
1. Select the type of object you want to count

You can see how to use it in the example flows in the */examples* directory.\
*For more details see official [SAP Service layer documentation](https://sap-samples.github.io/smb-summit-hackathon/b1sl.html)* 


