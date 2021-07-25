import { program } from 'commander';
import { Relationship, RelationshipType } from './src/Model';
import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';
import axios from 'axios';

const charDir = path.join(__dirname, 'src', 'data', 'characters');
const mccMetadataDir = path.join(__dirname, 'src', 'metadata', 'mccMetadata');
const relationshipsDir = path.join(__dirname, 'src', 'relationships');

program
    .command('new <ign> [name]')
    .option('-y, --yt <url>', 'youtube', '')
    .option('-t, --twt <url>', 'twitter', '')
    .option('-j, --twitch <url>', 'twitch', '')
    .action(async (ign, name) => {
        const { yt, twt, twitch } = program.opts();
        let lastCharacterFileName = fs.readdirSync(charDir).pop();
        let lastId = 0;
        if (lastCharacterFileName) {
            lastCharacterFileName = path.parse(lastCharacterFileName).base;
            lastId = parseInt(lastCharacterFileName.substring(0, lastCharacterFileName.indexOf('_')));
        }
        const id = lastId + 1;

        let uuid = '';
        try {
            const res = await axios
                .get(`https://mcuuid.net/?q=${ign}`)
                .then(res => parse(res.data).querySelector('#results_id'));
            if (!res) throw new Error('No res id field found');
            uuid = res.getAttribute('value') || '';
        } catch (e) {
            console.error(`Unable to retrieve UUID for ${ign} (${e.message}); please set manually`);
        }

        const res = {
            character_id: id,
            ign,
            name: name || ign,
            socials: {
                youtube: yt ? yt : undefined,
                twitch: twitch ? twitch : undefined,
                twitter: twt ? twt : undefined,
            },
        };

        const charFilePath = path.join(charDir, `${id}_${ign}.json`);
        console.info(JSON.stringify(res));
        fs.writeFileSync(charFilePath, JSON.stringify(res));
        console.info(`Created ${charFilePath}`);
    });

const mccProgram = program.command('mcc');
mccProgram
    .command('add <id>')
    .description('add a player by id to the mcc data')
    .action(id => {
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) {
            console.error(`error: id must be a number (given ${id})`);
            return;
        }

        // check if there's a char file
        let charJsonFile = fs.readdirSync(charDir).find(s => s.startsWith(id));
        if (!charJsonFile) {
            console.error(`No character exists with id ${id}`);
            return;
        }
        charJsonFile = path.join(mccMetadataDir, path.parse(charJsonFile).base);

        // make sure there isn't already a metadata file
        if (fs.existsSync(charJsonFile)) {
            console.error(`Metadata file for ${id} already exists`);
            return;
        }

        fs.writeFileSync(
            charJsonFile,
            JSON.stringify({
                smp_id: 2,
                character_id: parsedId,
                wins: 0,
            })
        );
        console.info(`Added ${charJsonFile} to mcc metadata`);
    });

mccProgram
    .command('team <season> <number> <color> <team> [players]')
    .description('add a mcc team to the data')
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
                    season: parseInt(season),
                    part: `MCC${part}`,
                });
            }
        }
        console.info(JSON.stringify(links));

        const teamFilePath = path.join(relationshipsDir, `mcc_${type.replace(' ', '_')}.json`);
        let teams = [];
        if (!fs.existsSync(teamFilePath)) {
            teams = [];
            console.info(`Creating ${teamFilePath}...`);
        } else {
            teams = JSON.parse(fs.readFileSync(teamFilePath, 'utf8'));
            console.info(`Adding teams to ${teamFilePath}...`);
        }
        teams.push(...links);
        fs.writeFileSync(teamFilePath, JSON.stringify(teams));
    });

program.parse();
