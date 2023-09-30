// import styles from './nav-bar.module.scss';
import { ModeToggle } from '@/components/theme-toggle/theme-toggle';
import Image from 'next/image';
// import logo from './logo-red.svg'

import UserAvatar from '@/components/user-avatar/user-avatar';

/* eslint-disable-next-line */
export interface NavBarProps {}

export function NavBar(props: NavBarProps) {
  return (
    <div className="container flex justify-between first-letter:w-full h-14 py-2 bg-primary fixed top-0 z-10">
      <Image
        src={'/logo-eset-monochromo.svg'}
        alt={'logo'}
        width={40}
        height={40}
      />
      <div className='flex flex-row gap-2 items-center'>
        <UserAvatar />
        <ModeToggle />
      </div>
    </div>
  );
}

export default NavBar;
