"use client";

import {
	createPhotonLocalizedDefault,
	definePhotonBlockDefinition,
	EditableText,
	EditableTextarea,
	usePhotonStore,
	type PhotonBlockComponentProps,
	type PhotonField,
} from "@init/photon/public";
import clsx from "clsx";

type AuthPageRoute =
	| "forgot-password"
	| "login"
	| "register"
	| "reset-password"
	| "verify-email";

type AuthPageBlockProps = {
	eyebrow: string;
	title: string;
	body: string;
	route: AuthPageRoute;
	actionLabel: string;
};

const fields: PhotonField[] = [
	{
		path: "eyebrow",
		label: "Eyebrow",
		kind: "text",
		group: "content",
		localization: "localized",
	},
	{
		path: "title",
		label: "Title",
		kind: "text",
		group: "content",
		localization: "localized",
	},
	{
		path: "body",
		label: "Body",
		kind: "textarea",
		group: "content",
		localization: "localized",
	},
	{
		path: "route",
		label: "Auth route",
		kind: "select",
		group: "layout",
		localization: "shared",
		options: [
			{ label: "Login", value: "login" },
			{ label: "Register", value: "register" },
			{ label: "Forgot password", value: "forgot-password" },
			{ label: "Reset password", value: "reset-password" },
			{ label: "Verify email", value: "verify-email" },
		],
	},
	{
		path: "actionLabel",
		label: "Fallback action label",
		kind: "text",
		group: "content",
		localization: "localized",
	},
];

export const AuthPageBlock = ({
	block,
}: PhotonBlockComponentProps<AuthPageBlockProps>) => {
	const renderAuthPage = usePhotonStore((state) => state.renderAuthPage);
	const requestAuth = usePhotonStore((state) => state.requestAuth);
	const renderedPage = renderAuthPage?.({ route: block.props.route });

	return (
		<section className="mx-auto grid w-full max-w-[var(--photon-site-max-width,1280px)] gap-8 px-[var(--photon-site-gutter,24px)] py-12 text-[var(--photon-site-text)] lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,28rem)] lg:items-start">
			<div className="max-w-3xl">
				<EditableText
					blockId={block.id}
					path="eyebrow"
					className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--photon-site-accent)]"
				/>
				<EditableText
					blockId={block.id}
					path="title"
					as="h1"
					className="mt-4 [font-family:var(--photon-site-heading-font)] text-5xl font-semibold"
				/>
				<EditableTextarea
					blockId={block.id}
					path="body"
					className="mt-4 max-w-2xl text-lg leading-8 text-[var(--photon-site-muted)]"
				/>
			</div>

			<div className="rounded-[calc(var(--photon-site-radius,24px)-4px)] border border-[var(--photon-site-border)] bg-[var(--photon-site-surface)] p-4 sm:p-6">
				{renderedPage ?? (
					<div className="grid gap-5">
						<div className="text-sm leading-7 text-[var(--photon-site-muted)]">
							Authentication UI is not configured for this runtime.
						</div>
						<button
							type="button"
							onClick={requestAuth}
							className={clsx(
								"inline-flex min-h-12 w-fit cursor-pointer items-center justify-center rounded-full bg-[var(--photon-site-accent)] px-5 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(15,118,110,0.28)] transition hover:translate-y-[-1px]",
							)}
						>
							<EditableText
								blockId={block.id}
								path="actionLabel"
								className="font-semibold text-white"
							/>
						</button>
					</div>
				)}
			</div>
		</section>
	);
};

export const authPageDefinition = definePhotonBlockDefinition({
	type: "auth-page",
	label: "Auth Page",
	description: "Photon-rendered authentication route content.",
	category: "Auth",
	icon: "log-in",
	defaults: {
		eyebrow: createPhotonLocalizedDefault({
			en: "Account access",
			ru: "Доступ к аккаунту",
		}),
		title: createPhotonLocalizedDefault({
			en: "Sign in",
			ru: "Войти",
		}),
		body: createPhotonLocalizedDefault({
			en: "Continue with your account to use protected website pages.",
			ru: "Продолжите с аккаунтом, чтобы открыть защищенные страницы сайта.",
		}),
		route: "login",
		actionLabel: createPhotonLocalizedDefault({
			en: "Continue",
			ru: "Продолжить",
		}),
	},
	fields,
	component: AuthPageBlock,
});
