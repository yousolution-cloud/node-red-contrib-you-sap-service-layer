# Changelog

All notable changes to this project will be documented in this file.

# [0.2.11] - 2025-07-28

- Add Manage NextLink on ServiceNode
> the node ServiceNode does *not manage “NextLink” directly* as it is very case-dependent, the property is provided and *delegated to the flow for management*

# [0.2.10] - 2025-03-20

- Add Manage AlternateCatNum on LayerOne2SL Get / List / Create / Delete / Update

# [0.2.9] - 2025-02-19

- Added Manage Dynamic User on Autentication Service Layer

# [0.2.8] - 2025-01-22

- Added error handling configuration from library or manual on ServiceSAP Node

# [0.2.7] - 2025-01-22

- Change Manage Error ServiceLayer on ServiceSAP Node

# [0.2.6] - 2025-01-18

- Change Manage Empty Respose on ServiceSAP node

# [0.2.5] - 2025-01-16

- Bug Fix NextLink Node on Manage Url Value

# [0.2.4] - 2024-11-07

- Fix compatibility on serviceSap and manipulateEntitySap

# [0.2.3] - 2024-11-01

- Upgrade List on CloseSap Node 

# [0.2.2] - 2024-10-23

- Fix compatibility node-RED > 3.1.0

# [0.2.0] - 2024-06-19

> *Warning Breaking Change!* please make backups of flows and try in test environment before upgrading

- We have improved the management of login token expiration
- We have updated the manage dynamic login on AUTH Request
- We have updated the result handling in PATCH request
- We have resolved an error send Entry on UDT PATCH request
- We have updated the result handling in SERVICE request
- We have updated the error parsing function
- We Add Service "OrdersService_Preview" on SERVICE
- Bug Fix
- Library Axios & Odata Updated

# [0.1.1] - 2022-12-09

- Added label output to nextLink block
- Fix authentication for subflows compatibility
- Bug fix

# [0.1.0] - 2022-07-28

- Added sqlQuery node to execute saved sql from SAP Service Layer
- Added a second output to the nextLink node to check when pagination is finished
- Bug fix

# [0.0.5] - 2022-05-27

- Change cross join
- Fix html icons

# [0.0.4] - 2022-05-12

- Add all services of SAP service layer
- Add manipulate entity

# [0.0.3] - 2022-04-15

- Refactoring and add unit tests

# [0.0.1] - 2021-11-22

### First release.

- First public release of unofficial SAP Service Layer for NODE-RED.
