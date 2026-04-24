import {
	createPhotonAccountTabExtension,
	createPhotonSiteFrameExtension,
	type PhotonAccountTabExtension,
	type PhotonSiteFrameExtension,
} from "@init/photon/public";

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
							kind: "auth",
							authenticatedLabel: "Account",
							authenticatedHref: "/account",
							appearance: "secondary",
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
