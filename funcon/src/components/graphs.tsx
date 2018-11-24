import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

import { start } from '../chart';
import { speakerStatistics } from '../text-analysis';

export function Graphs() {
  start(speakerStatistics[1].rudeWords, speakerStatistics[0].lowConfidenceWords);

  return (
    <div>
      <h1 className='title'>Your Conversation Feedback</h1>
      {drawSpeakerStatistics()}
      {drawSwearWords()}
    </div>
  );
}

function drawSpeakerStatistics() {
  return (
    <Pie
      data={{
        datasets: [
          {
            data: speakerStatistics.map(({ percentage }) => percentage),
            backgroundColor: [chartColors.yellow, chartColors.green],
            label: 'Speaker Percentage'
          }
        ],
        labels: speakerStatistics.map(({ speaker: { name } }) => name)
      }}
      options={{
        responsive: true
      }}
    />
  );
}

function drawSwearWords() {
  const swearWords = speakerStatistics[1].rudeWords;

  return (
    <Bar
      data={{
        labels: [...swearWords.keys()],
        datasets: [
          {
            backgroundColor: countBackgroundColors(swearWords),
            borderColor: chartColors.green,
            borderWidth: 1,
            data: Array.from(swearWords.values()),
            label: 'Frequency'
          }
        ]
      }}
      options={{
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
      }}
    />
  );
}

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
