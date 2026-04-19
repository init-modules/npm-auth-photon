"use client";

import {
	createWebsiteBuilderKit,
	type WebsiteBuilderInstallableKit,
	type WebsiteBuilderModule,
} from "@init-modules/website-builder";
import { authAccountShellDefinition } from "./blocks/account-shell";
import { authWebsiteBuilderDocuments } from "./documents";
import {
	authAccountOverviewTab,
	authWebsiteBuilderSiteFrameExtension,
} from "./sdk";

export const authWebsiteBuilderModule: WebsiteBuilderModule = {
	module: "auth-website-builder",
	label: "Auth Website Builder",
	version: "0.1.0",
	blocks: [authAccountShellDefinition],
};

export const authWebsiteBuilderKit: WebsiteBuilderInstallableKit =
	createWebsiteBuilderKit({
		key: "auth-website-builder",
		label: "Auth Website Builder",
		modules: [authWebsiteBuilderModule],
		documents: authWebsiteBuilderDocuments,
		siteFrameExtensions: [authWebsiteBuilderSiteFrameExtension],
		accountTabs: [authAccountOverviewTab],
	});
