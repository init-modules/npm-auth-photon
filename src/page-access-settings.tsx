"use client";

import type { PhotonPageSettingsPanelDefinition } from "@init/photon/public";
import { Button } from "@init/ui";
import {
	AUTH_PHOTON_PAGE_ACCESS_VALUES,
	type AuthPhotonPageAccess,
	readAuthPhotonPageAccess,
} from "./access";

const labels: Record<AuthPhotonPageAccess, string> = {
	public: "Public",
	authenticated: "Signed in only",
	guest: "Signed out only",
};

const descriptions: Record<AuthPhotonPageAccess, string> = {
	public: "Everyone can open this page.",
	authenticated: "Signed-out visitors are redirected to sign in.",
	guest: "Signed-in visitors are redirected away from auth pages.",
};

export const authPageAccessSettingsPanel: PhotonPageSettingsPanelDefinition = {
	key: "auth-access",
	scope: "page",
	label: "Auth access",
	description: "Control whether this route requires or rejects a signed-in user.",
	order: 30,
	component: ({ pageSettings, currentPage, setValue }) => {
		const currentAccess = readAuthPhotonPageAccess(
			pageSettings,
			currentPage?.route,
		);

		return (
			<div className="grid gap-2">
				{AUTH_PHOTON_PAGE_ACCESS_VALUES.map((access) => (
					<Button
						key={access}
						type="button"
						variant={currentAccess === access ? "default" : "outline"}
						className="h-auto justify-start rounded-2xl px-4 py-3 text-left"
						onClick={() => setValue("access.auth", access)}
					>
						<span>
							<span className="block text-sm font-semibold">
								{labels[access]}
							</span>
							<span className="block text-xs font-normal opacity-75">
								{descriptions[access]}
							</span>
						</span>
					</Button>
				))}
			</div>
		);
	},
};
