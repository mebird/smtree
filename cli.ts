import { program } from 'commander';
import { Relationship, RelationshipType } from './src/Model';

program
    .command('mcc <season> <number> <color> <team> [players]')
    .description('output json for an mcc team')
    .action((season, part, color, team) => {
        const players = program.args.slice(5);
        const playerNos: number[] = players.map(v => parseInt(v));
        for (let i = 0; i < playerNos.length; i++) {
            if (isNaN(playerNos[i])) {
                console.error(`error: non-numeric player number (${players[i]} at position ${i})`);
                return;
            }
        }

        if (isNaN(parseInt(season))) {
            console.error(`error: season must be a number (given ${season})`);
            return;
        }

        if (isNaN(parseInt(part))) {
            console.error(`error: invalid game for season ${season} (${part})`);
            return;
        }

        const type = `${color} ${team}`.toLowerCase() as RelationshipType;
        if (!Object.values(RelationshipType).includes(type)) {
            console.error(`error: invalid team name (${type})`);
            return;
        }

        const links: Relationship[] = [];
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                links.push({
                    to_id: playerNos[i],
                    from_id: playerNos[j],
                    type,
                    smp_id: 2,
                    season: 1,
                    part: `MCC${part}`,
                });
            }
        }
        console.info(JSON.stringify(links));
    });

program.parse();
