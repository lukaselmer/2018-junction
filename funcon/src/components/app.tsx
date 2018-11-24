import React, { Component } from 'react';
import { SpeakerDetector } from '../speaker_detector';
import { TranscriptMonitor } from '../transcript-monitor';
import { EmojiTranscript } from './emoji-transcript';
import { Transcript } from './transcript';

interface S {
  transcriptMonitor: TranscriptMonitor;
  speakerDetector: SpeakerDetector;
  recordingState: 'Started' | 'Stopped';
  lastUpdate: Date;
}

export class App extends Component<{}, S> {
  constructor(props) {
    super(props);

    this.state = {
      transcriptMonitor: new TranscriptMonitor(),
      speakerDetector: new SpeakerDetector(),
      recordingState: 'Started',
      lastUpdate: new Date()
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
  }

  render() {
    return (
      <div className='App'>
        <h1 className='App-Title'>Hello Parcel x React</h1>

        <EmojiTranscript montior={this.state.transcriptMonitor} />
        <Transcript montior={this.state.transcriptMonitor} />

        <div style={{ background: this.state.recordingState === 'Started' ? '#A3E4D7' : '#EAEDED' }}>
          <div>{this.state.recordingState}</div>
          {this.state.recordingState === 'Stopped' && (
            <button onClick={() => this.start()}>Start</button>
          )}
          {this.state.recordingState === 'Started' && <button onClick={() => this.stop()}>Stop</button>}
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
    this.state.speakerDetector.start(() => {});
    // @ts-ignore
    // monitor(this.state.speakerDetector);
    // this.state.speakerDetector.start(frame => console.log([...frame.speakerIndices].join(', ')));
  }

  private stop() {
    this.state.transcriptMonitor.stop();
    this.state.speakerDetector.stop();
    this.setState({ recordingState: 'Stopped' });
  }
}
