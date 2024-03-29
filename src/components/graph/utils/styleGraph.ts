import { RelationshipType } from '../../../Model';
import { Link, Node } from './buildGraph';
import ColorHash from 'color-hash';
import { getLinkVisibilityFromFilters, LinkFilter, NodeFilter } from './manageGraph';

export const getDirectedSize = (l: Link) => {
    switch (l.type) {
        case RelationshipType.PARENT_CHILD:
        case RelationshipType.ADOPTION:
        case RelationshipType.GOD_RELATIONSHIP:
        case RelationshipType.MAID:
        case RelationshipType.ANCESTOR:
            return 256;
        default:
            return 0;
    }
};

export const getDirectedColor = (l: Link, selectedLinks: Set<number>, selectedNodes: Set<number>) => {
    if ((!selectedLinks.size && !selectedNodes.size) || selectedLinks.has(l.id)) return l.__indexColor || 'black';
    return undefined;
};

export const getLinkCurvature = (l: Link, nf: NodeFilter | undefined, lf: LinkFilter | undefined) => {
    if (l.overlapping.length < 2) return 0;
    const visible = l.overlapping.filter(v => getLinkVisibilityFromFilters(v, nf, lf));
    return visible.length > 1 ? visible.findIndex(v => v === l) / visible.length : 0;
};

export const drawNode = (
    n: Node,
    ctx: CanvasRenderingContext2D,
    selectedNodes: Set<number>,
    selectedLinks: Set<number>,
    offsetColor = 'black'
) => {
    const isSelected = !selectedNodes.size || selectedNodes.has(n.id) || n.links.some(l => selectedLinks.has(l.id));

    const { img, x = 0, y = 0 } = n;
    ctx.save();
    ctx.globalAlpha = isSelected ? 1 : 0.25;
    ctx.beginPath();
    ctx.fillStyle = offsetColor;
    ctx.fillRect(x - 5, y - 5, 16, 16);

    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(x - 6, y - 6, 16, 16);
    img && ctx.drawImage(img, x - 256, y - 256, 512, 512);
    ctx.restore();
};

export const getLinkWidth = (l: Link, selectedLinks: Set<number>, selectedNodes: Set<number>) => {
    if (!selectedLinks.size && !selectedNodes.size) return 0.75;
    if (selectedLinks.has(l.id)) return 3;
    return 0.25;
};

export const getLinkLength = (l: Link, linkCount: number, nodeCount: number) => {
    if (l.type === RelationshipType.NONE) 16 * nodeCount;
    return 0.25 * linkCount;
};

// This is really ugly and should go into a config file or a
//      object map, but, for now, it's gonna do.
const colorHash = new ColorHash();
export const getLinkColor = (l: Link) => {
    switch (l.type) {
        case RelationshipType.PNK_PARROTS:
        case RelationshipType.PNK_PRESENTS:
        case RelationshipType.FUCH_FRANKENSTEINS:
        case RelationshipType.UH_OH_CHONK:
            return '#D400C5';
        case RelationshipType.RED_RABBITS:
        case RelationshipType.RED_RAVENS:
        case RelationshipType.RED_RABBITS:
        case RelationshipType.KRM_KRAKENS:
        case RelationshipType.SMN_ANGELS:
            return '#AA080B';
        case RelationshipType.ORG_OCELOTS:
        case RelationshipType.ORG_OOZES:
        case RelationshipType.CORAL_CAROLLERS:
        case RelationshipType.WT_FLUX:
            return '#F78322';
        case RelationshipType.YLW_CHICKENS:
        case RelationshipType.YLW_YOLKS:
        case RelationshipType.YLW_YAKS:
        case RelationshipType.MSTD_MUMMIES:
        case RelationshipType.YLW_YETIS:
        case RelationshipType.RA_SHORTS:
            return '#7A4C21';
        case RelationshipType.LIME_LLAMAS:
        case RelationshipType.LIME_LICHES:
        case RelationshipType.MNT_MISTLETOES:
        case RelationshipType.DODGY_DOODLERS:
            return '#6EED0E';
        case RelationshipType.GRN_GUARDIANS:
        case RelationshipType.GRN_GOBLINS:
        case RelationshipType.EMRD_ELVES:
        case RelationshipType.GBLNS:
        case RelationshipType.GREEN_GECKOS:
            return '#225E0A';
        case RelationshipType.CYN_CREEPERS:
        case RelationshipType.CYN_CNDY_CNS:
        case RelationshipType.NOT_THE_RED_TM:
        case RelationshipType.CYN_COYOTES:
        case RelationshipType.CYN_CENTIPEDES:
            return '#006562';
        case RelationshipType.AQUA_ABOMINATIONS:
        case RelationshipType.AQUA_AXOLOTLS:
        case RelationshipType.AQUA_HORSES:
        case RelationshipType.TEAL_TURKEYS:
        case RelationshipType.GOAT:
            return '#03E9DB';
        case RelationshipType.BB_CATS:
        case RelationshipType.BLUE_BATS:
        case RelationshipType.BLUE_BANSHEES:
        case RelationshipType.SAPPH_SANTAS:
        case RelationshipType.SAPPH_SIMMERS:
        case RelationshipType.PWR_BTMS:
            return '#5243D8';
        case RelationshipType.PUR_PANDAS:
        case RelationshipType.VIO_VAMPIRES:
        case RelationshipType.PUR_PENGUINS:
        case RelationshipType.BEES:
            return '#60017A';
        default:
            return colorHash.hex(l.type);
    }
};
