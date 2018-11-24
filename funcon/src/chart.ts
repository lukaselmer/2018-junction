import { Chart } from 'chart.js';

const chartColors = {
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)'
};

export function start(percentageFirstSpeaker: number, percentageSecondSpeaker: number) {
  const config = {
    type: 'pie',
    data: {
      datasets: [
        {
          data: [percentageFirstSpeaker, percentageSecondSpeaker],
          backgroundColor: [chartColors.yellow, chartColors.green],
          label: 'Dataset 1'
        }
      ],
      labels: ['You', 'Katarina']
    },
    options: {
      responsive: true
    }
  };

  const ctxPie = (document.getElementById('chart-area') as HTMLCanvasElement).getContext('2d');
  const myPie = new Chart(ctxPie, config);

  const SWEARWORDS = ['shit', 'fuck', 'ass'];
  const barChartData = {
    type: 'bar',
    labels: SWEARWORDS,
    datasets: [
      {
        backgroundColor: chartColors.yellow,
        borderColor: chartColors.green,
        borderWidth: 1,
        data: [3, 1, 2],
        label: 'Frequency'
      }
    ]
  };

  const ctxBar = (document.getElementById('canvas') as HTMLCanvasElement).getContext('2d');
  const myBar = new Chart(ctxBar, {
    type: 'bar',
    data: barChartData,
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      },
      responsive: true,
      title: {
        display: true,
        text: 'Swearwords'
      }
    }
  });
}
