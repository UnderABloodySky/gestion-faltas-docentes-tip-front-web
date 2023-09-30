'use client';
// import styles from './user-avatar.module.scss';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-context';
// import { UserCircle2 } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  // DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCallback, useEffect } from 'react';

/* eslint-disable-next-line */
export interface UserAvatarProps {}

function getInitialsCapitalized(fullName: string) {
  const words = fullName.split(' ');
  const initials = words.map((word) => word.charAt(0).toUpperCase());
  return initials.join('');
}

export function UserAvatar(props: UserAvatarProps) {
  const pathName = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const isLoginPage = pathName === '/';

  const redirectToLogin = useCallback(() => {
    router.push('/');
  }, [router])

  const handleLogout = useCallback(() => {
    logout();
  }, [logout])

  useEffect(() => {
    // handle redirect to login screen when the user is not loged in
    // TODO: move this to useAuth or a specific component to handle generic stuff
    if (!user && !isLoginPage) {
      redirectToLogin();
    }
  }, [user, isLoginPage, redirectToLogin])

  const userNameInitials = user?.name && getInitialsCapitalized(user.name)

  return isLoginPage ? null : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatar.png" alt="@walter_white" />
            <AvatarFallback>{userNameInitials || 'FC'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            Contacto
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Desloguear
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAvatar;