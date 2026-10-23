import { LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authCopy, initials } from "@/lib/auth";
import { useAuth } from "./auth";

// Header account control: a sign-in button, or the visitor's avatar with a sign-out menu. Both share
// the same icon-button footprint, so restoring a session doesn't shift the header.
export function AccountMenu() {
  const { status, user, pending, warm, signIn, signOut } = useAuth();
  if (status === "disabled") return null;

  if (status === "signed-in" && user) {
    const label = user.name || user.email;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full"
            aria-label={`Account: ${label}`}
            title={label}
          >
            <Avatar className="size-7">
              {user.photoURL && (
                // Google profile photos refuse requests that carry a referrer.
                <AvatarImage
                  src={user.photoURL}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              )}
              <AvatarFallback className="text-xs font-semibold">
                {initials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel className="font-normal">
            {user.name && (
              <span className="block truncate text-sm font-semibold">
                {user.name}
              </span>
            )}
            {user.email && (
              <span className="block truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={signOut} disabled={pending}>
            <LogOut />
            {authCopy.signOut}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="shrink-0 rounded-full"
      aria-label={authCopy.signIn}
      title={authCopy.signIn}
      aria-busy={pending || status === "unknown"}
      disabled={pending}
      onPointerEnter={warm}
      onFocus={warm}
      onTouchStart={warm}
      onClick={signIn}
    >
      <UserRound />
    </Button>
  );
}
