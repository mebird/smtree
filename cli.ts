import { program } from 'commander';
import { Relationship, RelationshipType } from './src/Model';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { isString, max } from 'lodash';

const charDir = path.join(__dirname, 'src', 'data', 'characters');
const mccMetadataDir = path.join(__dirname, 'src', 'data', 'metadata', 'mccMetadata');
const relationshipsDir = path.join(__dirname, 'src', 'data', 'relationships');

program
    .command('new <ign> [name]')
    .option('-y, --yt <url>', 'youtube', '')
    .option('-t, --twt <url>', 'twitter', '')
    .option('-j, --twitch <url>', 'twitch', '')
    .action(async (ign, name, { yt, twt, twitch }) => {
        const characterFilenames = fs.readdirSync(charDir);

        // check if there's already a file for this char
        const match = characterFilenames.find(f => f.includes(`_${ign}.json`));
        if (match) {
            console.error(`File already exists for character: ${match}`);
            return;
        }

        // find the max id in use
        const takenIds = fs.readdirSync(charDir).map(f => {
            const fn = path.parse(f).base;
            return parseInt(fn.substring(0, fn.indexOf('_')));
        });
        const id = (max(takenIds) || -1) + 1;

        // get mc uuid
        let uuid = '';
        try {
            uuid = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`).then(res => res.data.id);
        } catch (e) {
            console.error(`Unable to retrieve UUID for ${ign} (${e.message}); please set manually`);
        }

        const res = {
            character_id: id,
            ign,
            name: name || ign,
            uuid,
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
    .command('team <season> <number> <color> <team> <players...>')
    .option('-w, --winners', 'if the given team won or not', false)
    .description('add a mcc team to the data')
    .action((season, part, color, team, players: string[], { winners }) => {
        const playerNos: number[] = players.map(v => parseInt(v));
        for (let i = 0; i < playerNos.length; i++) {
            if (isNaN(playerNos[i])) {
                console.error(`error: non-numeric player number (${players[i]} at position ${i})`);
                return;
            }
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
                    season,
                    part: `MCC${part}`,
                });
            }
        }
        console.info(JSON.stringify(links));

        const teamFilePath = path.join(relationshipsDir, `mcc_${type.replace(' ', '_')}.json`);
        let teams = [];
        if (!fs.existsSync(teamFilePath)) {
            teams = [];
            console.info(`Creating ${teamFilePath}`);
        } else {
            teams = JSON.parse(fs.readFileSync(teamFilePath, 'utf8'));
            console.info(`Adding teams to ${teamFilePath}`);
        }
        teams.push(...links);
        fs.writeFileSync(teamFilePath, JSON.stringify(teams, null, 4));

        if (winners) {
            console.info('Incrementing wins for winners');
            const fileNames = fs.readdirSync(mccMetadataDir);
            const remainingPnos = new Set(playerNos);
            for (const fn of fileNames) {
                for (const pNo of remainingPnos.values()) {
                    if (fn.startsWith(`${pNo}_`)) {
                        const playerMetadataPath = path.join(mccMetadataDir, fn);
                        remainingPnos.delete(pNo);
                        const player = JSON.parse(fs.readFileSync(playerMetadataPath, 'utf8'));
                        player.wins++;
                        fs.writeFileSync(playerMetadataPath, JSON.stringify(player, null, 4));
                        break;
                    }
                }
            }
        }
    });

mccProgram.command('validate').action(() => {
    // Get all metadata
    const mccMetadataFileNames = fs.readdirSync(mccMetadataDir);

    // For each in the metadata, add their id to the participants and validate things match
    const playerNos = new Set<number>();
    for (const playerFileName of mccMetadataFileNames) {
        const id = parseInt(playerFileName.substring(0, playerFileName.indexOf('_')));
        playerNos.add(id);
        if (isNaN(id)) {
            console.error(`Invalid metadata file name: ${playerFileName}`);
        }

        const characterFilePath = path.join(charDir, playerFileName);
        const metadataFilePath = path.join(mccMetadataDir, playerFileName);
        if (!fs.existsSync(characterFilePath)) {
            console.error(`No character file, but given metadata file: ${playerFileName}`);
            return;
        }

        const characterJson = JSON.parse(fs.readFileSync(characterFilePath, 'utf8'));
        const metadataJson = JSON.parse(fs.readFileSync(characterFilePath, 'utf8'));
        if (metadataJson.character_id != id) {
            console.error(`Mismatched file and char ids: ${metadataFilePath}`);
            return;
        }
        if (characterJson.character_id != id) {
            console.error(`Mismatched file and char ids: ${metadataFilePath}`);
            return;
        }
    }

    // Validate all relationships
    const mccRelationshipFileNames = fs.readdirSync(relationshipsDir).filter(fn => fn.startsWith('mcc_'));
    for (const mccRelationshipFileName of mccRelationshipFileNames) {
        const relationships = JSON.parse(fs.readFileSync(path.join(relationshipsDir, mccRelationshipFileName), 'utf8'));
        for (const relationship of relationships) {
            const { to_id, from_id, type, smp_id, season } = relationship;

            if (!season || !isString(season)) {
                console.error(`Invalid season`, mccRelationshipFileName, JSON.stringify(relationship));
                return;
            }

            if (smp_id != 2) {
                console.error(`SMP ID is not equal to 2`, mccRelationshipFileName, JSON.stringify(relationship));
                return;
            }

            if (!playerNos.has(to_id) || !playerNos.has(from_id)) {
                console.error(
                    `Player referenced in relationship missing from metadata files`,
                    mccRelationshipFileName,
                    JSON.stringify(relationship)
                );
                return;
            }

            if (!Object.values(RelationshipType).includes(type)) {
                console.error(`error: invalid team name (${type})`);
                return;
            }
        }
    }
});

program.parse();
