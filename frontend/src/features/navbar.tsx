'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react';
import { User, Settings, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const ADMIN_ITEMS = [
  { name: 'Accueil', href: '/' },
  { name: 'Coaches', href: '/coaches' },
  { name: 'Clients', href: '/customers' },
  { name: 'Astuces', href: '/tips' },
  { name: 'Évènements', href: '/events' },
  { name: 'Compatibilité', href: '/compatibility' },
  { name: 'Garde-robe', href: '/wardrobe' },
  { name: 'Blog', href: '/blog' },
];

const COACH_ITEMS = [
  { name: 'Accueil', href: '/' },
  { name: 'Coaches', href: '/coaches' },
  { name: 'Clients', href: '/customers' },
  { name: 'Astuces', href: '/tips' },
  { name: 'Évènements', href: '/events' },
  { name: 'Compatibilité', href: '/compatibility' },
  { name: 'Garde-robe', href: '/wardrobe' },
  { name: 'Blog', href: '/blog' },
];

const FINANCE_ITEMS = [
  { name: 'Accueil', href: '/' },
  { name: 'Clients', href: '/customers' },
];

interface NavBarProps {
  role: string;
}

function isActive(href: string, pathname: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function NavBar(props: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const session = useSession();

  const items = props.role === 'admin' ? ADMIN_ITEMS : props.role === 'coach' ? COACH_ITEMS : FINANCE_ITEMS;

  return (
    <Navbar
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        item: [
          'flex',
          'relative',
          'h-full',
          'items-center',
          "data-[active=true]:after:content-['']",
          'data-[active=true]:after:absolute',
          'data-[active=true]:after:bottom-0',
          'data-[active=true]:after:left-0',
          'data-[active=true]:after:right-0',
          'data-[active=true]:after:h-[2px]',
          'data-[active=true]:after:rounded-[2px]',
          'data-[active=true]:after:bg-primary',
        ],
      }}
    >
      {/* Toggle button and Brand */}
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="lg:hidden" />
        <NavbarBrand>
          <Link href="/">
            <h1 className="font-bold text-inherit text-xl cursor-pointer">Soul Connection</h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Menu items */}
      <NavbarContent className="hidden lg:flex gap-5" justify="center">
        {items.map((item) => (
          <NavbarItem key={item.href} isActive={isActive(item.href, pathname)}>
            <Link
              as={NextLink}
              href={item.href}
              aria-current={isActive(item.href, pathname) ? 'page' : undefined}
              color={!isActive(item.href, pathname) ? 'foreground' : undefined}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Profile buttons */}
      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform"
              name={session.data?.user.name ?? 'Coach'}
              size="sm"
              src={session.data?.user.image ? `${process.env.NEXT_PUBLIC_API_URL}${session.data?.user.image}` : ''}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="profile"
              startContent={<User className="text-xl text-default-500 pointer-events-none flex-shrink-0" />}
            >
              <p className="font-semibold">{session.data?.user.name ?? 'Coach'}</p>
            </DropdownItem>
            <DropdownItem
              key="settings"
              startContent={<Settings className="text-xl text-default-500 pointer-events-none flex-shrink-0" />}
            >
              Paramètres
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              onClick={async (e) => {
                e.preventDefault();
                await signOut({ callbackUrl: '/login' });
              }}
              startContent={<LogOut className="text-xl text-danger pointer-events-none flex-shrink-0" />}
            >
              <p className="text-danger">Déconnexion</p>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu>
        {items.map((item) => (
          <NavbarMenuItem key={item.href}>
            <Link
              as={NextLink}
              color={isActive(item.href, pathname) ? 'primary' : 'foreground'}
              className="w-full"
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
