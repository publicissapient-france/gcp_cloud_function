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

export const createStepLevel = {
    0: (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step 0`);
        [
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                score: PARCEL_SCORES['50'],
            }
        ].map(async parcel => await createParcelsFn(parcel));
    },
    1: (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step 1`);
        [
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
            }
        ].map(async parcel => await createParcelsFn(parcel));
    },
    2: (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step 2`);
        [
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
            }
        ].map(async parcel => await createParcelsFn(parcel));
    },
    3: (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step 3`);
        [
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
            }
        ].map(async parcel => await createParcelsFn(parcel));
    },
    4: (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step 4`);
        return;
    },
    1000000: async (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step infinity`);
        // TODO Create parcel with some randomness (chance to have parcels is 50 > 100 > 200 > Speed)
        return;
    },
};
