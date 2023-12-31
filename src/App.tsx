import { Link, Outlet, useOutletContext } from 'react-router-dom';
import './app.scss';
import { useState } from 'react';
import Loader from './components/Loader';
import Form from './components/Form';
import SettingIcon from './assets/settingIcon.svg';

type ContextType = {
  isLoading: Boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<Boolean>>;
};

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className='app__wrapper'>
      {isLoading ? <Loader /> : <></>}
      <nav>
        <Link to='/'>LOGO</Link>
        <img src={SettingIcon} className='settingBtn' />
      </nav>

      <p className='sideLogo'>TAIWAN</p>
      <div className='dashboard'>
        <Form isLoading={isLoading} />
        <Outlet context={{ isLoading, setIsLoading }} />
      </div>
    </div>
  );
}

export default App;

export function useLoading() {
  return useOutletContext<ContextType>();
}
