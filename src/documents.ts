import type { WebsiteBuilderDocumentsMap } from "@init-modules/website-builder/public";

const now = "2026-04-19T00:00:00.000Z";

export const createAuthAccountOverviewBlock = () => ({
	id: "auth-account-overview",
	module: "auth-website-builder",
	type: "auth-account-overview",
	props: {
		statusLabel: "Signed in",
	},
});

export const createAuthAccountShellBlock = (
	blocks = [createAuthAccountOverviewBlock()],
) => ({
	id: "auth-account-shell",
	module: "auth-website-builder",
	type: "auth-account-shell",
	props: {
		eyebrow: "Account",
		title: "Manage your account",
		body: "Review profile details and open package-provided workspace tabs.",
		signedOutTitle: "Sign in to continue",
		signedOutBody: "Your account page is available after authentication.",
		signInLabel: "Sign in",
		disabledTabIds: [],
	},
	areas: [
		{
			id: "content",
			label: "Account content",
			blocks,
		},
	],
});

export const authWebsiteBuilderDocuments: WebsiteBuilderDocumentsMap = {
	account: {
		id: "auth-account",
		name: "Account",
		route: "/account",
		updatedAt: now,
		blocks: [createAuthAccountShellBlock()],
	},
};
