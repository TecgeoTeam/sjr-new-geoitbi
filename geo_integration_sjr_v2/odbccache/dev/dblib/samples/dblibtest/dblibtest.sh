#!/bin/sh

LD_LIBRARY_PATH=/var/www/html/geo_integration_sjr/odbccache_linux/ODBC-2018.1.2.309.0-lnxrhx64/bin
export LD_LIBRARY_PATH

#First argument is for connection
#Second argument is SQL Statement
echo ./dblibtest "\"HOST=127.0.0.1;PORT=1972;NAMESPACE=SAMPLES;USER=_system;PWD=SYS\"" "\"select * from 		sample.person where ID < 11\""
./dblibtest "HOST=127.0.0.1;PORT=1972;NAMESPACE=SAMPLES;USER=_system;PWD=SYS" "select * from sample.person where ID < 11"

#Default test
echo ./dblibtest
./dblibtest
