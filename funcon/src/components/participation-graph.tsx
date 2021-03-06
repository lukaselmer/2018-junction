import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

import { calculateSpeakerStatistics, SpeakerStatistics } from '../text-analysis';
import { Speech } from '../transcript-monitor';
import { chartColors } from './graphs';

interface P {
  conversation: Speech[];
}

export function ParticipationGraph({ conversation }: P) {
  const speakerStatistics = calculateSpeakerStatistics(conversation);
  return (
    <div className='col-sm'>
      <h3 className='feedback-title'>Participation</h3>
      <Pie
        data={{
          datasets: [
            {
              data: speakerStatistics.map(({ numberOfWords }) => numberOfWords),
              backgroundColor: [chartColors.yellow, chartColors.green],
              label: 'Speaker Percentage'
            }
          ],
          labels: speakerStatistics.map(
            ({ percentage, speaker: { name } }) => `${name} (${percentage}%)`
          )
        }}
        options={{
          responsive: true
        }}
      />
    </div>
  );
}
