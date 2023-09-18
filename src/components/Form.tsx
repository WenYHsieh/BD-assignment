import { useNavigate, useParams } from 'react-router-dom';
import { Autocomplete, Button, Chip, Divider, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import selectData from '../data/selectData.json';

type FormData = {
  year: null | string;
  country: null | string;
  town: null | string;
};

const Form = ({ isLoading }: { isLoading: boolean }) => {
  const { year, country, town } = useParams();

  const [formData, setFormData] = useState<FormData>({
    year: null,
    country: null,
    town: null,
  });
  const navigate = useNavigate();

  const countryOptions = Object.keys(selectData);
  const yearOptions = ['106', '107', '108', '109', '110', '111'];
  const styles = {
    autoComplete: {
      marginRight: '12px',
      mb: { xs: '16px', sm: 0 },
      backgroundColor: 'white',
    },
    button: {
      backgroundColor: '#6520ff',
      ':hover': {
        backgroundColor: '#6520ff',
      },
    },
    divider: {
      '&::before, &::after': {
        borderColor: '#C29FFF',
      },
    },
    chip: {
      background: 'none',
      border: 1,
      borderColor: '#B388FF',
      color: '#B388FF',
    },
  };

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
    navigate(`/${year}/${country}/${town}`);
  };

  useEffect(() => {
    if (!year || !country || !town) return;
    setFormData({ year, country, town });
  }, []);

  return (
    <>
      <h1 className='title'>人口數、戶數按戶別及性別統計</h1>
      <form>
        <Autocomplete
          disablePortal
          id='year'
          options={yearOptions}
          sx={{
            ...styles.autoComplete,
            width: '100px',
          }}
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
          renderInput={(params) => (
            <TextField {...params} label='年份' size='small' />
          )}
        />
        <Autocomplete
          disablePortal
          id='country'
          options={countryOptions}
          sx={{ ...styles.autoComplete, width: { xs: '100%', sm: '165px' } }}
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
          renderInput={(params) => (
            <TextField
              {...params}
              label='縣/市'
              size='small'
              inputProps={{
                ...params.inputProps,
                placeholder: '請選擇 縣/市',
              }}
            />
          )}
        />
        <Autocomplete
          disablePortal
          id='town'
          options={townOptions}
          sx={{ ...styles.autoComplete, width: { xs: '100%', sm: '165px' } }}
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
          renderInput={(params) => (
            <TextField
              {...params}
              label='區'
              size='small'
              inputProps={{
                ...params.inputProps,
                placeholder: '請先選擇 縣/市',
              }}
            />
          )}
        />
        <Button
          variant='contained'
          disabled={isLoading || !isValidForm}
          onClick={handleSubmit}
          sx={styles.button}
        >
          SUBMIT
        </Button>
      </form>

      <Divider sx={styles.divider}>
        <Chip label='搜尋結果' sx={styles.chip} />
      </Divider>
    </>
  );
};

export default Form;
