import React, { Component } from 'react';
import { SpeakerDetector } from '../speaker_detector';
import { TranscriptMonitor } from '../transcript-monitor';
import { EmojiTranscript } from './emoji-transcript';
import { Graphs } from './graphs';
import { ParticipationGraph } from './participation-graph';
import { Transcript } from './transcript';

const debug = false;

interface S {
  transcriptMonitor: TranscriptMonitor;
  speakerDetector: SpeakerDetector;
  recordingState: 'Started' | 'Stopped';
  lastUpdate: Date;
  showTranscript: boolean;
}

export class App extends Component<{}, S> {
  constructor(props) {
    super(props);

    this.state = {
      transcriptMonitor: new TranscriptMonitor(),
      speakerDetector: new SpeakerDetector(),
      recordingState: 'Started',
      lastUpdate: new Date(),
      showTranscript: false
    };
    if (debug) this.state.transcriptMonitor.addListener(speech => console.log(speech));
    this.state.transcriptMonitor.addListener(() => this.setState({ lastUpdate: new Date() }));
  }

  componentDidMount() {
    this.startListenting();
  }

  componentWillUnmount() {
    this.state.transcriptMonitor.clearListeners();
    if (this.state.recordingState === 'Started') {
      this.state.transcriptMonitor.stop();
      this.state.speakerDetector.stop();
    }
  }

  render() {
    return (
      <div className='container-fluid'>
        <h1>🎉🎉🎉 Hello FunCon 🎉🎉🎉</h1>

        <h2>Overview</h2>
        <div className='row'>
          <ParticipationGraph conversation={this.state.transcriptMonitor.conversation} />
          <EmojiTranscript montior={this.state.transcriptMonitor} />
        </div>

        <Graphs conversation={this.state.transcriptMonitor.conversation} />

        <button
          className={`start-stop-button ${
            this.state.recordingState === 'Started' ? 'started' : 'stopped'
          }`}
          onClick={() => (this.state.recordingState === 'Stopped' ? this.start() : this.stop())}
        >
          {this.state.recordingState === 'Stopped' ? 'Start' : 'Stop'}
        </button>

        <div
          className={`transcript-text-overlay ${this.state.showTranscript ? 'open' : 'closed'}`}
          onClick={() => this.setState({ showTranscript: !this.state.showTranscript })}
        >
          <Transcript montior={this.state.transcriptMonitor} />
        </div>
      </div>
    );
  }

  private start() {
    this.startListenting();
    this.setState({ recordingState: 'Started' });
  }

  private startListenting() {
    this.state.transcriptMonitor.start();
    this.state.speakerDetector.start(speakers =>
      this.state.transcriptMonitor.recordSpeakers(speakers.speakerIndices)
    );
  }

  private stop() {
    this.state.transcriptMonitor.stop();
    this.state.speakerDetector.stop();
    this.setState({ recordingState: 'Stopped' });
  }
}
