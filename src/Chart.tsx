import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

const Chart = () => {
  let { year, country, town } = useParams();
  const baseURL = `https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019`;

  useEffect(() => {
    const getDataByYear = async () => {
      try {
        const { data, status } = await axios.get(`${baseURL}/${year}`);
        if (status === 200) console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    getDataByYear();
  }, [year]);

  return <div>{`${year} ${country} ${town}`}</div>;
};

export default Chart;
