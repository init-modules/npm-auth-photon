import type {
	PhotonAppAuthDialogConfig,
	PhotonAppModule,
} from "@init/photon-nextjs";
import { resolveServerAuthRedirectTo } from "@init/auth/server";
import { readAuthPhotonPageAccess } from "./access";
import {
	authFooterAccountColumnContribution,
	authLoginContribution,
} from "./contributions";
import { authPhotonDocuments } from "./documents";

export type CreateAuthPhotonAppModuleOptions = {
	dialogs?: {
		admin?: PhotonAppAuthDialogConfig;
		public?: PhotonAppAuthDialogConfig;
	};
	redirects?: {
		signIn?: string;
		authenticated?: string;
	};
};

const readSearchParamValue = (value: string | string[] | undefined) =>
	Array.isArray(value) ? value[0] : value;

const buildRedirectHref = (
	href: string,
	params?: Record<string, string | undefined>,
) => {
	const url = new URL(href, "https://photon.local");

	for (const [key, value] of Object.entries(params ?? {})) {
		if (value) {
			url.searchParams.set(key, value);
		}
	}

	return `${url.pathname}${url.search}`;
};

export const createAuthPhotonAppModule = (
	options: CreateAuthPhotonAppModuleOptions = {},
): PhotonAppModule => ({
	name: "auth-photon",
	packagedDocuments: {
		documents: authPhotonDocuments,
		accountDocument: authPhotonDocuments.account,
	},
	siteFrameContributions: [
		authLoginContribution,
		authFooterAccountColumnContribution,
	],
	client: {
		authDialogs: {
			admin: {
				titleKey: "authPhoton.dialogs.admin.title",
				descriptionKey: "authPhoton.dialogs.admin.description",
				title: "Admin access",
				description: "Sign in to manage Photon pages.",
				...(options.dialogs?.admin ?? {}),
			},
			public: {
				titleKey: "authPhoton.dialogs.public.title",
				descriptionKey: "authPhoton.dialogs.public.description",
				title: "Sign in",
				description: "Sign in to continue.",
				...(options.dialogs?.public ?? {}),
			},
		},
		requestAuthActions: {
			admin: {
				type: "surface",
				intent: "auth:sign-in",
				fallbackHref: options.redirects?.signIn ?? "/login",
			},
			public: {
				type: "surface",
				intent: "auth:sign-in",
				fallbackHref: options.redirects?.signIn ?? "/login",
			},
		},
	},
	server: {
		publicPageAccessGuards: [
			({ searchParams, context }) => {
				const page = context.resolvedPage;
				const currentPath = context.currentPath;
				const access = readAuthPhotonPageAccess(
					page?.pageSettings,
					page?.page?.route ?? currentPath,
				);
				const isAuthenticated = Boolean(context.isAuthenticated);

				if (access === "authenticated" && !isAuthenticated) {
					return {
						type: "redirect",
						href: buildRedirectHref(options.redirects?.signIn ?? "/login", {
							redirectTo: currentPath,
						}),
					};
				}

				if (access === "guest" && isAuthenticated) {
					return {
						type: "redirect",
						href: resolveServerAuthRedirectTo(
							readSearchParamValue(searchParams.redirectTo),
							options.redirects?.authenticated ?? "/account",
						),
					};
				}

				return null;
			},
		],
	},
});
