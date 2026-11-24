## ETC Echo

This module works with ETC's [Echo Integration Interface](https://www.etcconnect.com/Products/Architectural-Systems/Echo/Interfaces/Echo-Integration-Interface/Features.aspx?LangType=1033) (EII) to control architectural and building lighting.

### Getting Started

The EII must be configured to talk to the device Companion is running on in order to recieve feedback.

On the device, go to Setup > Interface Config > Subscriptions and enter the following under one of the subscriber entries:

- The IP address of the computer Companion is running on
- `04703` for the UDP port
- Change the EOM setting to `CR`
