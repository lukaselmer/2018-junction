import React, { Component } from 'react';
import { SpeakerDetector } from '../speaker_detector';
import { TranscriptMonitor } from '../transcript-monitor';
import { EmojiTranscript } from './emoji-transcript';
import { Graphs } from './graphs';
import { Transcript } from './transcript';

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
      showTranscript: true
    };
    this.state.transcriptMonitor.addListener(speech => console.log(speech));
    this.state.transcriptMonitor.addListener(() => this.setState({ lastUpdate: new Date() }));
  }

  componentDidMount() {
    this.startListenting();
  }

  componentWillUnmount() {
    this.state.transcriptMonitor.stop();
    this.state.transcriptMonitor.clearListeners();
    this.state.speakerDetector.stop();
  }

  render() {
    return (
      <div className='container'>
        <h1>Hello FunCon 🎉🎉🎉</h1>

        <EmojiTranscript montior={this.state.transcriptMonitor} />
        <div
          className={`transcript-text-overlay ${this.state.showTranscript ? 'open' : 'closed'}`}
          onClick={() => this.setState({ showTranscript: !this.state.showTranscript })}
        >
          <Transcript montior={this.state.transcriptMonitor} />
        </div>

        <button
          className={`start-stop-button ${
            this.state.recordingState === 'Started' ? 'started' : 'stopped'
          }`}
          onClick={() => (this.state.recordingState === 'Stopped' ? this.start() : this.stop())}
        >
          {this.state.recordingState === 'Stopped' ? 'Start' : 'Stop'}
        </button>

        <Graphs conversation={this.state.transcriptMonitor.conversation} />
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
