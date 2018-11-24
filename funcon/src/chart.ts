import { Chart } from 'chart.js';

const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

function countBackgroundColors(data: Map<String, number>) {
  const chartBackgroundColor: string[] = [];
  data.forEach(count =>
    count > 2
      ? chartBackgroundColor.push(chartColors.red)
      : chartBackgroundColor.push(chartColors.yellow)
  );
  return chartBackgroundColor;
}

export function start(
  percentageFirstSpeaker: number,
  percentageSecondSpeaker: number,
  swearWords: Map<String, number>,
  lowConfidenceWords: Map<String, number>
) {
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

  const SWEARWORDS = Array.from(swearWords.keys());
  const swearWordChartData = {
    type: 'bar',
    labels: SWEARWORDS,
    datasets: [
      {
        backgroundColor: countBackgroundColors(swearWords),
        borderColor: chartColors.green,
        borderWidth: 1,
        data: Array.from(swearWords.values()),
        label: 'Frequency'
      }
    ]
  };

  const swearWordBar = (document.getElementById('canvas-swearing') as HTMLCanvasElement).getContext(
    '2d'
  );
  const mySwearWordBar = new Chart(swearWordBar, {
    type: 'bar',
    data: swearWordChartData,
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
        text: 'Conversation Rudeness'
      }
    }
  });

  const LOW_CONFIDENCE_WORDS = Array.from(lowConfidenceWords.keys());
  const lowConfidenceWordData = {
    type: 'bar',
    labels: LOW_CONFIDENCE_WORDS,
    datasets: [
      {
        backgroundColor: countBackgroundColors(lowConfidenceWords),
        borderColor: chartColors.green,
        borderWidth: 1,
        data: Array.from(lowConfidenceWords.values()),
        label: 'Frequency'
      }
    ]
  };

  const confidenceBar = (document.getElementById('canvas-confidence') as HTMLCanvasElement).getContext(
    '2d'
  );
  const myConfidenceBar = new Chart(confidenceBar, {
    type: 'bar',
    data: lowConfidenceWordData,
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
        text: 'Conversation Confidence'
      }
    }
  });
}
