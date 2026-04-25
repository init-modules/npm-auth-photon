import {
	createPhotonInteractionActionDefinition,
	createPhotonInteractionGuardDefinition,
	createPhotonInteractionSurfaceDefinition,
	type PhotonInteractionActionDefinition,
	type PhotonInteractionGuardDefinition,
	type PhotonInteractionGuardEvaluatorMap,
	type PhotonInteractionSurfaceDefinition,
} from "@init/photon/public";
import { hasAuthPhotonUser } from "./auth-resource";

export const authDialogInteractionSurface =
	createPhotonInteractionSurfaceDefinition({
		id: "auth.dialog",
		label: "Auth dialog",
		description: "Authentication dialog instances used by public actions.",
		kind: "dialog",
		rendererKey: "auth.dialog",
		order: 10,
		fields: [
			{
				path: "title",
				label: "Title",
				kind: "text",
				group: "content",
				localization: "localized",
			},
			{
				path: "description",
				label: "Description",
				kind: "textarea",
				group: "content",
				localization: "localized",
			},
			{
				path: "defaultMode",
				label: "Default mode",
				kind: "select",
				group: "content",
				localization: "shared",
				options: [
					{ label: "Login", value: "login" },
					{ label: "Register", value: "register" },
				],
			},
		],
		defaultInstances: [
			{
				id: "auth:default",
				definitionId: "auth.dialog",
				label: "Default sign in",
				props: {
					title: "Sign in",
					description: "Sign in to continue.",
					defaultMode: "login",
				},
			},
			{
				id: "auth:publish-required",
				definitionId: "auth.dialog",
				label: "Publish content sign in",
				props: {
					title: "Sign in to publish",
					description:
						"To publish an article, sign in to your account or create a new one.",
					defaultMode: "login",
				},
			},
		],
		defaultIntentBindings: [
			{
				intent: "auth:sign-in",
				surfaceInstanceId: "auth:default",
			},
			{
				intent: "auth:publish-content",
				surfaceInstanceId: "auth:publish-required",
			},
		],
	});

export const authInteractionSurfaces: PhotonInteractionSurfaceDefinition[] = [
	authDialogInteractionSurface,
];

export const authInteractionActions: PhotonInteractionActionDefinition[] = [
	createPhotonInteractionActionDefinition({
		id: "auth.sign-in",
		label: "Sign in",
		description: "Open the authentication dialog.",
		order: 10,
		fields: authDialogInteractionSurface.fields,
		defaultInstances: [
			{
				id: "auth:sign-in",
				definitionId: "auth.sign-in",
				label: "Default sign in",
				presentation: {
					type: "surface",
					intent: "auth:sign-in",
					fallbackHref: "/login",
				},
			},
			{
				id: "auth:publish-content",
				definitionId: "auth.sign-in",
				label: "Publish content sign in",
				presentation: {
					type: "surface",
					intent: "auth:publish-content",
					fallbackHref: "/login",
				},
			},
		],
		previewScenarios: [
			{ id: "guest", label: "Guest" },
			{ id: "authenticated", label: "Authenticated" },
			{ id: "loading", label: "Loading" },
			{ id: "error", label: "Error" },
		],
	}),
];

export const authInteractionGuards: PhotonInteractionGuardDefinition[] = [
	createPhotonInteractionGuardDefinition({
		id: "auth.required",
		label: "Auth required",
		description: "Require a signed-in user before continuing.",
		order: 10,
		missingEvaluatorPolicy: "block",
		defaultInstances: [
			{
				id: "auth:required",
				definitionId: "auth.required",
				label: "Require sign in",
				action: {
					type: "surface",
					intent: "auth:sign-in",
					fallbackHref: "/login",
				},
			},
		],
		previewScenarios: [
			{ id: "guest", label: "Guest" },
			{ id: "authenticated", label: "Authenticated" },
		],
	}),
];

export const authInteractionGuardEvaluators: PhotonInteractionGuardEvaluatorMap =
	{
		"auth.required": ({ resources, guard }) =>
			hasAuthPhotonUser(resources)
				? { status: "allowed" }
				: {
						status: "blocked",
						reason: "auth-required",
						action: guard.action,
					},
	};
