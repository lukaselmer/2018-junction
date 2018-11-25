import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

import { calculateSpeakerStatistics, SpeakerStatistics } from '../text-analysis';
import { Speech } from '../transcript-monitor';

interface P {
  conversation: Speech[];
}

export function Graphs({ conversation }: P) {
  const speakerStatistics = calculateSpeakerStatistics(conversation);
  return (
    <div>
      <div style={{ maxWidth: '900px', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
        {drawSpeakerStatistics(speakerStatistics)}
      </div>

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
    </div>
  );
}

function drawSpeakerStatistics(speakerStatistics: SpeakerStatistics[]) {
  return (
    <>
      <h3 className='feedback-title'>Participation</h3>
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
    </>
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
          aspectRatio: 4 / 3,
          title: {
            display: true,
            text: title
          }
        }}
      />
    </div>
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
