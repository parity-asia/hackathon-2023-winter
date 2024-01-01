import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import DAOCard from '../../components/components/DaoCard';
import Loader from '../../components/components/Loader';
import EmptyState from '../../components/components/EmptyState';
import useContract from '../../services/useContract';
import { Button } from '@heathmont/moon-core-tw';
import { ControlsPlus, GenericUsers } from '@heathmont/moon-icons-tw';
import CreateDaoModal from '../../features/CreateDaoModal';
import { usePolkadotContext } from '../../contexts/PolkadotContext';

export default function DAOs() {
  const { api, GetAllDaos } = usePolkadotContext();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDaoModal, setShowCreateDaoModal] = useState(false);

  const { contract } = useContract();

  useEffect(() => {
    fetchData();
  }, [contract, api]);

  async function fetchData() {
    if (contract && api) {
      setLoading(true);
      let arr = await GetAllDaos();

      setLoading(false);
      setList(arr.reverse());
    }
  }

  function closeModal(event) {
    if (event) {
      setShowCreateDaoModal(false);
    }
  }
  function openModal() {
    setShowCreateDaoModal(true);
  }

  return (
    <>
      <Head>
        <title>Communities</title>
        <meta name="description" content="DAO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`flex items-center flex-col gap-8`}>
        <div className={`gap-8 flex w-full bg-gohan pt-10 pb-6 border-beerus border`}>
          <div className="container flex w-full justify-between">
            <h1 className="text-moon-32 font-bold">All communities</h1>
            <Button iconLeft={<ControlsPlus />} onClick={openModal}>
              Create community
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8 container items-center pb-10">
          <Loader element={list.length > 0 ? list.map((listItem, index) => <DAOCard item={listItem} key={index} />) : <EmptyState icon={<GenericUsers className="text-moon-48" />} label="There are no communities created yet" />} loading={loading} width={768} height={236} many={3} type="rounded" />{' '}
        </div>
      </div>

      <CreateDaoModal open={showCreateDaoModal} onClose={closeModal} />
    </>
  );
}
