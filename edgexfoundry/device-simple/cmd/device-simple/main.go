// -*- Mode: Go; indent-tabs-mode: t -*-
//
// Copyright (C) 2017-2018 Canonical Ltd
// Copyright (C) 2018-2019 IOTech Ltd
//
// SPDX-License-Identifier: Apache-2.0

// This package provides a simple example of a device service.
package main

import (
	"edgexfoundry/device-simple/driver"
	"github.com/edgexfoundry/device-sdk-go/v2/pkg/startup"
)

const (
	serviceName string = "device-simple"
)

func main() {
	sd := driver.SimpleDriver{}
	startup.Bootstrap(serviceName, "0.0.0", &sd)
}
