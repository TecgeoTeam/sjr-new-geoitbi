#!/bin/sh

ODBCINI=/var/www/html/geo_integration_sjr/odbccache_linux/ODBC-2018.1.2.309.0-lnxrhx64/mgr/cacheodbc.ini
export ODBCINI
LD_LIBRARY_PATH=/var/www/html/geo_integration_sjr/odbccache_linux/ODBC-2018.1.2.309.0-lnxrhx64/bin
export LD_LIBRARY_PATH

#Using the following line does not require setting ODBCINI or LD_LIBRARY_PATH
#csession <cacheconfigname> -U samples "^SQLGatewayTest"
/var/www/html/geo_integration_sjr/odbccache_linux/ODBC-2018.1.2.309.0-lnxrhx64/bin/cache -s/var/www/html/geo_integration_sjr/odbccache_linux/ODBC-2018.1.2.309.0-lnxrhx64/mgr -U samples "^SQLGatewayTest"
