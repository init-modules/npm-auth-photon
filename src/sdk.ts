import {
	createPhotonAccountTabExtension,
	createPhotonSiteFrameExtension,
	type PhotonAccountTabExtension,
	type PhotonSiteFrameExtension,
} from "@init/photon/public";
import { AuthHeaderAction } from "./auth-header-action";

export const authPhotonSiteFrameExtension: PhotonSiteFrameExtension =
	createPhotonSiteFrameExtension({
		id: "auth",
		label: "Auth",
		order: 100,
		header: {
			slots: {
				actions: {
					actions: [
						{
							id: "auth:login",
							label: "Sign in",
							href: "/login",
							dedupeKey: "auth:account",
							kind: "auth",
							authenticatedLabel: "Account",
							authenticatedHref: "/account",
							appearance: "secondary",
							interaction: {
								intent: "auth:sign-in",
								fallbackHref: "/login",
							},
							action: {
								type: "surface",
								intent: "auth:sign-in",
								fallbackHref: "/login",
							},
							triggerSlot: {
								id: "site-header.auth",
								label: "Auth",
								description:
									"Header action that opens the configured authentication flow.",
								actionInstanceId: "auth:sign-in",
								allowedActionDefinitionIds: ["auth.sign-in"],
								allowedGuardDefinitionIds: ["auth.required"],
								previewScenarios: [
									{ id: "guest", label: "Guest" },
									{ id: "authenticated", label: "Authenticated" },
								],
							},
							component: AuthHeaderAction,
							order: 100,
						},
					],
				},
			},
		},
		footer: {
			slots: {
				navigation: {
					navigationColumns: [
						{
							id: "auth:footer-account",
							title: "Account",
							order: 100,
							links: [
								{
									id: "auth:footer-login",
									label: "Sign in",
									href: "/login",
								},
								{
									id: "auth:footer-account-link",
									label: "My account",
									href: "/account",
								},
							],
						},
					],
				},
			},
		},
	});

export const authAccountOverviewTab: PhotonAccountTabExtension =
	createPhotonAccountTabExtension({
		id: "auth:overview",
		label: "Overview",
		href: "/account",
		icon: "user-round",
		match: {
			type: "exact",
			href: "/account",
		},
		order: 0,
	});

export const createAuthAccountTabExtension =
	createPhotonAccountTabExtension;
