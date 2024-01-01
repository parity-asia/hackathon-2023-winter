import { Avatar, Button, Dropdown, MenuItem } from '@heathmont/moon-core-tw';
import { GenericUser } from '@heathmont/moon-icons-tw';
import { useEffect, useState } from 'react';
import isServer from '../../../components/isServer';
import { getChain } from '../../../services/useContract';
import NavItem from '../../components/NavItem';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CreateDaoModal from '../../../features/CreateDaoModal';
import { usePolkadotContext } from '../../../contexts/PolkadotContext';

declare let window: any;
let running = false;

export function Nav(): JSX.Element {
  const { api, userInfo } = usePolkadotContext();
  const [acc, setAcc] = useState('');
  const [logo, setLogo] = useState('');
  const [user_id, setUser_id] = useState(-1);
  const [Balance, setBalance] = useState('');
  const [count, setCount] = useState(0);
  const [isSigned, setSigned] = useState(false);
  const [showCreateDaoModal, setShowCreateDaoModal] = useState(false);
  const [hasJoinedCommunities, setHasJoinedCommunities] = useState(true);

  const router = useRouter();

  async function fetchInfo() {
    if (typeof window.ethereum === 'undefined' && typeof window.injectedWeb3 === 'undefined') {
      running = false;
      return;
    }
    if (window.localStorage.getItem('login-type') === 'metamask') {
      if (window?.ethereum?.selectedAddress?.toLocaleLowerCase() != null && api && userInfo) {
        try {
          const Web3 = require('web3');
          const web3 = new Web3(window.ethereum);
          let Balance = await web3.eth.getBalance(window?.ethereum?.selectedAddress?.toLocaleLowerCase());

          let token = ' ' + getChain(Number(window.ethereum.networkVersion)).nativeCurrency.symbol;

          setAcc(userInfo.fullName.toString());
          setLogo(userInfo.imgIpfs.toString());
          setUser_id(window.userid);

          setBalance(Balance / 1e18 + token);

          if (!isSigned) setSigned(true);

          window.document.getElementById('withoutSign').style.display = 'none';
          window.document.getElementById('withSign').style.display = '';
          running = false;
          return;
        } catch (error) {
          console.error(error);
          running = false;
          return;
        }
      } else {
        running = false;
        return;
      }
    } else if (window.localStorage.getItem('login-type') === 'polkadot') {
      const { web3Accounts } = require('@polkadot/extension-dapp');
      try {
        let wallet = (await web3Accounts())[0];
        if (wallet && api && userInfo) {
          const { nonce, data: balance } = await api.query.system.account(wallet.address);
          setBalance(Number(balance.free.toString()) / 1e18 + ' MUNIT');
          if (!isSigned) setSigned(true);
          let subbing = 10;

          if (window.innerWidth > 500) {
            subbing = 20;
          }

          setAcc(userInfo?.fullName?.toString());
          setLogo(userInfo?.imgIpfs?.toString());
          setUser_id(window.userid);

          window.document.getElementById('withoutSign').style.display = 'none';
          window.document.getElementById('withSign').style.display = '';
          running = false;
          return;
        } else {
          running = false;
          return;
        }
      } catch (e) {
        running = false;
        return;
      }
    } else {
      setSigned(false);
      window.document.getElementById('withoutSign').style.display = '';
      window.document.getElementById('withSign').style.display = 'none';
    }
  }
  useEffect(() => {
    if (!running) {
      if (!isSigned || acc === '') {
        running = true;
        fetchInfo();
      }
    }
    if (acc !== '') {
      running = false;
    }
  }, [count]);

  setInterval(() => {
    if (!isServer()) {
      if (document.readyState === 'complete' && !running) {
        setCount(count + 1);
      }
    }
  }, 1000);

  function onClickDisConnect() {
    window.localStorage.setItem('loggedin', '');
    window.localStorage.setItem('login-type', '');
    window.location.href = '/';
  }

  function closeModal() {
    setShowCreateDaoModal(false);
  }
  function openModal() {
    setShowCreateDaoModal(true);
  }

  return (
    <>
      <nav className="main-nav w-full flex justify-between items-center">
        <ul className="flex justify-between items-center w-full">
          {isSigned && (
            <>
              {hasJoinedCommunities && <NavItem highlight={router.pathname.includes('/joined')} link="/joined" label="Joined communities" />}
              <NavItem highlight={router.pathname.includes('/daos')} link="/daos" label="Communities" />
              <NavItem label="Create Your Community" onClick={openModal} />
            </>
          )}

          <li className="Nav walletstatus flex flex-1 justify-end">
            <div className="py-2 px-4 flex gap-2 items-center" id="withoutSign">
              <Link href="/register">
                <Button variant="ghost" className="!text-white !bg-transparent w-32">
                  Register
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-dodoria w-32">Log in</Button>
              </Link>
            </div>

            <div id="withSign" className="wallets" style={{ display: 'none' }}>
              <div className="wallet" style={{ height: 48, display: 'flex', alignItems: 'center' }}>
                <div className="wallet__wrapper gap-4 flex items-center">
                  <div className="wallet__info flex flex-col items-end">
                    <a href={'/Profile/' + user_id} rel="noreferrer" className="text-primary max-w-[250px]">
                      <div className="font-medium text-whis truncate">{acc}</div>
                    </a>
                    <div className="text-goten font-semibold truncate">{Balance}</div>
                  </div>
                  <Dropdown value={null} onChange={null}>
                    <Dropdown.Trigger>
                      {logo !== '' ? (
                        <img src={'https://' + logo + '.ipfs.nftstorage.link'} alt="" className="rounded-full border-2 w-12 h-12 object-cover border-piccolo" />
                      ) : (
                        <Avatar size="lg" className="rounded-full border-2 border-piccolo ">
                          <GenericUser className="text-moon-24" />
                        </Avatar>
                      )}
                    </Dropdown.Trigger>

                    <Dropdown.Options className="bg-gohan w-48 min-w-0">
                      <Dropdown.Option>
                        <Link href={`/Profile/${user_id}`} passHref>
                          <MenuItem>Go to my profile</MenuItem>
                        </Link>
                      </Dropdown.Option>
                      <Dropdown.Option>
                        <MenuItem onClick={onClickDisConnect}>Log out</MenuItem>
                      </Dropdown.Option>
                    </Dropdown.Options>
                  </Dropdown>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <CreateDaoModal open={showCreateDaoModal} onClose={closeModal} />
    </>
  );
}
