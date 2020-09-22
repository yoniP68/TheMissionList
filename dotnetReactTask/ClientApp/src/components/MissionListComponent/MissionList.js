import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';
import { AnimatedList } from 'react-animated-list';

import './MissionList.scss'



export class MissionList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const missions = this.props.missions.map((mission, index, arr) => <div key={index + 1}><ListItem alignItems="flex-start">
            <ListItemAvatar className="avatar-container">
                <Avatar className="mid-avatar" alt={mission.missionDesc ? mission.missionDesc.charAt(0) : "M"} src={mission.file}>{mission.missionDesc ? mission.missionDesc.charAt(0) : "M"}</Avatar>
            </ListItemAvatar>
            <ListItemText className="content">{mission.missionDesc || ""}</ListItemText>
        </ListItem>
            {arr.length - 1 !== index && <Divider variant="inset" component="li" />}</div>)

        const skeletons =
            [<div key={0} id="skeletons">
                {[1, 2, 3].map((v) =>
                    <div key={v} className="skeleton-container">
                        <Skeleton animation="wave" variant="circle" width={60} height={60} />
                        <Skeleton animation="wave" height={10} width="calc(100% - 70px)" />
                    </div>
                )}
            </div>]

        return (
            <div className="animated-list">
                <AnimatedList animation={"grow"} >
                    {this.props.isLoading ? skeletons : missions}
                </AnimatedList>
            </div>
        );
    }
}