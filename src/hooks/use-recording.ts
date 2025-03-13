import { useEffect, useState } from 'react'
import { SpeechRecognition } from '@capacitor-community/speech-recognition'

export const useRecording = () => {
  const [record, setRecord] = useState<string>('')
  const [recording, setRecording] = useState<boolean>(false)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string>('')

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

  useEffect(() => {
    return () => {
      SpeechRecognition.removeAllListeners()
    }
  }, [])

  const startRec = async () => {
    setErrorMessage('')

    const available = await SpeechRecognition.available()
    if (!available) {
      setErrorMessage('Speech recognition is not available on this device.')
      return
    }

    const status = await SpeechRecognition.requestPermissions()
    if (status.speechRecognition === 'granted') {
      setRecording(true)

      try {
        await SpeechRecognition.start({
          language: 'en-US',
          prompt: 'Say something',
          partialResults: true,
          popup: true
        })

        await SpeechRecognition.addListener(
          'partialResults',
          (data: { matches: string[] }) => {
            if (data.matches.length > 0 && data.matches[0] !== undefined) {
              setRecord(data.matches[0])
            }
          }
        )
      } catch (error: any) {
        setErrorMessage(error.message)
      }
    } else {
      setErrorMessage('Permission denied for speech recognition.')
    }
  }

  const stopRec = async () => {
    try {
      setRecording(false)
      await SpeechRecognition.stop()
    } catch (error: any) {
      setErrorMessage(error.message)
    }
  }

  return {
    startRec,
    stopRec,
    recording,
    elapsedTime,
    record,
    errorMessage
  }
}
