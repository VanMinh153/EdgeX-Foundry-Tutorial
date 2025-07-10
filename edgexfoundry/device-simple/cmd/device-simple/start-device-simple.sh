#!/bin/bash
# Startup script for device-simple service without security
export EDGEX_SECURITY_SECRET_STORE=false
./device-simple
