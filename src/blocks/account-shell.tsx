"use client";

import clsx from "clsx";
import {
	EditableText,
	EditableTextarea,
	type WebsiteBuilderAccountTabExtension,
	type WebsiteBuilderBlockComponentProps,
	WebsiteBuilderLink,
	createWebsiteBuilderLocalizedDefault,
	defineWebsiteBuilderBlockDefinition,
	resolveWebsiteBuilderAccountTabs,
	useWebsiteBuilderStore,
	type WebsiteBuilderField,
} from "@init-modules/website-builder/public";

type AuthAccountShellProps = {
	eyebrow: string;
	title: string;
	body: string;
	signedOutTitle: string;
	signedOutBody: string;
	signInLabel: string;
	disabledTabIds?: string[];
};

type AuthAccountOverviewProps = {
	statusLabel: string;
};

const ACCOUNT_CONTENT_AREA_ID = "content";

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

const normalizeHref = (href: string | undefined) => {
	const path = (href ?? "/account").split("?")[0]?.split("#")[0]?.trim() ?? "";

	if (path === "") {
		return "/";
	}

	return path.startsWith("/") ? path : `/${path}`;
};

const isAccountTabActive = (
	tab: WebsiteBuilderAccountTabExtension,
	currentRoute: string,
) => {
	const normalizedRoute = normalizeHref(currentRoute);
	const fallbackHref = normalizeHref(tab.href);
	const match = tab.match ?? {
		type: fallbackHref === "/account" ? "exact" : "prefix",
		href: fallbackHref,
	};
	const matchHref = normalizeHref(match.href);

	if (match.type === "exact") {
		return normalizedRoute === matchHref;
	}

	return normalizedRoute === matchHref || normalizedRoute.startsWith(`${matchHref}/`);
};

const AccountTabIcon = ({ icon }: { icon?: string }) => {
	const commonProps = {
		"aria-hidden": true,
		className: "size-4 shrink-0",
		fill: "none",
		stroke: "currentColor",
		strokeLinecap: "round" as const,
		strokeLinejoin: "round" as const,
		strokeWidth: 1.8,
		viewBox: "0 0 24 24",
	};

	switch (icon) {
		case "receipt":
			return (
				<svg {...commonProps}>
					<path d="M4 3v18l2-1.2L8 21l2-1.2L12 21l2-1.2L16 21l2-1.2L20 21V3Z" />
					<path d="M8 8h8" />
					<path d="M8 12h8" />
					<path d="M8 16h5" />
				</svg>
			);
		case "shopping-bag":
			return (
				<svg {...commonProps}>
					<path d="M6 8h12l-1 12H7Z" />
					<path d="M9 8a3 3 0 0 1 6 0" />
				</svg>
			);
		case "user-round":
		default:
			return (
				<svg {...commonProps}>
					<circle cx="12" cy="8" r="4" />
					<path d="M5 21a7 7 0 0 1 14 0" />
				</svg>
			);
	}
};

