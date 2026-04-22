"use client";

import {
	createPhotonKit,
	type PhotonInstallableKit,
	type PhotonModule,
} from "@init/photon/public";
import {
	authAccountOverviewDefinition,
	authAccountShellDefinition,
} from "./blocks/account-shell";
import {
	authAccountOverviewTab,
	authPhotonSiteFrameExtension,
} from "./sdk";

export const authPublicPhotonModule: PhotonModule = {
	module: "auth-photon",
	label: "Auth Photon",
	version: "0.1.0",
	blocks: [authAccountShellDefinition, authAccountOverviewDefinition],
};

export const authPublicPhotonKit: PhotonInstallableKit =
	createPhotonKit({
		key: "auth-photon",
		label: "Auth Photon",
		modules: [authPublicPhotonModule],
		siteFrameExtensions: [authPhotonSiteFrameExtension],
		accountTabs: [authAccountOverviewTab],
	});
