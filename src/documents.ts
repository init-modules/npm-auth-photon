import type { PhotonDocumentsMap } from "@init/photon/public";

const now = "2026-04-19T00:00:00.000Z";

export const createAuthAccountOverviewBlock = () => ({
	id: "auth-account-overview",
	module: "auth-photon",
	type: "auth-account-overview",
	props: {
		statusLabel: "Signed in",
	},
});

export const createAuthAccountShellBlock = (
	blocks = [createAuthAccountOverviewBlock()],
) => ({
	id: "auth-account-shell",
	module: "auth-photon",
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

const createAuthPageBlock = (
	id: string,
	route:
		| "forgot-password"
		| "login"
		| "register"
		| "reset-password"
		| "verify-email",
	title: string,
	body: string,
) => ({
	id,
	module: "auth-photon",
	type: "auth-page",
	props: {
		eyebrow: "Account access",
		title,
		body,
		route,
		actionLabel: "Continue",
	},
});

const createAuthPageDocument = (
	id: string,
	name: string,
	route: string,
	authRoute: Parameters<typeof createAuthPageBlock>[1],
	title: string,
	body: string,
) => ({
	id,
	name,
	route,
	updatedAt: now,
	blocks: [createAuthPageBlock(`${id}-auth-page`, authRoute, title, body)],
});

export const authPhotonDocuments: PhotonDocumentsMap = {
	account: {
		id: "auth-account",
		name: "Account",
		route: "/account",
		updatedAt: now,
		blocks: [createAuthAccountShellBlock()],
	},
	forgotPassword: createAuthPageDocument(
		"auth-forgot-password",
		"Forgot password",
		"/forgot-password",
		"forgot-password",
		"Reset your password",
		"Enter your email and we will send a password reset link.",
	),
	login: createAuthPageDocument(
		"auth-login",
		"Sign in",
		"/login",
		"login",
		"Sign in",
		"Continue with your account to use protected website pages.",
	),
	register: createAuthPageDocument(
		"auth-register",
		"Register",
		"/register",
		"register",
		"Create an account",
		"Create an account to use protected website pages.",
	),
	resetPassword: createAuthPageDocument(
		"auth-reset-password",
		"Reset password",
		"/reset-password",
		"reset-password",
		"Choose a new password",
		"Use the password reset token from your email to choose a new password.",
	),
	verifyEmail: createAuthPageDocument(
		"auth-verify-email",
		"Verify email",
		"/verify-email",
		"verify-email",
		"Verify your email",
		"Confirm your email address before signing in.",
	),
};
