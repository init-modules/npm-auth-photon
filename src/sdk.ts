import {
	createWebsiteBuilderAccountTabExtension,
	createWebsiteBuilderSiteFrameExtension,
	type WebsiteBuilderAccountTabExtension,
	type WebsiteBuilderSiteFrameExtension,
} from "@init-modules/website-builder";

export const authWebsiteBuilderSiteFrameExtension: WebsiteBuilderSiteFrameExtension =
	createWebsiteBuilderSiteFrameExtension({
		id: "auth",
		label: "Auth",
		order: 100,
		header: {
			actions: [
				{
					id: "auth:login",
					label: "Sign in",
					href: "/login",
					kind: "auth",
					authenticatedLabel: "Account",
					authenticatedHref: "/account",
					appearance: "secondary",
					order: 100,
				},
			],
		},
		footer: {
			navigationColumns: [
				{
					id: "auth:footer-account",
					title: "Account",
					order: 100,
					links: [
						{ id: "auth:footer-login", label: "Sign in", href: "/login" },
						{ id: "auth:footer-account-link", label: "My account", href: "/account" },
					],
				},
			],
		},
	});

export const authAccountOverviewTab: WebsiteBuilderAccountTabExtension =
	createWebsiteBuilderAccountTabExtension({
		id: "auth:overview",
		label: "Overview",
		href: "/account",
		order: 0,
	});

export const createAuthAccountTabExtension =
	createWebsiteBuilderAccountTabExtension;
