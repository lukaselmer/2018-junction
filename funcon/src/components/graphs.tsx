import React from 'react';
import { Pie } from 'react-chartjs-2';

import { start } from '../chart';
import { speakerStatistics } from '../text-analysis';

const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

export function Graphs() {
  start(speakerStatistics[1].rudeWords, speakerStatistics[0].lowConfidenceWords);

  return (
    <div>
      <h1 className='title'>Your Conversation Feedback</h1>
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
    </div>
  );
}
