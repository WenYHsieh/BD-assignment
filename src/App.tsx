import { Link, Outlet, useNavigate } from 'react-router-dom';
import './app.scss';
import { Autocomplete, Button, Chip, Divider, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import selectData from './data/selectData.json';

type FormData = {
  year: null | string;
  country: null | string;
  town: null | string;
};
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    year: null,
    country: null,
    town: null,
  });
  const navigate = useNavigate();

  const countryOptions = Object.keys(selectData);
  const yearOptions = ['106', '107', '108', '109', '110', '111'];

  const townOptions = useMemo(() => {
    const { country } = formData;
    if (country === null) return [];
    return (selectData as { [key: string]: Array<string> })[country];
  }, [formData?.country]);

  const isValidForm = useMemo(() => {
    const { year, country, town } = formData;
    return year && country && town;
  }, [formData]);

  const handleSubmit = () => {
    const { year, country, town } = formData;

    navigate(`${year}/${country}/${town}`);
  };

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
            sx={{ width: 100, marginRight: '16px' }}
            value={formData?.year}
            onChange={(_, value) =>
              setFormData((formData) => {
                return { ...formData, year: value };
              })
            }
            inputValue={formData?.year ?? ''}
            onInputChange={(_, newInputValue) => {
              setFormData((formData) => {
                return { ...formData, year: newInputValue };
              });
            }}
            renderInput={(params) => <TextField {...params} label='年份' />}
          />
          <Autocomplete
            disablePortal
            id='country'
            options={countryOptions}
            sx={{ width: 200, marginRight: '16px' }}
            value={formData?.country}
            onChange={(_, value) =>
              setFormData((formData) => {
                return { ...formData, country: value, town: null };
              })
            }
            inputValue={formData?.country ?? ''}
            onInputChange={(_, newInputValue) => {
              setFormData((formData) => {
                return { ...formData, country: newInputValue, town: null };
              });
            }}
            renderInput={(params) => <TextField {...params} label='縣/市' />}
          />
          <Autocomplete
            disablePortal
            id='town'
            options={townOptions}
            sx={{ width: 200, marginRight: '16px' }}
            value={formData?.town}
            onChange={(_, value) =>
              setFormData((formData) => {
                return { ...formData, town: value };
              })
            }
            inputValue={formData?.town ?? ''}
            onInputChange={(_, newInputValue) => {
              setFormData((formData) => {
                return { ...formData, town: newInputValue };
              });
            }}
            disabled={!formData?.country}
            renderInput={(params) => <TextField {...params} label='區' />}
          />
          <Button
            variant='contained'
            disabled={isLoading || !isValidForm}
            onClick={handleSubmit}
            sx={{ backgroundColor: '#6520ff' }}
          >
            SUBMIT
          </Button>
        </form>

        <Divider sx={{ margin: '30px', borderColor: '#d1b7ff' }}>
          <Chip
            label='搜尋結果'
            sx={{
              background: 'none',
              border: 1,
              borderColor: '#d1b7ff',
              color: '#d1b7ff',
            }}
          />
        </Divider>
        <Outlet />
      </div>

      <p className='sideLogo'>T A I W A N</p>
    </div>
  );
}

export default App;
