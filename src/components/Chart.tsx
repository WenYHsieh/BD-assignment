import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useLoading } from '../App';

const Chart = () => {
  /**
   * TODO
   * 3. rwd
   * 4. component styling
   * 5. api call data type check, error handling
   */
  const baseURL = `https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019`;
  let { year, country, town } = useParams();
  const { isLoading, setIsLoading } = useLoading();

  const [chartData, setChartData] = useState<{
    [key: string]: Array<{ [key in string]: string }>;
  }>({});
  const [columnOptions, setColumnOptions] = useState({
    chart: {
      type: 'column',
    },
    colors: ['#7d5fb2', '#c29fff'],
    title: {
      text: '人口數統計',
    },
    xAxis: {
      type: 'category',
      title: {
        text: '型態',
        style: { fontWeight: 'bold' },
      },
      categories: ['共同生活', '獨立居住'],
    },
    yAxis: {
      allowDecimals: false,
      title: {
        text: '數量',
        align: 'high',
        offset: 0,
        rotation: 0,
        x: -15,
        y: -20,
        style: { fontWeight: 'bold' },
      },
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [],
  });

  const [pieOptions, setPieOptions] = useState({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    colors: ['#a3b1ff', '#626eb2'],
    title: {
      text: '戶數統計',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.2f} %',
        },
        showInLegend: true,
      },
    },
    series: [],
  });

  const filterMatchData = (yearData: Array<{ [key: string]: string }>) => {
    const matchData = yearData.filter(
      ({ country: dataCountry, town: dataTown }) => {
        return dataCountry === country && dataTown === town;
      },
    );

    // column data
    let ordinaryFemaleSum = 0;
    let ordinaryMaleSum = 0;
    let singleFemaleSum = 0;
    let singleMaleSum = 0;

    // pie data
    let singleTotalSum = 0;
    let ordinaryTotalSum = 0;

    matchData?.forEach(
      ({
        household_ordinary_m,
        household_ordinary_f,
        household_single_m,
        household_single_f,
        household_ordinary_total,
        household_single_total,
      }) => {
        ordinaryFemaleSum = ordinaryFemaleSum + parseInt(household_ordinary_f);
        ordinaryMaleSum = ordinaryMaleSum + parseInt(household_ordinary_m);
        singleFemaleSum = singleFemaleSum + parseInt(household_single_f);
        singleMaleSum = singleMaleSum + parseInt(household_single_m);
        singleTotalSum = singleTotalSum + parseInt(household_single_total);
        ordinaryTotalSum =
          ordinaryTotalSum + parseInt(household_ordinary_total);
      },
    );

    const householdTotal = singleTotalSum + ordinaryTotalSum;
    const ordinaryPercentage = ordinaryTotalSum / householdTotal;
    const singlePercentage = singleTotalSum / householdTotal;

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

    setPieOptions((pieOptions) => {
      return {
        ...pieOptions,
        series: [
          {
            name: '比例',
            colorByPoint: true,
            data: [
              {
                name: '獨立居住',
                y: ordinaryPercentage,
              },
              {
                name: '共同生活',
                y: singlePercentage,
              },
            ],
          },
        ],
      };
    });
  };

  useEffect(() => {
    if (!year) return;

    const getDataByYear = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    chartData[year] ? filterMatchData(chartData[year]) : getDataByYear();
  }, [year, country, town]);

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <>
          <h2>{`${year} 年 ${country} ${town}`}</h2>
          <HighchartsReact highcharts={Highcharts} options={columnOptions} />
          <HighchartsReact highcharts={Highcharts} options={pieOptions} />
        </>
      )}
    </>
  );
};

export default Chart;
