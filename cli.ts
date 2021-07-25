import { program } from 'commander';
import { Relationship, RelationshipType, Socials } from './src/Model';
import fs from 'fs';
import path from 'path';
import prompt from 'prompt';
import axios from 'axios';
import { isString, max } from 'lodash';
import { resolve } from 'q';

const charDir = path.join(__dirname, 'src', 'data', 'characters');
const mccMetadataDir = path.join(__dirname, 'src', 'data', 'metadata', 'mccMetadata');
const relationshipsDir = path.join(__dirname, 'src', 'data', 'relationships');

program
    .command('new <ign> [name]')
    .option('-s, --socials', 'prompt for socials')
    .action(async (ign, name, { socials: promptForSocials }) => {
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

        // get socials
        const socials: Record<string, string> = {};
        const socialPrompts: (keyof Socials)[] = ['youtube', 'twitch', 'twitter', 'instagram'];
        if (promptForSocials) {
            prompt.message = '';
            prompt.start();
            const res: Record<string, string> = await prompt.get(socialPrompts);
            Object.keys(res).forEach(k => {
                if (res[k]) {
                    socials[k] = res[k];
                }
            });
        }

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
            socials,
        };

        const charFilePath = path.join(charDir, `${id}_${ign}.json`);
        console.info(JSON.stringify(res));
        fs.writeFileSync(charFilePath, JSON.stringify(res));
        console.info(`Created ${charFilePath}`);
    });

// adds an mcc data file; returns true on success and false on failure
const addToMcc = (id: any): boolean => {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        console.error(`error: id must be a number (given ${id})`);
        return false;
    }

    // check if there's a char file
    let charJsonFile = fs.readdirSync(charDir).find(s => s.startsWith(id));
    if (!charJsonFile) {
        console.error(`No character exists with id ${id}`);
        return false;
    }
    charJsonFile = path.join(mccMetadataDir, path.parse(charJsonFile).base);

    // make sure there isn't already a metadata file
    if (!fs.existsSync(charJsonFile)) {
        fs.writeFileSync(
            charJsonFile,
            JSON.stringify({
                smp_id: 2,
                character_id: parsedId,
                wins: 0,
            })
        );
        console.info(`Added ${charJsonFile} to mcc metadata`);
    }
    return true;
};

const mccProgram = program.command('mcc');

mccProgram
    .command('add <id>')
    .description('add a player by id to the mcc data')
    .action(id => {
        addToMcc(id);
    });

mccProgram
    .command('team <season> <number> <team> <players...>')
    .option('-w, --winners', 'if the given team won or not', false)
    .option('-o, --output_team <file>', 'the output team file (if not the default team)')
    .description('add a mcc team to the data')
    .action((season, part, team, players: string[], { winners, output_team }) => {
        const playerNos: number[] = players.map(v => parseInt(v));
        for (let i = 0; i < playerNos.length; i++) {
            if (isNaN(playerNos[i])) {
                console.error(`error: non-numeric player number (${players[i]} at position ${i})`);
                return;
            }
        }

        const type = team.toLowerCase() as RelationshipType;
        if (!Object.values(RelationshipType).includes(type)) {
            console.error(`error: invalid team name (${type})`);
            return;
        }

        console.info('Ensuring all players have a metadata file & char files');
        if (playerNos.some(n => !addToMcc(n))) {
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

        const outputTeam = output_team.toLowerCase() || type;
        if (!Object.values(RelationshipType).includes(outputTeam)) {
            console.error(`error: invalid output team name (${outputTeam})`);
            return;
        }

        const teamFilePath = path.join(relationshipsDir, `mcc_${outputTeam.replace(' ', '_')}.json`);
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

const upsertMetadata = (presentPlayers: Set<number>, id: number, insert: (id: number) => boolean): boolean => {
    if (!presentPlayers.has(id)) {
        console.error(`Player ${id} missing from metadata files; adding`);
        presentPlayers.add(id);
        return insert(id);
    }
    return true;
};

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

    // Validate all relationships & upsert any missing records
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

            if (!upsertMetadata(playerNos, to_id, addToMcc)) return;
            if (!upsertMetadata(playerNos, from_id, addToMcc)) return;

            if (!Object.values(RelationshipType).includes(type)) {
                console.error(`error: invalid team name (${type})`);
                return;
            }
        }
    }
});

program.parse();
