import {some} from 'lodash';

import {
    GAME_STATE,
    PARCEL_SCORES,
    PARCEL_TYPES,
    STATUS
} from '../constants';
import {getRandomInteger} from "./data.service";

let teamsInInfinityLevel = [];

const speech = new SpeechSynthesisUtterance();
speech.rate = .9;
speech.pitch = 1;
speech.lang = 'en-EN';
export const speechService = {
    speech: (event) => {
        speech.text = event.text;
        speechSynthesis.speak(speech);
    },
};

export const getTeamsReadyForNextStep = ({teams, parcels, gameStep}) => teams
    .filter(team => {
        const hasTeamAvailableParcel = some(
            parcels,
            (parcel) => {
                return (
                    (
                        GAME_STATE[gameStep]
                        && GAME_STATE[gameStep].level >= 0
                        && parcel.teamId === team.teamId
                        && parcel.score > 0
                        && parcel.status === STATUS.AVAILABLE
                    )
                );
            }
        );
        const hasAllAvailableParcel = some(
            parcels,
            (parcel) => {
                return (
                    (
                        GAME_STATE[gameStep]
                        && GAME_STATE[gameStep].level >= 5
                        && parcel.teamId === 'all'
                        && parcel.score > 0
                        && parcel.status === STATUS.AVAILABLE
                    )
                );
            }
        );
        return !hasTeamAvailableParcel && !hasAllAvailableParcel;
    });

export const updateValidatedTeams = ({teams = [], team, gameState}) => {
    const filteredTeams = teams.filter((existingTeam) => existingTeam.teamId !== team.teamId);
    // console.log('update', filteredTeams, team, gameState)
    const updated = [
        ...filteredTeams,
        {
            ...team,
            gameState,
        },
    ];
    // console.log('updated', updated)
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
        speechService.speech({
            text: `Team ${team.teamId.split('-')[0]} reach level 1!`,
        });
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
        speechService.speech({
            text: `Team ${team.teamId.split('-')[0]} reach level 2!`,
        });
        [
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 1,
                score: PARCEL_SCORES['0'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 1,
                score: PARCEL_SCORES['50'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 1,
                score: PARCEL_SCORES['100'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 1,
                score: PARCEL_SCORES['200'],
            },
        ].map(async parcel => await createParcelsFn(parcel));
    },
    3: (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step 3`);
        speechService.speech({
            text: `Team ${team.teamId.split('-')[0]} reach level 3!`,
        });
        [
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 2,
                score: PARCEL_SCORES['0'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 1,
                score: PARCEL_SCORES['50'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 1,
                score: PARCEL_SCORES['100'],
            },
            {
                type: PARCEL_TYPES.SPEED_BOOST,
                targetTeam: team.teamId,
                number: 1,
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: 'all',
                number: 1,
                score: PARCEL_SCORES['100'],
            }
        ].map(async parcel => await createParcelsFn(parcel));
    },
    4: (createParcelsFn, team) => {
        speechService.speech({
            text: `Team ${team.teamId.split('-')[0]} reach level 4!`,
        });
        console.log(`create parcels for team ${team.teamId}, step 4`);
        [
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 3,
                score: PARCEL_SCORES['0'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 2,
                score: PARCEL_SCORES['50'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: 'all',
                number: 1,
                score: PARCEL_SCORES['100'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: 'all',
                number: 1,
                score: PARCEL_SCORES['200'],
            }
        ].map(async parcel => await createParcelsFn(parcel));
    },
    5: (createParcelsFn, team) => {
        console.log(`create parcels for team ${team.teamId}, step 5`);
        speechService.speech({
            text: `Team ${team.teamId.split('-')[0]} reach level 5!`,
        });
        [
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 2,
                score: PARCEL_SCORES['0'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 2,
                score: PARCEL_SCORES['-50'],
            },
            {
                type: PARCEL_TYPES.SPEED_BOOST,
                targetTeam: 'all',
                number: 1,
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: 'all',
                number: 1,
                score: PARCEL_SCORES['50'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: 'all',
                number: 1,
                score: PARCEL_SCORES['100'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: 'all',
                number: 1,
                score: PARCEL_SCORES['200'],
            }
        ].map(async parcel => await createParcelsFn(parcel));
    },
    1000000: async (createParcelsFn, team) => {
        if (teamsInInfinityLevel.every(teamId => teamId !== team.teamId)) {
            teamsInInfinityLevel.push(team.teamId);
            speechService.speech({
                text: `Team ${team.teamId.split('-')[0]} reach level infinity!`,
            });
        }
        console.log(`create parcels for team ${team.teamId}, step infinity`);
        const generatedParcels = [
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 3,
                score: PARCEL_SCORES['-100'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: team.teamId,
                number: 3,
                score: PARCEL_SCORES['0'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: 'all',
                number: 2,
                score: PARCEL_SCORES['50'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: 'all',
                number: 1,
                score: PARCEL_SCORES['100'],
            },
            {
                type: PARCEL_TYPES.CLASSIC,
                targetTeam: 'all',
                number: 1,
                score: PARCEL_SCORES['200'],
            }
        ];
        // TODO randomly add speed boost parcel
        generatedParcels.map(async parcel => await createParcelsFn(parcel));
    },
};
