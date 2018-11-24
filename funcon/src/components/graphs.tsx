import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

import { speakerStatistics } from '../text-analysis';

export function Graphs() {
  return (
    <div>
      <div style={{ maxWidth: '900px', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
        {drawSpeakerStatistics()}
      </div>
      <div>
        <h3>Rudeness</h3>
        {speakerStatistics.map(stats => (
          <div
            key={stats.speaker.name}
            style={{ width: `${99.99 / speakerStatistics.length}%`, float: 'left' }}
          >
            {drawWordStatistics(`Conversation Rudeness of ${stats.speaker.name}`, stats.rudeWords)}
          </div>
        ))}
      </div>
      <div>
        <h3>Conversation Confidence</h3>
        {speakerStatistics.map(stats => (
          <div
            key={stats.speaker.name}
            style={{ width: `${99.99 / speakerStatistics.length}%`, float: 'left' }}
          >
            {drawWordStatistics(
              `Conversation Confidence of ${stats.speaker.name}`,
              stats.lowConfidenceWords
            )}
          </div>
        ))}
      </div>
      <div>
        <h3>Parasite Word Usage</h3>
        {speakerStatistics.map(stats => (
          <div
            key={stats.speaker.name}
            style={{ width: `${99.99 / speakerStatistics.length}%`, float: 'left' }}
          >
            {drawWordStatistics(`Parasite Words of ${stats.speaker.name}`, stats.parasiteWords)}
          </div>
        ))}
      </div>
    </div>
  );
}

function drawSpeakerStatistics() {
  return (
    <>
      <h2 className='feedback-title'>Your Conversation Feedback</h2>
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
