import Image from "next/legacy/image";
import { Nav } from '../Nav';
import styles from './Header.module.scss';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className={`w-full px-8 py-4 gap-4 flex justify-between z-1 ${styles.header}`}>
      <Link href="/">
        <div className={`inline-flex ${styles.logo}`}>
          <Image
            height={48}
            width={119}
            src="/images/logo.svg"
            alt="planetDAO"
            style={{
              maxWidth: '119px',
              height: 'auto'
            }}
          />
        </div>
      </Link>
      <Nav />
    </header>
  );
};

export default Header;
