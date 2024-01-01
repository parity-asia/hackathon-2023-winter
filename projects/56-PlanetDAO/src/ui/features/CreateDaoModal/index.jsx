import { Button, Checkbox, IconButton, Modal } from '@heathmont/moon-core-tw';
import { ControlsClose, ControlsPlus, GenericPicture } from '@heathmont/moon-icons-tw';
import { useRouter } from 'next/router';
import { NFTStorage } from 'nft.storage';
import React, { useEffect, useState } from 'react';
import UseFormInput from '../../components/components/UseFormInput';
import UseFormTextArea from '../../components/components/UseFormTextArea';
import useContract from '../../services/useContract';
import { usePolkadotContext } from '../../contexts/PolkadotContext';

import isServer from '../../components/isServer';
import AddImageInput from '../../components/components/AddImageInput';
import ImageListDisplay from '../../components/components/ImageListDisplay';
import { toast } from 'react-toastify';

let addedDate = false;
export default function CreateDaoModal({ open, onClose }) {
  const [DaoImage, setDaoImage] = useState([]);
  const [creating, setCreating] = useState(false);

  const { api, showToast, userWalletPolkadot, userSigner, PolkadotLoggedIn } = usePolkadotContext();
  const { contract, sendTransaction, formatTemplate, signerAddress } = useContract();

  //Storage API for images and videos
  const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJDMDBFOGEzZEEwNzA5ZkI5MUQ1MDVmNDVGNUUwY0Q4YUYyRTMwN0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDQ3MTgxOTY2NSwibmFtZSI6IlplbmNvbiJ9.6znEiSkiLKZX-a9q-CKvr4x7HS675EDdaXP622VmYs8';
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  //Input fields
  const [DaoTitle, DaoTitleInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Add name',
    id: ''
  });

  const [DaoDescription, DaoDescriptionInput] = UseFormTextArea({
    defaultValue: '',
    placeholder: 'Add Description',
    id: '',
    rows: 4
  });

  const [StartDate, StartDateInput, setStartDate] = UseFormInput({
    defaultValue: '',
    type: 'date',
    placeholder: 'Start date',
    id: 'startdate'
  });
  const [RecieveWallet, RecieveWalletInput, setRecieveWallet] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: 'Wallet Address (EVM)',
    id: 'recipient'
  });

  const [SubsPrice, SubsPriceInput] = UseFormInput({
    defaultValue: '',
    type: 'text',
    placeholder: '0.00',
    id: 'subs_price'
  });

  useEffect(() => {
    let dateTime = new Date();
    if (!PolkadotLoggedIn) {
      setRecieveWallet(signerAddress);
    }
    if (!addedDate) setStartDate(dateTime.toISOString().split('T')[0]);
  }, []);

  //Downloading plugin function
  function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  if (!isServer()) {
    CheckTransaction();
  }

  async function CheckTransaction() {
    let params = new URL(window.location).searchParams;
    if (params.get('transactionHashes') !== null) {
      window.location.href = '/daos';
    }
  }

  //Function after clicking Create Dao Button
  async function createDao() {
    const id = toast.loading('Uploading IPFS ...');
    setCreating(true);

    var CreateDAOBTN = document.getElementById('CreateDAOBTN');
    CreateDAOBTN.disabled = true;
    let allFiles = [];
    for (let index = 0; index < DaoImage.length; index++) {
      //Gathering all files link
      const element = DaoImage[index];
      const metadata = await client.storeBlob(element);
      const urlImageDao = {
        url: 'https://' + metadata + '.ipfs.nftstorage.link',
        type: element.type
      };
      allFiles.push(urlImageDao);
    }

    //Creating an object of all information to store in EVM
    const createdObject = {
      title: 'Asset Metadata',
      type: 'object',
      properties: {
        Title: {
          type: 'string',
          description: DaoTitle
        },
        Description: {
          type: 'string',
          description: DaoDescription
        },
        Start_Date: {
          type: 'string',
          description: StartDate
        },
        logo: {
          type: 'string',
          description: allFiles[0]
        },
        wallet: {
          type: 'string',
          description: RecieveWallet
        },
        user_id: {
          type: 'string',
          description: window.userid
        },
        SubsPrice: {
          type: 'number',
          description: SubsPrice
        },
        typeimg: {
          type: 'string',
          description: 'Dao'
        },
        allFiles
      }
    };
    console.log('======================>Creating Dao');

    var template = await (await fetch(`/template/template.html`)).text();

    let changings = [
      {
        key: 'dao-title',
        value: DaoTitle
      },
      {
        key: 'dao-image',
        value: allFiles[0].url
      }
    ];
    let formatted_template = formatTemplate(template, changings);

    toast.update(id, { render: 'Creating Dao...', isLoading: true });

    if (PolkadotLoggedIn) {
      await api._extrinsics.daos.createDao(userWalletPolkadot, JSON.stringify(createdObject), formatted_template).signAndSend(userWalletPolkadot, { signer: userSigner }, (status) => {
        showToast(status, id, 'Created Successfully!', onClose);
      });
    } else {
      try {
        // Creating Dao in Smart contract from metamask chain
        await sendTransaction(await window.contract.populateTransaction.create_dao(window.signerAddress, JSON.stringify(createdObject), formatted_template, Number(window.userid)));
        toast.update(id, {
          render: 'Created Successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
          closeOnClick: true,
          draggable: true
        });

        setCreating(false);
        onClose({ success: true });
        window.setTimeout(()=>{window.location.reload()},1000)
      } catch (error) {
        console.error(error);
        setCreating(false);

        return;
      }
    }

  }

  function FilehandleChange(dao) {
    var allNames = [];
    for (let index = 0; index < dao.target.files.length; index++) {
      const element = dao.target.files[index].name;
      allNames.push(element);
    }
    for (let index2 = 0; index2 < dao.target.files.length; index2++) {
      setDaoImage((pre) => [...pre, dao.target.files[index2]]);
    }
  }

  function AddBTNClick() {
    var DaoImagePic = document.getElementById('DaoImage');
    DaoImagePic.click();
  }

  function CreateDaoBTN() {
    return (
      <>
        <div className="flex gap-4 justify-end">
          <Button id="CreateDAOBTN" animation={creating && 'progress'} disabled={creating} onClick={createDao}>
            <ControlsPlus className="text-moon-24" />
            Create Dao
          </Button>
        </div>
      </>
    );
  }

  function DeleteSelectedImages(idImage) {
    var newImages = [];
    var allUploadedImages = document.getElementsByName('deleteBTN');
    for (let index = 0; index < DaoImage.length; index++) {
      if (index != idImage) {
        const elementDeleteBTN = allUploadedImages[index];
        elementDeleteBTN.setAttribute('id', newImages.length.toString());
        const element = DaoImage[index];
        newImages.push(element);
      }
    }
    setDaoImage(newImages);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="bg-gohan w-[90%] max-w-[600px] max-h-[95vh]">
        <div className="flex items-center justify-center flex-col">
          <div className="flex justify-between items-center w-full border-b border-beerus py-4 px-6">
            <h1 className="text-moon-20 font-semibold">Create community</h1>
            <IconButton className="text-trunks" variant="ghost" icon={<ControlsClose />} onClick={onClose} />
          </div>
          <div className="flex flex-col gap-6 w-full p-6 max-h-[calc(90vh-162px)] overflow-auto">
            <div className="flex flex-col gap-2">
              <h6>Community name</h6>
              {DaoTitleInput}
            </div>

            <div className="flex flex-col gap-2">
              <h6>Description</h6>
              {DaoDescriptionInput}
            </div>
            <div className="flex flex-col gap-2">
              <h6>Recipeint</h6>
              {RecieveWalletInput}
            </div>
            <div className="flex flex-col gap-2">
              <h6>Start Date</h6>
              {StartDateInput}
            </div>

            <div className="flex flex-col gap-2">
              <h6>Monthly subscription in USD</h6>
              {SubsPriceInput}
            </div>

            <div className="flex flex-col gap-2">
              <h6>Image</h6>
              <div className="flex gap-4">
                <input className="file-input" hidden onChange={FilehandleChange} accept="image/*" id="DaoImage" name="DaoImage" type="file" />
                <div className="flex flex-col gap-4">
                  {DaoImage.length < 1 && <AddImageInput onClick={AddBTNClick} />}
                  <ImageListDisplay images={DaoImage} onDeleteImage={DeleteSelectedImages} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between border-t border-beerus w-full p-6">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <CreateDaoBTN />
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
}
