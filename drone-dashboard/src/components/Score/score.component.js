import React, {Component} from 'react';
import styled from 'styled-components';

import {STATUS} from '../../constants';
import {
    parseScoreColor,
    parseScoreBorderColor,
} from '../../services/drone.service';

export const ScoreItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  min-height: 50px;
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => parseScoreColor(props)};
  padding-left: 30px;
  border-left: 20px solid ${(props) => parseScoreBorderColor(props)};
  border-radius: 5px;
  i {
    &.status {
        margin-right: 3px;
        margin-left: -26px;    
    }
    &.failure {
      will-change: contents;
      color: red;
      animation: blink 1s steps(1) infinite;
    }
    &.wait_for_command {
      color: deepskyblue;;
    }
    &.leader_board {
      margin-left: 7px;
    }
    &.leader_1 {
      color: deeppink;
    }
  }
  @keyframes blink { 50% { color: transparent; } }
  @-webkit-keyframes blink { 50% { color: transparent; } }
`;

export class Score extends Component {
    hasTopicUrl() {
        return !!this.props.topicUrl;
    }

    hasCommand(status) {
        return (
            status
                ? this.props.command && this.props.command.name === status
                : !!this.props.command && !!this.props.command.name
        );
    }

    renderReadyStatus() {
        return (
            this.hasTopicUrl() &&
            !this.hasCommand()
            ? <i className="material-icons status wait_for_command">timelapse</i>
            : null
        )
    }

    renderMoveStatus() {
        return (
            this.hasTopicUrl() &&
            this.hasCommand(STATUS.MOVE)
            ? <i className="material-icons status wait_for_command">arrow_forward</i>
            : null
        )
    }

    renderFailureStatus() {
        return (
            this.hasCommand(STATUS.READY_FAILED)
            ? <i className="material-icons status failure">broken_image</i>
            : null
        );
    }

    renderLeaderBoard() {
        switch(this.props.index) {
            default:
                return null;
            case 0:
                return <i className="material-icons leader_board leader_1">star</i>
            case 1:
                return <i className="material-icons leader_board leader_1">star_half</i>
            case 2:
                return <i className="material-icons leader_board leader_1">star_border</i>
        }
    }
    render() {
        const failure = (this.props.command && this.props.command.name === STATUS.READY_FAILED )

        return (
            <ScoreItem {...this.props} failure={failure}>
                {
                    this.renderMoveStatus() ||
                    this.renderReadyStatus()
                }
                {this.renderFailureStatus(failure)}
                {this.props.score || 0}
                {this.renderLeaderBoard()}
            </ScoreItem>
        );
    }
}
