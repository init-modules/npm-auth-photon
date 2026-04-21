"use client";

import {
	createWebsiteBuilderKit,
	type WebsiteBuilderInstallableKit,
	type WebsiteBuilderModule,
} from "@init-modules/website-builder/public";
import {
	authAccountOverviewDefinition,
	authAccountShellDefinition,
} from "./blocks/account-shell";
import {
	authAccountOverviewTab,
	authWebsiteBuilderSiteFrameExtension,
} from "./sdk";

export const authPublicWebsiteBuilderModule: WebsiteBuilderModule = {
	module: "auth-website-builder",
	label: "Auth Website Builder",
	version: "0.1.0",
	blocks: [authAccountShellDefinition, authAccountOverviewDefinition],
};

export const authPublicWebsiteBuilderKit: WebsiteBuilderInstallableKit =
	createWebsiteBuilderKit({
		key: "auth-website-builder",
		label: "Auth Website Builder",
		modules: [authPublicWebsiteBuilderModule],
		siteFrameExtensions: [authWebsiteBuilderSiteFrameExtension],
		accountTabs: [authAccountOverviewTab],
	});
