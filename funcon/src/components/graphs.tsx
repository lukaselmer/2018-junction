import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

import { calculateSpeakerStatistics } from '../text-analysis';
import { Speech } from '../transcript-monitor';

interface P {
  conversation: Speech[];
}

export function Graphs({ conversation }: P) {
  const speakerStatistics = calculateSpeakerStatistics(conversation);
  return (
    <div>
      {speakerStatistics.map(stats => (
        <div key={stats.speaker.name} className='col-sm'>
          <h3>{stats.speaker.name}</h3>
          <div className='row'>
            {drawWordStatistics(`Rudeness`, stats.rudeWords)}
            {drawWordStatistics(`Confidence`, stats.lowConfidenceWords)}
            {drawWordStatistics(`Parasite Words`, stats.parasiteWords)}
          </div>
        </div>
      ))}
    </div>
  );
}

function drawWordStatistics(title: string, words: Map<string, number>) {
  return (
    <div className='col-sm'>
      <Bar
        data={{
          labels: [...words.keys()],
          datasets: [
            {
              backgroundColor: countBackgroundColors(words),
              borderColor: chartColors.green,
              borderWidth: 1,
              data: Array.from(words.values()),
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
            text: title
          }
        }}
      />
    </div>
  );
}

function countBackgroundColors(data: Map<String, number>) {
  const chartBackgroundColor: string[] = [];
  data.forEach(count =>
    count > 2
      ? chartBackgroundColor.push(chartColors.red)
      : chartBackgroundColor.push(chartColors.yellow)
  );
  return chartBackgroundColor;
}

export const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};
