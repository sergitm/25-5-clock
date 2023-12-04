import { useState, useEffect } from 'react'
import './App.css'
import alarm from './assets/alarm.mp3'
import TimeSetter from './TimeSetter.jsx'
import Display from './Display.jsx'

const defaultBreakTime = 5 * 60;
const defaultSessionTime = 25 * 60;
const min = 60;
const max = 60 * 60;
const interval = 60;

function App() {
  const [breakTime, setBreakTime] = useState(defaultBreakTime)
  const [sessionTime, setSessionTime] = useState(defaultSessionTime)
  const [displayTime, setDisplayTime] = useState({
    time: sessionTime,
    timeType: 'Session',
    timerRunning: false
  })

  useEffect(() => {
    let timerID
    if (!displayTime.timerRunning) return;
    if (displayTime.timerRunning) {
      timerID = window.setInterval(decrementDisplay, 1000)
    } 
    return () => {
      window.clearInterval(timerID)
    }
  }, [displayTime.timerRunning])

  useEffect(() => {
    if (displayTime.time === 0) {
      const audio = document.getElementById('beep')
      audio.currentTime = 2;
      audio.play().catch(error => console.log(error))
      setDisplayTime((prev) => ({
        ...prev,
        timeType: displayTime.timeType === 'Session' ? 'Break' : 'Session',
        time: displayTime.timeType === 'Session' ? breakTime : sessionTime
      }))
    }
  }, [displayTime, breakTime, sessionTime])

  const reset = () => {
    setBreakTime(defaultBreakTime)
    setSessionTime(defaultSessionTime)
    setDisplayTime({
      time: defaultSessionTime,
      timeType: 'Session',
      timerRunning: false
    })
    const audio = document.getElementById('beep')
    audio.pause()
    audio.currentTime = 0
  }

  const start_stop = () => {
    setDisplayTime((prev) =>({
      ...prev,
      timerRunning: !displayTime.timerRunning
    }))
  }

  const changeBreakTime = (time) => {
    if(displayTime.timerRunning) return;
    setBreakTime(time)
  }

  const changeSessionTime = (time) => {
    if(displayTime.timerRunning) return;
    setSessionTime(time)
    setDisplayTime({
      time: time,
      timeType: 'Session',
      timerRunning: false
    })
  }

  const decrementDisplay = () => {
    console.log(displayTime);
    setDisplayTime((prev) =>({
      ...prev,
      time: prev.time - 1
    }))
  }

  return (
    <>
      <div className="clock">
        <div className="setters">
          <div className="break">
            <h4 id="break-label">Break Length</h4>
            <TimeSetter 
            time={breakTime} 
            setTime={changeBreakTime} 
            min={min} 
            max={max} 
            interval={interval} 
            type={'break'} />
          </div>
          <div className="session">
            <h4 id="session-label">Session Length</h4>
            <TimeSetter 
            time={sessionTime} 
            setTime={changeSessionTime} 
            min={min} 
            max={max} 
            interval={interval} 
            type={'session'} />
          </div>
        </div>
        <Display displayState={displayTime} reset={reset} startStop={start_stop} />
        <audio id='beep' src={alarm}></audio>
      </div>
    </>
  )
}

export default App
