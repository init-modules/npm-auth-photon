import type { PhotonResources } from "@init/photon/public";

export type AuthPhotonUserResource = Record<string, unknown>;

export type AuthPhotonResource = {
	user?: AuthPhotonUserResource | null;
};

export const selectAuthPhotonResource = (
	resources: PhotonResources,
): AuthPhotonResource | null => {
	const auth = resources.auth;

	return typeof auth === "object" && auth !== null && !Array.isArray(auth)
		? (auth as AuthPhotonResource)
		: null;
};

export const selectAuthPhotonUser = (
	resources: PhotonResources,
): AuthPhotonUserResource | null =>
	selectAuthPhotonResource(resources)?.user ?? null;

export const hasAuthPhotonUser = (resources: PhotonResources) =>
	Boolean(selectAuthPhotonUser(resources));
