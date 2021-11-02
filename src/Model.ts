export enum RelationshipType {
    // General SMP types
    MARRIED = 'married',
    ENGAGED = 'engaged',
    PARTNER = 'partners',
    EX_FIANCE = 'ex-fiance',
    PARENT_CHILD = 'parent/child',
    DIVORCED = 'divorced',
    DATING = 'dating/dated',
    ANCESTOR = 'ancestor',
    BROKE_UP = 'broke up',
    GOD_RELATIONSHIP = 'godparent',
    ADOPTION = 'adopted',
    ALLIED = 'allied',
    SIBLING = 'sibling',
    DEFAULT = 'default',
    MAID = '"maid" for',
    NONE = 'none',

    // MCC Teams
    RED_RABBITS = 'red rabbits',
    RED_RAVENS = 'red ravens',
    RED_REINDEER = 'red reindeer',
    KRM_KRAKENS = 'krimson krakens',
    SMN_ANGELS = "simon's angels",

    ORG_OCELOTS = 'orange ocelots',
    ORG_OOZES = 'orange oozes',
    CORAL_CAROLLERS = 'coral carollers',
    WT_FLUX = 'what the flux',

    YLW_CHICKENS = 'yellow chickens',
    YLW_YOLKS = 'yellow yolks',
    YLW_YAKS = 'yellow yaks',
    MSTD_MUMMIES = 'mustard mummies',
    YLW_YETIS = 'yellow yetis',
    RA_SHORTS = "rick astley's shorts",

    LIME_LLAMAS = 'lime llamas',
    LIME_LICHES = 'lime liches',
    MNT_MISTLETOES = 'mint mistletoes',
    DODGY_DOODLERS = 'dodgy doodlers',

    GRN_GUARDIANS = 'green guardians',
    EMRD_ELVES = 'emerald elves',
    GBLNS = 'the goblins',
    GREEN_GECKOS = 'green geckos',
    GRN_GOBLINS = 'green goblins',

    CYN_CREEPERS = 'cyan creepers',
    CYN_CNDY_CNS = 'cyan candy canes',
    NOT_THE_RED_TM = 'not the red team',
    CYN_COYOTES = 'cyan coyotes',
    CYN_CENTIPEDES = 'cyan centipedes',

    AQUA_HORSES = 'aqua horses',
    AQUA_AXOLOTLS = 'aqua axolotls',
    AQUA_ABOMINATIONS = 'aqua abominations',
    TEAL_TURKEYS = 'teal turkeys',
    GOAT = 'g.o.a.t',

    BLUE_BATS = 'blue bats',
    SAPPH_SIMMERS = 'sapphire simmers',
    BB_CATS = 'blue black cats',
    SAPPH_SANTAS = 'sapphire santas',
    PWR_BTMS = 'power bottoms',
    BLUE_BANSHEES = 'blue banshees',

    PUR_PANDAS = 'purple pandas',
    VIO_VAMPIRES = 'violet vampires',
    PUR_PENGUINS = 'purple penguins',
    BEES = 'beeeeeeees',

    PNK_PARROTS = 'pink parrots',
    FUCH_FRANKENSTEINS = 'fuchsia frankensteins',
    PNK_PRESENTS = 'pink presents',
    UH_OH_CHONK = 'uh oh chonky',
}

export interface Relationship {
    type: RelationshipType;
    to_id: number;
    from_id: number;
    smp_id: number;
    smp?: Partial<SMP>;
    to?: Partial<Character>;
    from?: Partial<Character>;
    note?: string;
    season?: string;
    part?: string;
}

export interface SMP {
    smp_id: number;
    max_lives: number;
    name: string;
    description: string;
    primary_color: string;
    secondary_color: string;

    relationships?: Partial<Relationship>[];
    characterMetadata?: Partial<CharacterMetadata>[];
}

export interface SMPData {
    smp: SMP;
    relationships: Relationship[];
    characters: CharacterWithContext[];
}

export interface CharacterMetadata {
    smp_id: number;
    smp?: Partial<SMP>;

    character_id: number;
    character?: Partial<Character>;

    lives: number;
    wins?: number;
    wiki_url: string;
    factions: string[];
    quote?: string;
}

export interface Socials {
    youtube?: string;
    reddit?: string;
    twitch?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
    tiktok?: string;
    other?: string;
}

export interface Character {
    character_id: number;
    ign: string;
    name: string;
    uuid: string;
    socials?: Socials;

    fields?: {
        headSrc: string;
        bodySrc: string;
    };

    // Fields which may be useful/implementable later
    quote?: string;
    smpMetadata?: Partial<CharacterMetadata>[];
}

export type CharacterWithContext = Character & CharacterMetadata;