export const AuthAccountShell = ({
	block,
	renderArea,
}: WebsiteBuilderBlockComponentProps<AuthAccountShellProps>) => {
	const accountTabs = useWebsiteBuilderStore((state) => state.accountTabs);
	const requestAuth = useWebsiteBuilderStore((state) => state.requestAuth);
	const authResource = useWebsiteBuilderStore((state) => state.resources.auth);
	const currentRoute = useWebsiteBuilderStore((state) => state.document.route);
	const user =
		typeof authResource === "object" && authResource !== null
			? (authResource as { user?: { email?: string; name?: string } | null }).user
			: null;
	const tabs = resolveWebsiteBuilderAccountTabs(
		accountTabs,
		normalizeStringItems(block.props.disabledTabIds),
	);
	const contentAreaIndex = (block.areas ?? []).findIndex(
		(area) => area.id === ACCOUNT_CONTENT_AREA_ID,
	);
	const contentArea =
		contentAreaIndex >= 0 ? block.areas?.[contentAreaIndex] : block.areas?.[0];
	const resolvedContentAreaIndex = contentAreaIndex >= 0 ? contentAreaIndex : 0;

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

			<div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
				<nav
					aria-label="Account"
					className="sticky top-6 flex h-fit flex-col gap-1 rounded-[calc(var(--wb-site-radius,24px)-4px)] border border-[var(--wb-site-border)] bg-[var(--wb-site-surface)] p-2"
				>
					{tabs.map((tab) => {
						const isActive = isAccountTabActive(tab, currentRoute);

						return (
							<WebsiteBuilderLink
								key={tab.id}
								href={tab.href ?? "/account"}
								aria-current={isActive ? "page" : undefined}
								className={clsx(
									"inline-flex min-h-11 items-center gap-3 rounded-[calc(var(--wb-site-radius,24px)-10px)] border px-3 py-2 text-sm font-semibold transition",
									isActive
										? "border-[color-mix(in_srgb,var(--wb-site-accent)_36%,var(--wb-site-border))] bg-[color-mix(in_srgb,var(--wb-site-accent)_12%,transparent)] text-[var(--wb-site-text)]"
										: "border-transparent text-[var(--wb-site-muted)] hover:bg-[color-mix(in_srgb,var(--wb-site-accent)_8%,transparent)] hover:text-[var(--wb-site-text)]",
								)}
							>
								<AccountTabIcon icon={tab.icon} />
								<span>{tab.label}</span>
							</WebsiteBuilderLink>
						);
					})}
				</nav>

				<div className="min-w-0">
					{user && contentArea && renderArea ? (
						renderArea(contentArea, resolvedContentAreaIndex)
					) : user ? (
						<div className="rounded-[calc(var(--wb-site-radius,24px)-4px)] border border-[var(--wb-site-border)] bg-[var(--wb-site-surface)] p-6">
							<div className="text-sm uppercase tracking-[0.22em] text-[var(--wb-site-muted)]">
								Signed in
							</div>
							<div className="mt-3 text-2xl font-semibold">
								{user.name ?? user.email}
							</div>
							<div className="mt-2 text-[var(--wb-site-muted)]">{user.email}</div>
						</div>
					) : (
						<div className="rounded-[calc(var(--wb-site-radius,24px)-4px)] border border-[var(--wb-site-border)] bg-[var(--wb-site-surface)] p-6">
							<div className="mb-5 max-w-xl text-[var(--wb-site-muted)]">
								<EditableTextarea
									blockId={block.id}
									path="signedOutBody"
									className="leading-7"
								/>
							</div>
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
				</div>
			</div>
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
	areas: [
		{
			id: ACCOUNT_CONTENT_AREA_ID,
			label: "Account content",
			blocks: [],
		},
	],
	fields,
	component: AuthAccountShell,
});

export const AuthAccountOverview = ({
	block,
}: WebsiteBuilderBlockComponentProps<AuthAccountOverviewProps>) => {
	const authResource = useWebsiteBuilderStore((state) => state.resources.auth);
	const user =
		typeof authResource === "object" && authResource !== null
			? (authResource as { user?: { email?: string; name?: string } | null }).user
			: null;

	return (
		<div className="rounded-[calc(var(--wb-site-radius,24px)-4px)] border border-[var(--wb-site-border)] bg-[var(--wb-site-surface)] p-6">
			<EditableText
				blockId={block.id}
				path="statusLabel"
				className="text-sm uppercase tracking-[0.22em] text-[var(--wb-site-muted)]"
			/>
			<div className="mt-3 text-2xl font-semibold">
				{user?.name ?? user?.email ?? "Account"}
			</div>
			{user?.email ? (
				<div className="mt-2 text-[var(--wb-site-muted)]">{user.email}</div>
			) : null}
		</div>
	);
};

export const authAccountOverviewDefinition = defineWebsiteBuilderBlockDefinition({
	type: "auth-account-overview",
	label: "Auth Account Overview",
	description: "Signed-in account overview card for the account shell.",
	category: "Auth",
	icon: "user-round",
	defaults: {
		statusLabel: createWebsiteBuilderLocalizedDefault({
			en: "Signed in",
			ru: "Вы вошли",
		}),
	},
	fields: [
		{
			path: "statusLabel",
			label: "Status label",
			kind: "text",
			group: "content",
			localization: "localized",
		},
	],
	component: AuthAccountOverview,
});
