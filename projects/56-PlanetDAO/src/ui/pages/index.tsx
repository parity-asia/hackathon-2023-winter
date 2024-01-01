import { Button } from '@heathmont/moon-core-tw';
import Head from 'next/head';
import Image from 'next/legacy/image';
import styles from './Home.module.scss';
import { useState } from 'react';
import CreateDaoModal from '../features/CreateDaoModal';
import ActivityCard from '../components/components/ActivityCard';
import { useRouter } from 'next/router';

export default function Welcome() {
  const [showCreateDaoModal, setShowCreateDaoModal] = useState(false);
  const router = useRouter();

  function closeModal() {
    setShowCreateDaoModal(false);
  }

  function openModal() {
    if (window.localStorage.getItem('loggedin') === 'true') {
      setShowCreateDaoModal(true);
    } else {
      router.push('/login');
    }
  }

  return (
    <>
      <Head>
        <title>PlanetDAO</title>
        <meta name="description" content="PlanetDAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.section}>
        <div className={styles.text}>
          <div className={`${styles.logo}`}>
            <Image
              width={160}
              height={160}
              src="/home/logo-square-black.svg"
              alt=""
              style={{
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>
          <h1 className="text-moon-32 font-bold pt-2">Empower Your Community with Trust</h1>

          <p> Create your fair, transparent, and collaborative community by using PlanetDAO, a decentralized autonomous organization (DAO) as a service.</p>
          <p>PlanetDAO enables communities to govern themselves, make decisions collectively, have a transparency payments process and build trust-based ecosystems. Everything in just a couple clicks.</p>
          <p>Start your DAO today and give everyone in your community a voice!</p>

          <div>
            <Button onClick={openModal}>Create a DAO community</Button>
          </div>
        </div>
        <div className={styles.image}>
          <Image
            src={'/home/section-1-img.jpg'}
            alt=""
            layout="fill"
            objectFit="cover"
            sizes="100vw"
            style={{
              objectFit: 'cover'
            }}
          />
          <ActivityCard
            className="pointer-events-none"
            hideGoToButton
            type="idea"
            date={new Date('2023-12-17T18:29:14+0000')}
            data={{
              name: '@stevethijssen',
              goalTitle: 'Making the clubhouse more sustainable with natural materials',
              idea: {
                Title: 'Idea: Install solar panels on the clubhouse',
                votes: 57,
                donations: 3950,
                logo: '/home/feed-example.png'
              }
            }}
          />
        </div>
      </div>
      <div className={`${styles.section} ${styles['section-dark']}`}>
        <div className={styles.image}>
          <Image
            src={'/home/section-2-img.jpg'}
            alt=""
            layout="fill"
            objectFit="cover"
            sizes="100vw"
            style={{
              objectFit: 'cover'
            }}
          />
        </div>
        <div className={styles.text}>
          <div className={`${styles.logo}`}>
            <Image
              width={160}
              height={160}
              src="/home/logo-square-white.svg"
              alt=""
              style={{
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>
          <h1 className="text-moon-32 font-bold pt-2">Empower Your Community with Trust</h1>

          <p> Create your fair, transparent, and collaborative community by using PlanetDAO, a decentralized autonomous organization (DAO) as a service.</p>
          <p>PlanetDAO enables communities to govern themselves, make decisions collectively, have a transparency payments process and build trust-based ecosystems. Everything in just a couple clicks.</p>
          <p>Start your DAO today and give everyone in your community a voice!</p>

          <div>
            <Button onClick={openModal}>Create a DAO community</Button>
          </div>
        </div>
      </div>

      <CreateDaoModal open={showCreateDaoModal} onClose={closeModal} />
    </>
  );
}
