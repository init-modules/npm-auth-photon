"use client";

import type { ReactNode } from "react";
import type {
	PhotonInteractionSurfaceEditableFieldRenderer,
	PhotonInteractionSurfaceRenderer,
	PhotonInteractionSurfaceRendererProps,
} from "@init/photon/public";

export type AuthDialogRuntimeRenderer = (
	props: PhotonInteractionSurfaceRendererProps,
) => ReactNode;

export type AuthDialogContentConfig = {
	title?: string;
	description?: string;
	defaultMode?: "login" | "register";
	googleButtonLabel?: string;
	dividerLabel?: string;
	emailLabel?: string;
	emailPlaceholder?: string;
	passwordLabel?: string;
	passwordPlaceholder?: string;
	submitLabel?: string;
	forgotPasswordLabel?: string;
	termsLabel?: string;
	registerPromptLabel?: string;
	registerLinkLabel?: string;
	authenticatedTitle?: string;
	authenticatedDescription?: string;
	accountMenuLabel?: string;
	signOutLabel?: string;
};

const readString = (
	props: Record<string, unknown> | undefined,
	key: string,
): string | undefined => {
	const value = props?.[key];
	return typeof value === "string" ? value : undefined;
};

const resolveAuthDialogContentConfig = (
	base: Partial<AuthDialogContentConfig> | undefined,
	request: PhotonInteractionSurfaceRendererProps["request"],
): AuthDialogContentConfig => ({
	...(base ?? {}),
	title: readString(request.props, "title") ?? base?.title,
	description:
		readString(request.props, "description") ?? base?.description,
	defaultMode:
		request.props.defaultMode === "register" ||
		request.props.defaultMode === "login"
			? request.props.defaultMode
			: base?.defaultMode,
	googleButtonLabel:
		readString(request.props, "googleButtonLabel") ?? base?.googleButtonLabel,
	dividerLabel:
		readString(request.props, "dividerLabel") ?? base?.dividerLabel,
	emailLabel: readString(request.props, "emailLabel") ?? base?.emailLabel,
	emailPlaceholder:
		readString(request.props, "emailPlaceholder") ?? base?.emailPlaceholder,
	passwordLabel:
		readString(request.props, "passwordLabel") ?? base?.passwordLabel,
	passwordPlaceholder:
		readString(request.props, "passwordPlaceholder") ??
		base?.passwordPlaceholder,
	submitLabel: readString(request.props, "submitLabel") ?? base?.submitLabel,
	forgotPasswordLabel:
		readString(request.props, "forgotPasswordLabel") ??
		base?.forgotPasswordLabel,
	termsLabel: readString(request.props, "termsLabel") ?? base?.termsLabel,
	registerPromptLabel:
		readString(request.props, "registerPromptLabel") ??
		base?.registerPromptLabel,
	registerLinkLabel:
		readString(request.props, "registerLinkLabel") ?? base?.registerLinkLabel,
	authenticatedTitle:
		readString(request.props, "authenticatedTitle") ??
		base?.authenticatedTitle,
	authenticatedDescription:
		readString(request.props, "authenticatedDescription") ??
		base?.authenticatedDescription,
	accountMenuLabel:
		readString(request.props, "accountMenuLabel") ?? base?.accountMenuLabel,
	signOutLabel:
		readString(request.props, "signOutLabel") ?? base?.signOutLabel,
});

const FALLBACK = {
	title: "Sign in",
	description: "Sign in to continue.",
	googleButtonLabel: "Continue with Google",
	dividerLabel: "or continue with email",
	emailLabel: "Email",
	emailPlaceholder: "email@example.com",
	passwordLabel: "Password",
	passwordPlaceholder: "Password",
	submitLabel: "Sign in",
	submitLabelRegister: "Create account",
	forgotPasswordLabel: "Forgot password?",
	termsLabel:
		"By continuing you accept the Terms of Use and Privacy Policy.",
	registerPromptLabel: "No account yet?",
	registerLinkLabel: "Create one",
	authenticatedTitle: "Account",
	authenticatedDescription: "Manage your profile and sessions.",
	accountMenuLabel: "Account · profile menu",
	signOutLabel: "Sign out",
} as const;

const surfaceStyle = {
	borderColor: "var(--photon-builder-border)",
	background: "var(--photon-builder-panel-solid)",
	color: "var(--photon-builder-text)",
} as const;

const renderEditable = (
	editableField: PhotonInteractionSurfaceEditableFieldRenderer | undefined,
	path: string,
	value: string,
	fallback: string,
	kind: "text" | "textarea" = "text",
	className?: string,
): ReactNode =>
	editableField
		? editableField({ path, value, kind, placeholder: fallback, className })
		: (
			<span className={className}>{value || fallback}</span>
		);

