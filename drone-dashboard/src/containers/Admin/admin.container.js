import React, {Component} from 'react';
import styled from 'styled-components';

import {
    GAME_PARAMETERS,
    TEAMS,
} from '../../constants';
import { getRandomInteger } from '../../services/drone.service';

const AdminContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
  flex-flow: column wrap;
`;

const Input = styled.input`
  height: 20px;
  border: #333333 1px dotted;
`;

const Button = styled.button`
  height: 30px;
  min-width: 100px;
  border: #333333 1px solid;
`;

const Line = styled.div`
  width: 100%;
  padding: 10px;
`;

export class Admin extends Component {
    static defaultProps = {};

    constructor() {
        super();
        this.state = {
            numberOfTeams: 3,
        }
    }

    submitInitTeams = (event) => {
        event.preventDefault();
        console.log('submit');
        this.createTeams()
    };

    handleFormChange = (inputId, event) => {
        event.preventDefault();
        this.setState({
            [inputId]: event.target.value,
        });
    };

    generateTeamId() {
        return getRandomInteger(1, 999);
    }

    createTeams() {
        let usedIds = [];
        const iterate = Array.from(Array(this.state.numberOfTeams));
        const teams = iterate.map((value, index) => {
        let id;
        let goodId = null;
        const teamColor = TEAMS[index];
        while(!goodId) {
            id = this.generateTeamId();
            goodId = usedIds.some(usedId => usedId === id) ? null : id;
        }
        usedIds= [
            ...usedIds,
            goodId,
        ];
        if (this.state.numberOfTeams >= usedIds.length) {
        return {
            teamId: `${teamColor}-${id}`,
            location: {
                latitude: 48,
                longitude: 2.3,
            },
        }
        }
        });
        console.log('teams', teams);
    }

    render() {
        return (
            <AdminContainer>
                <h1>Admin</h1>
                <div>
                    <form id="teamsInit">
                        <Line>
                            <label>
                                Number of teams:{' '}
                                <Input
                                    id="numberOfTeams"
                                    type="number"
                                    min="3" max="10"
                                    value={this.state.numberOfTeams}
                                    onChange={this.handleFormChange.bind(this, 'numberOfTeams')} 
                                />
                            </label>
                        </Line>
                        <Line>
                            <Button type="button" onClick={this.submitInitTeams}>
                                Save
                            </Button>
                        </Line>
                    </form>
                </div>
            </AdminContainer>
        )
    }
}

export default Admin;
