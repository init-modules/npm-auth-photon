"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import {
	EditableText,
	EditableTextarea,
	type WebsiteBuilderBlockComponentProps,
	WebsiteBuilderLink,
	createWebsiteBuilderLocalizedDefault,
	defineWebsiteBuilderBlockDefinition,
	resolveWebsiteBuilderAccountTabs,
	useWebsiteBuilderStore,
	type WebsiteBuilderField,
} from "@init-modules/website-builder";

type AuthAccountShellProps = {
	eyebrow: string;
	title: string;
	body: string;
	signedOutTitle: string;
	signedOutBody: string;
	signInLabel: string;
	disabledTabIds?: string[];
};

const fields: WebsiteBuilderField[] = [
	{ path: "eyebrow", label: "Eyebrow", kind: "text", group: "content", localization: "localized" },
	{ path: "title", label: "Title", kind: "text", group: "content", localization: "localized" },
	{ path: "body", label: "Body", kind: "textarea", group: "content", localization: "localized" },
	{ path: "signedOutTitle", label: "Signed out title", kind: "text", group: "content", localization: "localized" },
	{ path: "signedOutBody", label: "Signed out body", kind: "textarea", group: "content", localization: "localized" },
	{ path: "signInLabel", label: "Sign-in label", kind: "text", group: "content", localization: "localized" },
	{
		path: "disabledTabIds",
		label: "Disabled account tab ids",
		kind: "tags",
		group: "layout",
		localization: "shared",
	},
];

const normalizeStringItems = (value: unknown): string[] =>
	Array.isArray(value)
		? value.flatMap((item) =>
				typeof item === "string" && item.trim() ? [item.trim()] : [],
			)
		: [];

export const AuthAccountShell = ({
	block,
}: WebsiteBuilderBlockComponentProps<AuthAccountShellProps>) => {
	const accountTabs = useWebsiteBuilderStore((state) => state.accountTabs);
	const mode = useWebsiteBuilderStore((state) => state.mode);
	const requestAuth = useWebsiteBuilderStore((state) => state.requestAuth);
	const authResource = useWebsiteBuilderStore((state) => state.resources.auth);
	const requestedAuthRef = useRef(false);
	const user =
		typeof authResource === "object" && authResource !== null
			? (authResource as { user?: { email?: string; name?: string } | null }).user
			: null;
	const tabs = resolveWebsiteBuilderAccountTabs(
		accountTabs,
		normalizeStringItems(block.props.disabledTabIds),
	);

	useEffect(() => {
		if (mode !== "preview" || user || requestedAuthRef.current) {
			return;
		}

		requestedAuthRef.current = true;
		requestAuth?.();
	}, [mode, requestAuth, user]);

	return (
		<section className="mx-auto grid w-full max-w-[var(--wb-site-max-width,1280px)] gap-8 px-[var(--wb-site-gutter,24px)] py-12 text-[var(--wb-site-text)]">
			<div className="max-w-3xl">
				<EditableText
					blockId={block.id}
					path="eyebrow"
					className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--wb-site-accent)]"
				/>
				<EditableText
					blockId={block.id}
					path={user ? "title" : "signedOutTitle"}
					as="h1"
					className="mt-4 [font-family:var(--wb-site-heading-font)] text-5xl font-semibold tracking-[-0.05em]"
				/>
				<EditableTextarea
					blockId={block.id}
					path={user ? "body" : "signedOutBody"}
					className="mt-4 max-w-2xl text-lg leading-8 text-[var(--wb-site-muted)]"
				/>
			</div>

			{user ? (
				<div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
					<nav className="flex flex-col gap-2 rounded-[calc(var(--wb-site-radius,24px)-4px)] border border-[var(--wb-site-border)] bg-[var(--wb-site-surface)] p-3">
						{tabs.map((tab) => (
							<WebsiteBuilderLink
								key={tab.id}
								href={tab.href ?? "/account"}
								className="rounded-[calc(var(--wb-site-radius,24px)-10px)] px-4 py-3 text-sm font-semibold text-[var(--wb-site-text)] transition hover:bg-[color-mix(in_srgb,var(--wb-site-accent)_10%,transparent)] hover:text-[var(--wb-site-accent)]"
							>
								{tab.label}
							</WebsiteBuilderLink>
						))}
					</nav>
					<div className="rounded-[calc(var(--wb-site-radius,24px)-4px)] border border-[var(--wb-site-border)] bg-[var(--wb-site-surface)] p-6">
						<div className="text-sm uppercase tracking-[0.22em] text-[var(--wb-site-muted)]">
							Signed in
						</div>
						<div className="mt-3 text-2xl font-semibold">
							{user.name ?? user.email}
						</div>
						<div className="mt-2 text-[var(--wb-site-muted)]">{user.email}</div>
					</div>
				</div>
			) : (
				<div className="rounded-[calc(var(--wb-site-radius,24px)-4px)] border border-[var(--wb-site-border)] bg-[var(--wb-site-surface)] p-6">
					<button
						type="button"
						onClick={requestAuth}
						className={clsx(
							"inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-[var(--wb-site-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(15,118,110,0.28)] transition hover:translate-y-[-1px]",
						)}
					>
						<EditableText
							blockId={block.id}
							path="signInLabel"
							className="font-semibold text-white"
						/>
					</button>
				</div>
			)}
		</section>
	);
};

export const authAccountShellDefinition = defineWebsiteBuilderBlockDefinition({
	type: "auth-account-shell",
	label: "Auth Account Shell",
	description:
		"Editable account page shell with package-registerable account tabs.",
	category: "Auth",
	icon: "user-round",
	defaults: {
		eyebrow: createWebsiteBuilderLocalizedDefault({
			en: "Account",
			ru: "Личный кабинет",
		}),
		title: createWebsiteBuilderLocalizedDefault({
			en: "Manage your account",
			ru: "Управляйте аккаунтом",
		}),
		body: createWebsiteBuilderLocalizedDefault({
			en: "Review profile details and open package-provided workspace tabs.",
			ru: "Проверьте данные профиля и откройте вкладки, которые предоставляют пакеты.",
		}),
		signedOutTitle: createWebsiteBuilderLocalizedDefault({
			en: "Sign in to continue",
			ru: "Войдите, чтобы продолжить",
		}),
		signedOutBody: createWebsiteBuilderLocalizedDefault({
			en: "Your account page is available after authentication.",
			ru: "Личный кабинет доступен после авторизации.",
		}),
		signInLabel: createWebsiteBuilderLocalizedDefault({
			en: "Sign in",
			ru: "Войти",
		}),
		disabledTabIds: [],
	},
	fields,
	component: AuthAccountShell,
});
