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
import { authPhotonDocuments } from "./documents";
import { authPageAccessSettingsPanel } from "./page-access-settings";
import {
	authAccountOverviewTab,
	authPhotonSiteFrameExtension,
} from "./sdk";
import {
	authConditionDefinitions,
	authConditionEvaluators,
	authInteractionActions,
	authInteractionGuardEvaluators,
	authInteractionGuards,
	authInteractionPolicies,
	authInteractionSurfaces,
} from "./surfaces";

export const authPhotonModule: PhotonModule = {
	module: "auth-photon",
	label: "Auth Photon",
	version: "0.1.0",
	blocks: [
		authAccountShellDefinition,
		authAccountOverviewDefinition,
		authPageDefinition,
	],
	pageSettingsPanels: [authPageAccessSettingsPanel],
};

export const authPhotonKit: PhotonInstallableKit =
	createPhotonKit({
		key: "auth-photon",
		label: "Auth Photon",
		modules: [authPhotonModule],
		documents: authPhotonDocuments,
		siteFrameExtensions: [authPhotonSiteFrameExtension],
		accountTabs: [authAccountOverviewTab],
	interactionSurfaces: authInteractionSurfaces,
	interactionActions: authInteractionActions,
	interactionGuards: authInteractionGuards,
	interactionGuardEvaluators: authInteractionGuardEvaluators,
	interactionPolicies: authInteractionPolicies,
	conditionDefinitions: authConditionDefinitions,
	conditionEvaluators: authConditionEvaluators,
});
