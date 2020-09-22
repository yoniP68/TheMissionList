import React, { Component } from 'react';
import './Home.scss';
import { MissionForm } from '../MissionFormComponent/MissionForm';
import { MissionList } from '../MissionListComponent/MissionList';
import axios from 'axios';
import AlertMassage from '../Shared/Components/SnackBarAlert';
import Button from '@material-ui/core/Button';
import CachedIcon from '@material-ui/icons/Cached';

export class Home extends Component {
  static displayName = Home.name;

  constructor(props) {
    super(props);

    this.state = {
      missions: [],
      status: null,
      isLoading: false
    };

    this.addMission = this.addMission.bind(this);
    this.loadMissions = this.loadMissions.bind(this);
    this.showErrorBar = this.showErrorBar.bind(this);
  }

  /** Load all of my missions after the component is mounted. */
  componentDidMount() {
    axios.get('https://localhost:5001/mission/GetMyMissions').then(res => {
      this.setState({ missions: res.data });
    }).catch(err => {
      this.showErrorBar();
    }).finally(() => {
      this.setState({ isLoading: false })
    });
  }

  /** 
   * Add a mission to the missions list. 
   * The mission is submited from the mission form.
   */
  addMission(mission) {
    const data = { MissionDesc: mission.missionDesc, File: mission.file }
    axios.post(
      'https://localhost:5001/mission',
      JSON.stringify(data),
      { headers: { 'Content-Type': 'application/json' } }
    ).then(res => {
      this.setState(prevState => ({
        missions: [...prevState.missions, res.data]
      }));
    }).catch(err => {
      this.showErrorBar();
    });
  }

  /** Load all missions from all 'users'. */
  loadMissions() {
    this.setState({ isLoading: true });
    axios.get('https://localhost:5001/mission/Get').then(res => {
      // let x = this.state.missions.concat([res.data]);
      this.setState({ missions: res.data });
    }).catch(err => {
      this.showErrorBar();
    }).finally(() => {
      this.setState({ isLoading: false })
    });
  }

  /** Show the error snackbar. */
  showErrorBar(err) {
    this.setState({ status: { msg: err || "Error occurred", key: Math.random() } })
  }

  render() {
    return (
      <div id="home-content">
        <div id="form">
          <MissionForm addMission={this.addMission} showErrorBar={this.showErrorBar} />
        </div>
        <div id="list">
          <div id="header">
            The Missions
            <Button id="load-button" endIcon={<CachedIcon />} onClick={this.loadMissions} uppercase={false}>Load all</Button>
          </div>
          <MissionList missions={this.state.missions} isLoading={this.state.isLoading} />
        </div>
        {this.state.status ? <AlertMassage key={this.state.status.key} message={this.state.status.msg} /> : null}
      </div>
    );
  }
}
