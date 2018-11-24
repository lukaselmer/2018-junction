import { Chart } from 'chart.js';

const chartColors = {
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)'
};

export function start(percentageFirstSpeaker: number, percentageSecondSpeaker: number) {
  const conversationChart = (document.getElementById('chart-area') as HTMLCanvasElement).getContext(
    '2d'
  );
  const conversationPieChart = new Chart(conversationChart, {
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
  });

  const SWEARWORDS = ['shit', 'fuck', 'ass'];
  const swearWordChartData = {
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

  const LOW_CONFIDENCE_WORDS = ['i feel', 'probably', 'maybe', 'i think'];
  const lowConfidenceWordData = {
    type: 'bar',
    labels: LOW_CONFIDENCE_WORDS,
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

  const confidenceBar = (document.getElementById('canvas-confidence') as HTMLCanvasElement).getContext(
    '2d'
  );
  const myConfidenceBar = new Chart(confidenceBar, {
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
        text: 'Conversation Confidence'
      }
    }
  });
}
