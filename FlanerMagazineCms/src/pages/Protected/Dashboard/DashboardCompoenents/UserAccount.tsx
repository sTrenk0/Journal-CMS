import React from "react";
import { MeUser } from "../Dashboard";

interface NavbarProps {
  user: MeUser | null;
}

const UserAccount: React.FC<NavbarProps> = ({ user }) => {
  return (
    <>
      <div className="font-bold text-2xl">
        <p>Your e-mail: {user?.email}</p>
        <p className="mt-2">Your account id: {user?.id}</p>
        <p className="mt-2">
          Admin privileges: {user?.is_superuser ? "True" : "False"}
        </p>
        <p className="mt-2">
          Active user: {user?.is_active ? "True" : "False"}
        </p>
      </div>
    </>
  );
};

export default UserAccount;
