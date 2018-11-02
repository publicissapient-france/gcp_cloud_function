import {some} from "lodash";

import {
    GAME_STATE,
    PARCEL_SCORES,
    PARCEL_TYPES,
    STATUS
} from '../constants';

export const getTeamsReadyForStep = ({ teams, parcels }) => teams
    .filter(team => {
        const hasTeamAvailableParcel = some(
            parcels,
            (parcel) => team.teamId === parcel.teamId && parcel.status === STATUS.AVAILABLE,
        );
        return !hasTeamAvailableParcel;
    });

export const updateValidatedTeams = ({teams = [], team, gameState}) => {
    const filteredTeams = teams.filter((existingTeam) => existingTeam.teamId !== team.teamId);
    console.log('update', filteredTeams, team, gameState)
    const updated = [
        ...filteredTeams,
        {
            ...team,
            gameState,
        },
    ];
    console.log('updated', updated)
    return updated;
};

export const updateTeamGameState = ({team, gameState}) => {
    return {
        ...team,
        gameState,
    };
};

export const createStep = (parcels, createParcelsFn) => parcels.map(parcel => createParcelsFn(parcel));

export const createStepStarted = async (createParcelsFn) => {
    await createStep([
        {
            type: PARCEL_TYPES.CLASSIC,
            targetTeam: 'all',
            score: PARCEL_SCORES['50'],
        },
    ], createParcelsFn);
};

export const createStep1 = async (createParcelsFn, team) => {
    await createStep([
        {
            type: PARCEL_TYPES.CLASSIC,
            targetTeam: team.teamId,
            number: 2,
            score: PARCEL_SCORES['50'],
        },
        {
            type: PARCEL_TYPES.CLASSIC,
            targetTeam: team.teamId,
            number: 1,
            score: PARCEL_SCORES['100'],
        },
    ], createParcelsFn);
};

export const createStep2 = async (createParcelsFn, team) => {
    await createStep([
        {
            type: PARCEL_TYPES.CLASSIC,
            targetTeam: team.teamId,
            number: 2,
            score: PARCEL_SCORES['100'],
        },
        {
            type: PARCEL_TYPES.CLASSIC,
            targetTeam: team.teamId,
            number: 1,
            score: PARCEL_SCORES['200'],
        },
        {
            type: PARCEL_TYPES.SPEED_BOOST,
            number: 1,
            score: PARCEL_SCORES['200'],
        },
    ], createParcelsFn);
};
