import {some} from "lodash";

import {
    GAME_STATE,
    PARCEL_SCORES,
    PARCEL_TYPES,
    STATUS
} from '../constants';

export const getTeamsReadyForNextStep = ({ teams, parcels }) => teams
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

export const getUpdatedTeamGameState = ({team, gameStep}) => {
    return {
        ...team,
        gameStep,
    };
};

export const createStep = async (parcels, createParcelsFn) => await parcels.map(parcel => createParcelsFn(parcel));

export const createStepLevel = {
    0: async (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step 0`)
        await createStep([
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                score: PARCEL_SCORES['50'],
            },
        ], createParcelsFn);
    },
    1: async (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step 1`)
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
    },
    2: async (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step 2`)
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
            },
        ], createParcelsFn);
    },
    3: async (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step 3`)
        await createStep([
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 3,
                score: PARCEL_SCORES['50'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 2,
                score: PARCEL_SCORES['100'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 2,
                score: PARCEL_SCORES['200'],
            },
            {
                type: PARCEL_TYPES.SPEED_BOOST,
                number: 1,
            },
        ], createParcelsFn);
    },
    4: async (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step 4`)
        await Promise.resolve();
    },
    1000000: async (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step default`)
        // TODO Create parcel with some randomness (chance to have parcels is 50 > 100 > 200 > Speed)
        await Promise.resolve();
    },
};
