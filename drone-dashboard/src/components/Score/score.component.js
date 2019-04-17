import React, {Component} from 'react';
import styled from 'styled-components';

import {
    GAME_PARAMETERS,
    STATUS
} from '../../constants';
import {COLORS} from '../../styles/variables';
import {
    parseScoreColor,
    parseScoreBorderColor,
} from '../../services/data.service';
import {isDestinationLocationType} from '../../services/utils.service';

export const ScoreItem = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: calc(100% - 20px);
  min-height: 50px;
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => parseScoreColor(props)};
  padding-left: 30px;
  border-left: 20px solid ${(props) => parseScoreBorderColor(props)};
  border-radius: 5px;
  i {
    &.status {
      will-change: contents;
      margin-right: 3px;
      margin-left: -26px;
    }
    &.default {
      color: darkgrey;
    }
    &.failure {
      color: red;
      animation: blink 1s steps(1) infinite;
    }
    &.move {
      color: rgba(86,200,66,0.89);
      animation: blink 2.5s steps(1, start) infinite;
    }
    &.wait_for_command {
      color: rgba(0,195,255,0.69);
      animation: blink 2.5s steps(1) infinite;
    }
    &.pickup {
      color: rgba(86,200,66,0.89);
      animation: blink 2.5s steps(1, start) 1.25s infinite;
    }
    &.delivery {
      color: rgba(86,200,66,0.89);
      animation: blink 2.5s steps(1, start) 1.25s infinite;
    }
  }
  .leader_board {
    display: inline-block;
    margin-left: 3px;
    font-weight: bold;
    color: deeppink;
    width: 43px;
  }
    @keyframes blink { 50% { color: transparent; } }
    @-webkit-keyframes blink { 50% { color: transparent; } }
`;

const Speed = styled.span`
  font-size: 1.1rem;
  color: ${props => props.speedFactor >= 0 ? COLORS.speedBoost[0] : COLORS.red};
  i {
    font-size: 1.2rem;
  }
  span {
    margin-top: -5px;
  }
`;

export class Score extends Component {
    isDefaultStatus() {
        return !this.hasTopicUrl() && !this.hasCommand();
    }

    isDestinationPickup = () => isDestinationLocationType(this.props.drone, this.props.parcels)('pickup');

    isDestinationDelivery = () => isDestinationLocationType(this.props.drone, this.props.parcels)('delivery');

    hasTopicUrl() {
        return !!this.props.drone.topicUrl;
    }

    hasCommand(status) {
        return (
            status
                ? this.props.drone && this.props.drone.command && this.props.drone.command.name === status
                : !!this.props.drone.command && !!this.props.drone.command.name
        );
    }

    renderDefaultStatus() {
        return (
            this.isDefaultStatus()
                ? <i className="material-icons status default">live_help</i>
                : null
        )
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
            this.hasCommand(STATUS.MOVE) &&
            !this.isDestinationDelivery() &&
            !this.isDestinationPickup()
                ? <i className="material-icons status move">fast_forward</i>
                : null
        )
    }

    renderMoveToPickupStatus() {
        return (
            this.hasTopicUrl() &&
            this.hasCommand(STATUS.MOVE) &&
            this.isDestinationPickup()
                ? <span>
                    <i className="material-icons status move">fast_forward</i>
                    <i className="material-icons status pickup">unarchive</i>
                </span>
                : null
        )
    }

    renderMoveToDeliveryStatus() {
        return (
            this.hasTopicUrl() &&
            this.hasCommand(STATUS.MOVE) &&
            this.isDestinationDelivery()
                ? <span>
                    <i className="material-icons status move">fast_forward</i>
                    <i className="material-icons status delivery">location_on</i>
                </span>
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

    renderSpeed() {
        const speed = this.props.updatedDistancePerTick === undefined ? 0.3 : this.props.updatedDistancePerTick;
        const updatedSeed =  this.props.updatedDistancePerTick === undefined ? 0.3 : this.props.updatedDistancePerTick;
        const bonus = (speed - GAME_PARAMETERS.distancePerTick) / GAME_PARAMETERS.speedBoostValue;
        const handicap = updatedSeed - GAME_PARAMETERS.distancePerTick;
        const speedFactor = ((bonus / GAME_PARAMETERS.speedBoostValue ) - (handicap / GAME_PARAMETERS.speedBoostValue) / GAME_PARAMETERS.speedBoostValue);
        return (
            <Speed speedFactor={speedFactor}>
                <i className="material-icons" style={{width: '14px'}}>flash_on</i>
                <span>{`${speedFactor >= 0 ? '+' : '-'}${Math.abs(speedFactor).toFixed(1)}`}</span>
            </Speed>
        );
    }

    renderLeaderBoard() {
        switch (this.props.index) {
            default:
                return null;
            case 0:
                return (
                    this.props.drone.score > 0 &&
                    (this.props.isPreviousDraw || this.props.index === 0)
                        ? <span className="leader_board leader_1">
                            <i className="material-icons leader_1">star</i>
                            1
                        </span>
                        : null
                );
            case 1:
                return (
                    this.props.drone.score > 0 &&
                    (this.props.isPreviousDraw || this.props.index === 1)
                        ? <span className="leader_board leader_2">
                            <i className="material-icons leader_2">star_half</i>
                            2
                        </span>
                        : null
                );
            case 2:
                return (
                    this.props.drone.score > 0 &&
                    (this.props.isPreviousDraw || this.props.index === 2)
                        ? <span className="leader_board leader_3">
                            <i className="material-icons leader_3">star_border</i>
                            3
                        </span>
                        : null
                );
        }
    }

    render() {
        return (
            <ScoreItem
                {...this.props.drone}
                failure={this.hasCommand(STATUS.READY_FAILED)}
                default={this.isDefaultStatus()}
                title={this.props.drone.teamId ? this.props.drone.teamId.split('-')[0].toLowerCase() : ''}
                onClick={this.props.onClick}
            >
                {
                    this.renderMoveStatus() ||
                    this.renderMoveToPickupStatus() ||
                    this.renderMoveToDeliveryStatus() ||
                    this.renderReadyStatus() ||
                    this.renderFailureStatus() ||
                    this.renderDefaultStatus()
                }
                {this.props.drone.score || 0}
                {this.renderSpeed()}
                {this.renderLeaderBoard()}
            </ScoreItem>
        );
    }
}
