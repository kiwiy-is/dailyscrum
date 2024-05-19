import React from "react";
import AccountSettingsDialog from "./account-settings-dialog";
import { getCurrentUser } from "@/services/users";
import { getCurrentUserProfile } from "@/services/profiles";

type Props = {};

const AccountSettingsDialogLoader = async (props: Props) => {
  const { data: user, error: getCurrentUserError } = await getCurrentUser();
  const { data: profile, error: getCurrentUserProfileError } =
    await getCurrentUserProfile();

  if (getCurrentUserError || getCurrentUserProfileError || !user || !profile) {
    return null;
  }

  const email = user.email ?? "";
  const name = profile.name;

  return <AccountSettingsDialog email={email} name={name} />;
};

export default AccountSettingsDialogLoader;
