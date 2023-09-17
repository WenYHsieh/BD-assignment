import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Chart = () => {
  /**
   * TODO
   * 1. pie chart
   * 2. loading
   * 3. rwd
   * 4. component styling
   * 5. api call data type check, error handling
   */

  let { year, country, town } = useParams();
  const [chartData, setChartData] = useState<{
    [key: string]: Array<{ [key in string]: string }>;
  }>({});
  const [columnOptions, setColumnOptions] = useState({
    chart: {
      type: 'column',
    },
    title: {
      text: '人口數統計',
    },
    xAxis: {
      type: 'category',
      title: {
        text: '型態',
      },
      categories: ['共同生活', '獨立居住'],
    },
    yAxis: {
      allowDecimals: false,
      title: {
        text: '數量',
      },
    },
    series: [],
  });
  const baseURL = `https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019`;

  const filterMatchData = (yearData: Array<{ [key: string]: string }>) => {
    const matchData = yearData.filter(
      ({ country: dataCountry, town: dataTown }) => {
        return dataCountry === country && dataTown === town;
      },
    );
    let ordinaryFemaleSum = 0;
    let ordinaryMaleSum = 0;
    let singleFemaleSum = 0;
    let singleMaleSum = 0;
    matchData?.forEach(
      ({
        household_ordinary_m,
        household_ordinary_f,
        household_single_m,
        household_single_f,
      }) => {
        ordinaryFemaleSum = ordinaryFemaleSum + parseInt(household_ordinary_f);
        ordinaryMaleSum = ordinaryMaleSum + parseInt(household_ordinary_m);
        singleFemaleSum = singleFemaleSum + parseInt(household_single_f);
        singleMaleSum = singleMaleSum + parseInt(household_single_m);
      },
    );

    setColumnOptions((columnOptions) => {
      return {
        ...columnOptions,
        series: [
          {
            name: '男性',
            data: [ordinaryMaleSum, singleMaleSum],
          },
          {
            name: '女性',
            data: [ordinaryFemaleSum, singleFemaleSum],
          },
        ],
      };
    });
  };

  useEffect(() => {
    if (!year) return;

    const getDataByYear = async () => {
      const allPageNum = 4;
      const pageNums = Array.from({ length: allPageNum }, (_, i) => i + 1);

      try {
        const responses = await axios.all(
          pageNums.map((pageNum) =>
            axios.get(`${baseURL}/${year}?page=${pageNum}`),
          ),
        );

        let yearData: Array<{ [key: string]: string }> = [];
        responses?.forEach(({ data }) => {
          const { responseData } = data;

          yearData = yearData.concat(
            responseData?.map((item: { [key: string]: string }) => {
              const {
                site_id,
                household_ordinary_total,
                household_ordinary_m,
                household_ordinary_f,
                household_single_total,
                household_single_m,
                household_single_f,
              } = item;
              const country = site_id.slice(0, 3);
              const town = site_id.slice(3);

              return {
                country,
                town,
                household_ordinary_total,
                household_ordinary_m,
                household_ordinary_f,
                household_single_total,
                household_single_m,
                household_single_f,
              };
            }),
          );
        }),
          setChartData({
            ...chartData,
            [year as string]: yearData,
          });
        filterMatchData(yearData);
      } catch (error) {
        console.error(error);
      }
    };
    // 已有資料，直接篩選。
    // 沒的話要 call api 去拿
    chartData[year] ? filterMatchData(chartData[year]) : getDataByYear();
  }, [year, country, town]);

  return (
    <>
      <h2>{`${year} 年 ${country} ${town}`}</h2>
      <HighchartsReact highcharts={Highcharts} options={columnOptions} />
    </>
  );
};

export default Chart;
