import React from 'react'
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar
} from '@ionic/react'
import { micOutline, pauseOutline, stopOutline } from 'ionicons/icons'

import './Record.css'

import { useRecording } from '../../hooks/use-recording'

const Record: React.FC = () => {
  const { record, recording, stopRec, startRec, elapsedTime, errorMessage } =
    useRecording()

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
        <IonToast
          isOpen={errorMessage !== ''}
          color="danger"
          message={errorMessage}
          duration={5000}
        />
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="small">Recording</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="record-tab__page">
          <div>
            <h1>Transcript</h1>
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
