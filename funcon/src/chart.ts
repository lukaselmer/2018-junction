import { Chart } from 'chart.js';

const chartColors = {
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)'
};

export function start(percentageFirstSpeaker: number, percentageSecondSpeaker: number) {
  let randomScalingFactor = function() {
    return Math.round(Math.random() * 100);
  };

  let config = {
    type: 'pie',
    data: {
      datasets: [
        {
          data: [percentageFirstSpeaker, percentageSecondSpeaker],
          backgroundColor: [chartColors.yellow, chartColors.green],
          label: 'Dataset 1'
        }
      ],
      labels: ['Yellow', 'Green']
    },
    options: {
      responsive: true
    }
  };

  let ctx = (document.getElementById('chart-area') as HTMLCanvasElement).getContext('2d');
  const myPie = new Chart(ctx, config);

  let colorNames = Object.keys(chartColors);
}
