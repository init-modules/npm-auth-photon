import type { PhotonPageSettings } from "@init/photon/public";

export type AuthPhotonPageAccess = "authenticated" | "guest" | "public";

export const AUTH_PHOTON_PAGE_ACCESS_VALUES: AuthPhotonPageAccess[] = [
	"public",
	"authenticated",
	"guest",
];

const normalizePath = (path: string | undefined) => {
	const normalized = (path ?? "/").split("?")[0]?.split("#")[0]?.trim() ?? "/";

	if (normalized === "") {
		return "/";
	}

	return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

export const isAuthPhotonAccountPath = (path: string | undefined) => {
	const normalized = normalizePath(path);

	return normalized === "/account" || normalized.startsWith("/account/");
};

export const isAuthPhotonGuestPath = (path: string | undefined) => {
	const normalized = normalizePath(path);

	return [
		"/forgot-password",
		"/login",
		"/register",
		"/reset-password",
		"/verify-email",
	].includes(normalized);
};

const readObject = (value: unknown): Record<string, unknown> =>
	typeof value === "object" && value !== null
		? (value as Record<string, unknown>)
		: {};

export const readAuthPhotonPageAccess = (
	pageSettings: PhotonPageSettings | undefined,
	path: string | undefined,
): AuthPhotonPageAccess => {
	const page = readObject(pageSettings?.page);
	const access = readObject(page.access);
	const authAccess = access.auth;

	if (
		typeof authAccess === "string" &&
		AUTH_PHOTON_PAGE_ACCESS_VALUES.includes(authAccess as AuthPhotonPageAccess)
	) {
		return authAccess as AuthPhotonPageAccess;
	}

	if (isAuthPhotonAccountPath(path)) {
		return "authenticated";
	}

	if (isAuthPhotonGuestPath(path)) {
		return "guest";
	}

	return "public";
};
