"use client"

import { authClient } from "~/lib/auth-client";
import Image from "next/image";
import { User } from "better-auth/types";
import { useRouter } from "next/navigation";

type UserProfileProps = {
  user: User;
};

export const UserProfile = ({ user }: UserProfileProps) => {
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="absolute top-4 right-4 flex items-center gap-3 rounded-full bg-white/10 p-2 px-4">
      <div className="flex flex-col items-end">
        <span className="font-medium">{user.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-purple-300 hover:text-purple-200"
        >
          Log out
        </button>
      </div>
      {user.image && (
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}; 