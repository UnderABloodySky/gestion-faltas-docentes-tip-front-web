'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export function LogoNavigate() {
  const pathName = usePathname();
  const router = useRouter();

  const redirect = () => {
    if (pathName === '/manage-absences') {
      router.push('/absence');
    } else {
      router.push('/manage-absences');
    }
  };
  return (
    <Image
      src={'/logo-eset-monochromo.svg'}
      alt={'logo'}
      width={40}
      height={40}
      onClick={redirect}
    />
  );
}

export default LogoNavigate;
