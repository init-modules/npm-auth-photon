import {
	definePhotonSiteFrameContribution,
	type PhotonSiteFrameContributionRenderProps,
	footerNavigationSlot,
	headerActionsSlot,
} from "@init/photon";
import { PhotonLink } from "@init/photon/public";
import { AuthHeaderAction } from "./auth-header-action";
import { hasAuthPhotonUser } from "./auth-resource";

/**
 * Phase B.1 NOTE: components below are minimal-viable to prove the new
 * contribution API end-to-end. Real locale-aware rendering and full
 * authentication-aware behavior matching legacy AuthHeaderAction will
 * land in Phase B.5 once site-header-shell rewires to useResolvedSlot.
 *
 * Until then the existing legacy `authPhotonSiteFrameExtension` (in
 * sdk.ts) remains the production renderer; these new contributions sit
 * alongside in the registry, exercised only by Phase A unit tests and
 * Phase B integration tests.
 */

const pickLocalized = (
	value: Record<string, string> | undefined,
	fallback: string,
): string => {
	if (!value) return fallback;
	return value.en ?? value.ru ?? Object.values(value)[0] ?? fallback;
};

type AuthLoginActionDefaults = {
	enabled?: boolean;
	order?: number;
	label?: Record<string, string>;
	href?: string;
	authenticatedLabel?: Record<string, string>;
	authenticatedHref?: string;
	dedupeKey?: string;
};

const AuthLoginActionComponent = (
	props: PhotonSiteFrameContributionRenderProps<AuthLoginActionDefaults>,
) => {
	if (hasAuthPhotonUser(props.context.resources)) {
		return (
			<PhotonLink href={props.authenticatedHref ?? "/account"}>
				<span>{pickLocalized(props.authenticatedLabel, "Account")}</span>
			</PhotonLink>
		);
	}
	return (
		<PhotonLink href={props.href ?? "/login"}>
			<span>{pickLocalized(props.label, "Sign in")}</span>
		</PhotonLink>
	);
};

export const authLoginContribution = definePhotonSiteFrameContribution({
	id: "auth.login",
	packageName: "auth-photon",
	slot: headerActionsSlot,
	defaults: {
		enabled: true,
		order: 100,
		label: { ru: "Войти", en: "Sign in" },
		href: "/login",
		authenticatedLabel: { ru: "Аккаунт", en: "Account" },
		authenticatedHref: "/account",
		dedupeKey: "auth:account",
	} satisfies AuthLoginActionDefaults,
	configurable: {
		enabled: { kind: "toggle", label: "Show sign-in / account action" },
		label: { kind: "localized-text", label: "Sign-in label" },
		order: { kind: "order" },
	},
	component: AuthLoginActionComponent,
});

type AuthFooterAccountColumnDefaults = {
	enabled?: boolean;
	order?: number;
	title?: Record<string, string>;
	links?: ReadonlyArray<{
		id: string;
		label: Record<string, string>;
		href: string;
	}>;
};

const AuthFooterAccountColumnComponent = (
	props: PhotonSiteFrameContributionRenderProps<AuthFooterAccountColumnDefaults>,
) => (
	<section>
		<h3>{pickLocalized(props.title, "Account")}</h3>
		<ul>
			{(props.links ?? []).map((link) => (
				<li key={link.id}>
					<PhotonLink href={link.href}>
						{pickLocalized(link.label, link.id)}
					</PhotonLink>
				</li>
			))}
		</ul>
	</section>
);

export const authFooterAccountColumnContribution =
	definePhotonSiteFrameContribution({
		id: "auth.footer-account-column",
		packageName: "auth-photon",
		slot: footerNavigationSlot,
		defaults: {
			enabled: true,
			order: 100,
			title: { ru: "Кабинет", en: "Account" },
			links: [
				{
					id: "auth.footer.login",
					label: { ru: "Войти", en: "Sign in" },
					href: "/login",
				},
				{
					id: "auth.footer.account",
					label: { ru: "Личный кабинет", en: "My account" },
					href: "/account",
				},
			],
		} satisfies AuthFooterAccountColumnDefaults,
		configurable: {
			enabled: { kind: "toggle", label: "Show Account footer column" },
			title: { kind: "localized-text", label: "Column title" },
			order: { kind: "order" },
		},
		component: AuthFooterAccountColumnComponent,
	});

/** Side-effect-free re-export until Phase B finale removes legacy. */
export { AuthHeaderAction };
