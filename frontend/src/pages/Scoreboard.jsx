
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import scoreboardStyles from '../styles/scoreboard.module.css'
import axios from 'axios'

import teamOne from '../assets/toronto.png';
import teamTwo from '../assets/ottawa.png';

import Settings from '../components/Settings.jsx';
import { Modal, Button } from 'antd';

import { SettingOutlined } from '@ant-design/icons';

function Scoreboard() {

  const [time, setTime] = useState(120000);
  const [running, setRunning] = useState(false);

  const [teamOneScore, setTeamOneScore] = useState(0);
  const [teamTwoScore, setTeamTwoScore] = useState(0);

  const [teamOneName, setTeamOneName] = useState("Toronto Maple Leafs");
  const [teamTwoName, setTeamTwoName] = useState("Ottawa Senators")

  const [teamOneImage, setTeamOneImage] = useState(teamOne);
  const [teamTwoImage, setTeamTwoImage] = useState(teamTwo);

  
  function checkSignal() {

    axios.get('http://localhost:3001/getStatus').then(res => {
        console.log(res.data.signal);
        if(res.data.signal == 1)
          handleStart();
        else
          handleStop();
    })

  }

  useEffect(() => {
    let interval = null;
  
    if (running) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };

  }, [running]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkSignal();
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  function handleStart() {
    setRunning(true);
  };
  
  function handleStop() {
    setRunning(false);
  };

  function changeScore(team, score) {
    if(team == 1) {
      let curScore = teamOneScore;
      curScore += score;
      if(curScore <= 0) {
        curScore = 0;
      }
      setTeamOneScore(curScore);
    }
    else if(team == 2) {
      let curScore = teamTwoScore;
      curScore += score;
      if(curScore <= 0) {
        curScore = 0;
      }
      setTeamTwoScore(curScore);
    }
  }

  const [settingsOpen, setSettingsOpen] = useState(false);

  const openSettings = () => {
    setSettingsOpen(true);
  };

  const closeSettings = () => {
    setSettingsOpen(false);
  };

  function checkState() {
    console.log("Axios call");
  }

  

  return (
    <div>
        <div className={scoreboardStyles.topSection}>
          <SettingOutlined onClick={openSettings} className={scoreboardStyles.settings} style={{"color": "white"}}/>
          <Modal title="Settings" visible={settingsOpen} onOk={closeSettings} onCancel={closeSettings} width={1200}>
            <Settings 
              time={time} 
              setTime={setTime} 
              teamOneName={teamOneName} 
              setTeamOneName={setTeamOneName}
              teamTwoName={teamTwoName} 
              setTeamTwoName={setTeamTwoName}
              setTeamOneImage={setTeamOneImage}
              setTeamTwoImage={setTeamTwoImage}
            />
          </Modal>
        </div>
        <div className={scoreboardStyles.spacing}/>
        <div className={scoreboardStyles.middleSection}>
            <div className={scoreboardStyles.teamBox}>
              <img src={teamOneImage} className={scoreboardStyles.teamImage}/>
            </div>
            <div className={scoreboardStyles.centerInfo}>
                <div className={scoreboardStyles.topCenterInfo}>
                    Period 1
                </div>
                <div className={scoreboardStyles.middleCenterInfo}>
                  <div className={scoreboardStyles.buttonStack}>
                    <button className={scoreboardStyles.plus} onClick={()=>changeScore(1, 1)}>+1</button>
                    <br/>
                    <button className={scoreboardStyles.minus} onClick={()=>changeScore(1, -1)}>-</button>
                  </div>
                  {teamOneScore} - {teamTwoScore}
                  <div className={scoreboardStyles.buttonStack}>
                    <button className={scoreboardStyles.plus} onClick={()=>changeScore(2, 1)}>+1</button>
                    <br/>
                    <button className={scoreboardStyles.minus} onClick={()=>changeScore(2, -1)}>-</button>
                  </div>
                </div>
                <div className={scoreboardStyles.bottomCenterInfo}>
                    <div>
                      {("0" + Math.floor((time/6000)%60)).slice(-2) + ":" + ("0" + Math.floor((time/100)%60)).slice(-2)}
                    </div>
                </div>
            </div>
            <div className={scoreboardStyles.teamBox}>
              <img src={teamTwoImage} className={scoreboardStyles.teamImage}/>
            </div>
        </div>
        <div className={scoreboardStyles.teamNameBox}>
          <div className={scoreboardStyles.teamName}>
            {teamOneName}
          </div>
          <div className={scoreboardStyles.teamNameSpacer}></div>
          <div className={scoreboardStyles.teamName}>
            {teamTwoName}
          </div>
        </div>
        <div className={scoreboardStyles.bottomSection}>
          <div className={scoreboardStyles.startStop}>
            <button onClick={()=>handleStop()} className={scoreboardStyles.stop}>
              Pause
            </button>
            
            <button onClick={()=>handleStart()} className={scoreboardStyles.start}>
              Start
            </button>
          </div>
        </div>
        <div className={scoreboardStyles.spacing}></div>
        <div className={scoreboardStyles.spacing}></div>            
    </div>
  )
}

export default Scoreboard;