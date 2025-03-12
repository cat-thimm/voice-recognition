import React, { useEffect, useState } from 'react'
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import { SpeechRecognition } from '@capacitor-community/speech-recognition'
import { micOutline, pauseOutline, stopOutline } from 'ionicons/icons'

import './Record.css'

const Record: React.FC = () => {
  const [record, setRecord] = useState<string>('')
  const [recording, setRecording] = useState<boolean>(false)
  const [elapsedTime, setElapsedTime] = useState<number>(0)

  useEffect(() => {
    let timer = undefined

    if (recording) {
      timer = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(timer)
      setElapsedTime(0) // Reset time when recording stops
    }

    return () => clearInterval(timer)
  }, [recording])

  const startRec = async () => {
    const available = await SpeechRecognition.available()
    if (!available) {
      console.error('Speech recognition is not available on this device.')
      return
    }

    const status = await SpeechRecognition.requestPermissions()
    if (status.speechRecognition === 'granted') {
      setRecording(true)

      await SpeechRecognition.start({
        language: 'en-US',
        prompt: 'Say something',
        partialResults: true,
        popup: true
      })

      await SpeechRecognition.addListener(
        'partialResults',
        (data: { matches: string[] }) => {
          console.log(data)
          if (data.matches.length > 0 && data.matches[0] !== undefined) {
            setRecord(data.matches[0])
          }
        }
      )
    } else {
      console.error('Permission denied for speech recognition.')
    }
  }

  const stopRec = async () => {
    setRecording(false)
    await SpeechRecognition.stop()
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recording</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="small">Recording</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="record-tab__page">
          <div>
            <h1>Transcript</h1>
            RECORD
            <p className="recorded-text">{record}</p>
          </div>

          <div className="record-tab__bottom ">
            <p className="recording-text">{formatTime(elapsedTime)}</p>

            <div className="button-row">
              <div className="recorder-container" onClick={startRec}>
                {recording && (
                  <>
                    <div className="outer"></div>
                    <div className="outer-2"></div>
                  </>
                )}
                <div className="icon-microphone">
                  {!recording ? (
                    <IonIcon icon={micOutline} />
                  ) : (
                    <IonIcon icon={pauseOutline} />
                  )}
                </div>
              </div>
              <IonButton color="danger" onClick={stopRec} size="default">
                <IonIcon icon={stopOutline} />
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Record
