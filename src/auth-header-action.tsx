"use client";

import {
	PhotonLink,
	type PhotonSiteFrameActionComponentProps,
} from "@init/photon/public";
import { hasAuthPhotonUser } from "./auth-resource";

export const AuthHeaderAction = ({
	action,
	className,
	context,
	executeInteractionAction,
	executeInteractionTriggerSlot,
}: PhotonSiteFrameActionComponentProps) => {
	if (hasAuthPhotonUser(context.resources)) {
		return (
			<PhotonLink
				href={action.authenticatedHref ?? "/account"}
				target={action.authenticatedTarget}
				rel={action.authenticatedRel}
				className={className}
			>
				<span>{action.authenticatedLabel ?? "Account"}</span>
			</PhotonLink>
		);
	}

	return (
		<button
			type="button"
			onClick={() => {
				if (!executeInteractionTriggerSlot || !action.triggerSlot) {
					executeInteractionAction?.(action.action);
					return;
				}

				executeInteractionTriggerSlot({
					...action.triggerSlot,
					action:
						action.triggerSlot.action ??
						action.action ??
						(action.interaction
							? {
									type: "surface",
									...action.interaction,
								}
							: undefined),
				});
			}}
			className={className}
		>
			<span>{action.label}</span>
		</button>
	);
};