const AuthDialogInlinePreview = ({
	config,
}: {
	config: AuthDialogContentConfig;
}) => (
	<div
		className="rounded-[22px] border p-4 text-sm"
		style={surfaceStyle}
		data-testid="photon-auth-dialog-inline-preview"
	>
		<div className="text-base font-semibold">
			{config.title ?? FALLBACK.title}
		</div>
		{config.description ? (
			<div
				className="mt-2 leading-6"
				style={{ color: "var(--photon-builder-text-muted)" }}
			>
				{config.description}
			</div>
		) : null}
		<div
			className="mt-4 rounded-full border px-3 py-2 text-xs font-semibold"
			style={{
				borderColor: "var(--photon-builder-border)",
				color: "var(--photon-builder-text-soft)",
			}}
		>
			{config.defaultMode === "register" ? "Register" : "Login"} mode
		</div>
	</div>
);

const AuthDialogCanvasStage = ({
	config,
	scenario,
	editableField,
}: {
	config: AuthDialogContentConfig;
	scenario: string;
	editableField:
		| PhotonInteractionSurfaceEditableFieldRenderer
		| undefined;
}) => {
	const isAuthenticated = scenario === "authenticated";
	const isLoading = scenario === "loading";
	const isError = scenario === "error";
	const submitFallback =
		config.defaultMode === "register"
			? FALLBACK.submitLabelRegister
			: FALLBACK.submitLabel;

	if (isLoading) {
		return (
			<div
				className="rounded-[22px] border p-5 text-sm"
				style={surfaceStyle}
				data-testid="photon-auth-dialog-canvas-stage-loading"
			>
				<div className="text-lg font-semibold">
					{renderEditable(
						editableField,
						"title",
						String(config.title ?? ""),
						FALLBACK.title,
					)}
				</div>
				<div
					className="mt-4 flex items-center justify-center rounded-[14px] border px-3 py-4 text-sm"
					style={surfaceStyle}
				>
					Loading session…
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div
				className="rounded-[22px] border p-5 text-sm"
				style={surfaceStyle}
				data-testid="photon-auth-dialog-canvas-stage-error"
			>
				<div className="text-lg font-semibold">
					{renderEditable(
						editableField,
						"title",
						String(config.title ?? ""),
						FALLBACK.title,
					)}
				</div>
				<div
					className="mt-4 rounded-[14px] border px-3 py-2 text-sm"
					style={surfaceStyle}
				>
					Authentication failed. Please try again.
				</div>
			</div>
		);
	}

	if (isAuthenticated) {
		return (
			<div
				className="rounded-[22px] border p-5 text-sm"
				style={surfaceStyle}
				data-testid="photon-auth-dialog-canvas-stage-authenticated"
			>
				<div className="text-lg font-semibold">
					{renderEditable(
						editableField,
						"authenticatedTitle",
						String(config.authenticatedTitle ?? ""),
						FALLBACK.authenticatedTitle,
					)}
				</div>
				<div
					className="mt-2 leading-6"
					style={{ color: "var(--photon-builder-text-muted)" }}
				>
					{renderEditable(
						editableField,
						"authenticatedDescription",
						String(config.authenticatedDescription ?? ""),
						FALLBACK.authenticatedDescription,
						"textarea",
					)}
				</div>
				<div className="mt-4 space-y-2">
					<div
						className="rounded-[14px] border px-3 py-2 text-sm"
						style={surfaceStyle}
					>
						{renderEditable(
							editableField,
							"accountMenuLabel",
							String(config.accountMenuLabel ?? ""),
							FALLBACK.accountMenuLabel,
						)}
					</div>
					<div
						className="rounded-[14px] border px-3 py-2 text-sm"
						style={surfaceStyle}
					>
						{renderEditable(
							editableField,
							"signOutLabel",
							String(config.signOutLabel ?? ""),
							FALLBACK.signOutLabel,
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className="rounded-[22px] border p-5 text-sm"
			style={surfaceStyle}
			data-testid="photon-auth-dialog-canvas-stage-guest"
		>
			<div className="text-lg font-semibold">
				{renderEditable(
					editableField,
					"title",
					String(config.title ?? ""),
					FALLBACK.title,
				)}
			</div>
			<div
				className="mt-2 leading-6"
				style={{ color: "var(--photon-builder-text-muted)" }}
			>
				{renderEditable(
					editableField,
					"description",
					String(config.description ?? ""),
					FALLBACK.description,
					"textarea",
				)}
			</div>
			<div
				className="mt-5 flex h-11 items-center justify-center gap-2 rounded-full border text-sm font-semibold"
				style={{
					borderColor: "var(--photon-builder-border)",
					background: "var(--photon-builder-panel-muted)",
					color: "var(--photon-builder-text)",
				}}
			>
				<span
					aria-hidden="true"
					style={{
						display: "inline-block",
						width: "18px",
						height: "18px",
						borderRadius: "50%",
						background:
							"conic-gradient(from 90deg at 50% 50%, #4285F4 0%, #DB4437 25%, #F4B400 50%, #0F9D58 75%, #4285F4 100%)",
					}}
				/>
				{renderEditable(
					editableField,
					"googleButtonLabel",
					String(config.googleButtonLabel ?? ""),
					FALLBACK.googleButtonLabel,
				)}
			</div>
			<div
				className="mt-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em]"
				style={{ color: "var(--photon-builder-text-soft)" }}
			>
				<div
					className="h-px flex-1"
					style={{ background: "var(--photon-builder-border)" }}
				/>
				<span>
					{renderEditable(
						editableField,
						"dividerLabel",
						String(config.dividerLabel ?? ""),
						FALLBACK.dividerLabel,
					)}
				</span>
				<div
					className="h-px flex-1"
					style={{ background: "var(--photon-builder-border)" }}
				/>
			</div>
			<div className="mt-4 space-y-3">
				<div className="space-y-1">
					<div
						className="text-xs font-semibold"
						style={{ color: "var(--photon-builder-text-muted)" }}
					>
						{renderEditable(
							editableField,
							"emailLabel",
							String(config.emailLabel ?? ""),
							FALLBACK.emailLabel,
						)}
					</div>
					<div
						className="rounded-[14px] border px-3 py-2 text-xs"
						style={{
							...surfaceStyle,
							color: "var(--photon-builder-text-soft)",
						}}
					>
						{renderEditable(
							editableField,
							"emailPlaceholder",
							String(config.emailPlaceholder ?? ""),
							FALLBACK.emailPlaceholder,
						)}
					</div>
				</div>
				<div className="space-y-1">
					<div
						className="flex items-center justify-between text-xs font-semibold"
						style={{ color: "var(--photon-builder-text-muted)" }}
					>
						<span>
							{renderEditable(
								editableField,
								"passwordLabel",
								String(config.passwordLabel ?? ""),
								FALLBACK.passwordLabel,
							)}
						</span>
						<span style={{ color: "var(--photon-builder-text-soft)" }}>
							{renderEditable(
								editableField,
								"forgotPasswordLabel",
								String(config.forgotPasswordLabel ?? ""),
								FALLBACK.forgotPasswordLabel,
							)}
						</span>
					</div>
					<div
						className="rounded-[14px] border px-3 py-2 text-xs"
						style={{
							...surfaceStyle,
							color: "var(--photon-builder-text-soft)",
						}}
					>
						{renderEditable(
							editableField,
							"passwordPlaceholder",
							String(config.passwordPlaceholder ?? ""),
							FALLBACK.passwordPlaceholder,
						)}
					</div>
				</div>
				<div
					className="mt-2 rounded-full border px-3 py-2 text-center text-sm font-semibold"
					style={{
						borderColor: "var(--photon-builder-border-strong)",
						background: "var(--photon-builder-accent-soft)",
						color: "var(--photon-builder-accent-text)",
					}}
				>
					{renderEditable(
						editableField,
						"submitLabel",
						String(config.submitLabel ?? ""),
						submitFallback,
					)}
				</div>
			</div>
			<div
				className="mt-5 text-center text-[10px] leading-5"
				style={{ color: "var(--photon-builder-text-soft)" }}
			>
				{renderEditable(
					editableField,
					"termsLabel",
					String(config.termsLabel ?? ""),
					FALLBACK.termsLabel,
					"textarea",
				)}
			</div>
			<div
				className="mt-3 text-center text-xs"
				style={{ color: "var(--photon-builder-text-muted)" }}
			>
				<span className="mr-1">
					{renderEditable(
						editableField,
						"registerPromptLabel",
						String(config.registerPromptLabel ?? ""),
						FALLBACK.registerPromptLabel,
					)}
				</span>
				<span style={{ color: "var(--photon-builder-accent-text)" }}>
					{renderEditable(
						editableField,
						"registerLinkLabel",
						String(config.registerLinkLabel ?? ""),
						FALLBACK.registerLinkLabel,
					)}
				</span>
			</div>
		</div>
	);
};

export type AuthDialogRendererOptions = {
	renderRuntimeDialog: AuthDialogRuntimeRenderer;
	baseConfig?: Partial<AuthDialogContentConfig>;
};

export const createAuthDialogSurfaceRenderer = ({
	renderRuntimeDialog,
	baseConfig,
}: AuthDialogRendererOptions): PhotonInteractionSurfaceRenderer => {
	const Renderer: PhotonInteractionSurfaceRenderer = ({
		open,
		onOpenChange,
		request,
		previewMode,
		previewScenarioId,
		editableField,
	}) => {
		const config = resolveAuthDialogContentConfig(baseConfig, request);

		if (previewMode === "builder-canvas-stage") {
			return (
				<AuthDialogCanvasStage
					config={config}
					scenario={previewScenarioId ?? "guest"}
					editableField={editableField}
				/>
			);
		}

		if (previewMode === "builder-inline") {
			return <AuthDialogInlinePreview config={config} />;
		}

		return renderRuntimeDialog({
			open,
			onOpenChange,
			request,
			previewMode,
			previewScenarioId,
			editableField,
		});
	};
	return Renderer;
};
