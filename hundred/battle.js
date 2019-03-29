'use strict';

const _ = require('lodash');
const TIMES = 100;

const PLAYER_NAMES = [
    's1',
    's2',
    's3',
];

let players = _.map(PLAYER_NAMES, n => ({
    name: n,
    fn: require('./player/' + n)
}));

const playerMap = {};
_.each(players, p=>{
    playerMap[p.name] = 10000;
});

_.times(TIMES, i => {
    let maxInfo = {score: 0};
    let secondInfo = {};

    let index = 0;
    while (true) {
        const player = players[index % players.length];
        if(player.name == maxInfo.name) {
            break;
        }
        const currentPlayerScore = playerMap[player.name];
        let payScore = parseInt(player.fn(_.clone(maxInfo), _.clone(secondInfo), currentPlayerScore, _.clone(playerMap)) || 0, index);
        payScore = Math.min(currentPlayerScore, payScore);

        if(payScore >= maxInfo.score) {
            secondInfo = maxInfo;
            maxInfo = {name: player.name, score: payScore};
        }

        index ++;
    }

    playerMap[maxInfo.name] += (100 - maxInfo.score);
    if(secondInfo.name) {
        playerMap[secondInfo.name] -= secondInfo.score;
    }else {
        // console.log('max', maxInfo);
        // console.log('second', secondInfo);
        // console.log('list', index, players);
    }

    const last = players.pop();
    players = [last, ...players];
});

function printResult() {
    const results = _.chain(playerMap).map((v,k)=>[k, v]).sortBy(arr=>-arr[1]).value();
    _.each(results, r=> {
        console.log(r[0], r[1]);
    });
}

console.log(playerMap);
printResult();