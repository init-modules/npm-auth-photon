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
import { authPageDefinition } from "./blocks/auth-page";
import {
	authAccountOverviewTab,
	authPhotonSiteFrameExtension,
} from "./sdk";
import {
	authInteractionActions,
	authInteractionGuardEvaluators,
	authInteractionGuards,
	authInteractionSurfaces,
} from "./surfaces";

export const authPublicPhotonModule: PhotonModule = {
	module: "auth-photon",
	label: "Auth Photon",
	version: "0.1.0",
	blocks: [
		authAccountShellDefinition,
		authAccountOverviewDefinition,
		authPageDefinition,
	],
};

export const authPublicPhotonKit: PhotonInstallableKit =
	createPhotonKit({
		key: "auth-photon",
		label: "Auth Photon",
		modules: [authPublicPhotonModule],
		siteFrameExtensions: [authPhotonSiteFrameExtension],
		accountTabs: [authAccountOverviewTab],
	interactionSurfaces: authInteractionSurfaces,
	interactionActions: authInteractionActions,
	interactionGuards: authInteractionGuards,
	interactionGuardEvaluators: authInteractionGuardEvaluators,
});
