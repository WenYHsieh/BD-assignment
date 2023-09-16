import { Link } from 'react-router-dom';
import './app.scss';
import { Autocomplete, Button, Chip, Divider, TextField } from '@mui/material';
import { useState } from 'react';
import selectData from './data/selectData.json';

function App() {
  const countryOptions = Object.keys(selectData);
  const yearOptions = [
    '103',
    '104',
    '105',
    '106',
    '107',
    '108',
    '109',
    '110',
    '111',
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  const townOptions =
    value === null
      ? []
      : (selectData as { [key: string]: Array<string> })[value];

  return (
    <div className='app__wrapper'>
      <nav>
        <Link to='/'>LOGO</Link>
      </nav>
      <div className='dashboard'>
        <h1>人口數、戶數按戶別及性別統計</h1>
        <form>
          <Autocomplete
            disablePortal
            id='year'
            options={yearOptions}
            sx={{ width: 100 }}
            renderInput={(params) => <TextField {...params} label='年份' />}
          />
          <Autocomplete
            disablePortal
            id='country'
            options={countryOptions}
            sx={{ width: 200 }}
            onChange={(_, value) => setValue(value)}
            renderInput={(params) => <TextField {...params} label='縣/市' />}
          />
          <Autocomplete
            disablePortal
            id='town'
            options={townOptions}
            sx={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label='區' />}
          />
          <Button variant='contained' disabled={isLoading}>
            SUBMIT
          </Button>
        </form>

        <Divider>
          <Chip label='搜尋結果' />
        </Divider>
      </div>

      <p className='sideLogo'>T A I W A N</p>
    </div>
  );
}

export default App;
