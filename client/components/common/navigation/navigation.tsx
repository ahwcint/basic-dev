'use client';

import { HomeIcon, Inbox, LogOut, RefreshCcw } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import { changeRoleUser } from '@/services/auth.service';
import { UserRole } from '@/services/types/user.type';
import { toast } from 'sonner';
import { NavigationList } from './navigation-list';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  if (!user || pathname.startsWith('/auth')) return null;

  const switchRoleCase = {
    [UserRole.USER]: UserRole.ADMIN,
    [UserRole.ADMIN]: UserRole.USER,
  };

  const handleChangeRoleUser = async () => {
    const res = await changeRoleUser(user.id, switchRoleCase[user.role]);
    if (!res.success) return;

    toast.success(`${res.message} to ${res.data.role}`);
  };

  const handleLogOut = () => {
    logout(true);
  };

  return (
    <nav className={'h-full basis-[15rem] shrink-0 border-r bg-background p-1'}>
      <NavigationList
        data={[
          {
            to: 'home',
            active: 'home',
            rolesAccess: [UserRole.ADMIN],
            icon: <HomeIcon size={'1.2rem'} />,
            label: 'Home',
          },
          {
            to: 'history',
            active: 'history',
            rolesAccess: [UserRole.ADMIN],
            icon: <Inbox size={'1.2rem'} />,
            label: 'History',
          },
          {
            onClick: handleChangeRoleUser,
            icon: <RefreshCcw size={'1.2rem'} />,
            label: `Switch to ${switchRoleCase[user.role].toLowerCase()}`,
          },
          {
            className: 'mt-auto mb-[1rem]',
            onClick: handleLogOut,
            icon: <LogOut size={'1.2rem'} />,
            label: 'Logout',
          },
        ]}
        currentRole={user.role}
      />
    </nav>
  );
}
