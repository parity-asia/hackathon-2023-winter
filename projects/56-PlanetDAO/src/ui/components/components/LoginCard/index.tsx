import Image from "next/legacy/image";
import Card from '../Card';
import { Button } from '@heathmont/moon-core-tw';
import { SoftwareLogin } from '@heathmont/moon-icons-tw';
import { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import UseFormInput from '../UseFormInput';
import { usePolkadotContext } from '../../../contexts/PolkadotContext';
import { toast } from 'react-toastify';

const LoginCard = ({ step, onConnectMetamask, onConnectPolkadot, setStep }: { step: number; onConnect: MouseEventHandler<HTMLButtonElement>; onConnectMetamask: MouseEventHandler<HTMLButtonElement>; onConnectPolkadot: MouseEventHandler<HTMLButtonElement>; setStep: Dispatch<SetStateAction<number>> }) => {
  const { api, deriveAcc, showToast, EasyToast } = usePolkadotContext();

  const [Email, EmailInput] = UseFormInput({
    defaultValue: '',
    type: 'email',
    placeholder: 'Email',
    id: ''
  });

  const [Password, PasswordInput] = UseFormInput({
    defaultValue: '',
    type: 'password',
    placeholder: 'Password',
    id: ''
  });

  async function OnClickLoginStep1Extrinsics() {
    const id = toast.loading('Logging in  ...');

    const doAfter = (events) => {
      let user_data = [];
      events.forEach(({ event: { data, method, section }, phase }) => {
        if (method == 'LoggedIn') {
          user_data = JSON.parse(data.toString());
        }
      });
      if (user_data.length > 0) {
        localStorage.setItem('user_id', user_data[0].toString());
        if (user_data[1] == true) {
          toast.update(id, {
            render: 'Logged in Successfully!',
            type: 'success',
            isLoading: false,
            autoClose: 1000,
            closeButton: true,
            closeOnClick: true,
            draggable: true
          });
          setStep(2);
          return;
        }
      } else {
        toast.update(id, { render: 'Incorrect email or password!', type: 'error', 
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
        draggable: true,isLoading: false });
      }
    };
    await api._extrinsics.users.loginUser(Email, Password).signAndSend(deriveAcc, ({ status, events }) => {
      showToast(status, id, 'Logged in Successfully!', doAfter, false, events);
    });
  }

  async function OnClickLoginStep1() {
    const ToastId = toast.loading('Logging in  ...');
    let totalUserCount = Number(await api._query.users.userIds());
    var found = false;
    for (let i = 0; i < totalUserCount; i++) {
      const element = await api._query.users.userById(i);
      if (element.email.toString() == Email && element.password.toString() == Password) {
        found = true;
        localStorage.setItem('user_id', i.toString());
        EasyToast('Logged in Successfully!', 'success', true, ToastId.toString());

        setStep(2);
        return;
      } else {
        found = false;
      }
    }
    if (!found) {
      EasyToast('Incorrect email or password!', 'error', true, ToastId.toString());
    }
  }

  const LoginForm = () => (
    <Card className="max-w-[480px]">
      <div className="flex w-full flex-col gap-10">
        <div className="flex flex-1 justify-between items-center relative text-moon-16">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
              <h6>Email</h6>
              {EmailInput}
            </div>
            <div className="flex flex-col gap-2">
              <h6>Password</h6>
              {PasswordInput}
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button onClick={OnClickLoginStep1}>Next</Button>
        </div>
      </div>
    </Card>
  );

  const ConnectMetamaskButton = () => (
    <Card className="max-w-[480px]">
      <div className="flex w-full flex-col gap-10">
        <div className="flex items-center">
          <div className="rounded-moon-s-md border border-beerus p-2 mr-6">
            <Image height={64} width={64} src="https://metamask.io/images/metamask-logo.png" alt="" />
          </div>
          <p className="font-bold text-moon-20 flex-1">Metamask</p>
          <Button iconLeft={<SoftwareLogin />} onClick={onConnectMetamask}>
            Connect
          </Button>
        </div>
      </div>
    </Card>
  );

  const ConnectPolkadotButton = () => (
    <Card className="max-w-[480px] w-full">
      <div className="flex w-full flex-col gap-10">
        <div className="flex items-center">
          <div className="rounded-moon-s-md border border-beerus p-2 mr-6">
            <Image height={64} width={64} src="/images/polkadot.svg" alt="" />
          </div>
          <p className="font-bold text-moon-20 flex-1">Polkadot JS</p>
          <Button iconLeft={<SoftwareLogin />} onClick={onConnectPolkadot}>
            Connect
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      {step == 1 && LoginForm()}
      {step == 2 && (
        <div className="flex flex-col gap-4 w-full items-center">
          {ConnectPolkadotButton()}
          <div>Or</div>
          {ConnectMetamaskButton()}
        </div>
      )}
    </>
  );
};

export default LoginCard;
