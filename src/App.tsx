import { Link, Outlet, useOutletContext } from 'react-router-dom';
import './app.scss';
import { useState } from 'react';
import Loader from './components/Loader';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Form from './components/Form';

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
        <SettingsOutlinedIcon className='settingBtn' />
      </nav>
      <div className='dashboard'>
        <Form isLoading={isLoading} />
        <Outlet context={{ isLoading, setIsLoading }} />
      </div>

      <p className='sideLogo'>T A I W A N</p>
    </div>
  );
}

export default App;

export function useLoading() {
  return useOutletContext<ContextType>();
}
