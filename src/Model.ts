export enum RelationshipType {
    // General SMP types
    MARRIED = 'married',
    ENGAGED = 'engaged',
    EX_FIANCE = 'ex-fiance',
    PARENT_CHILD = 'parent/child',
    DIVORCED = 'divorced',
    DATING = 'dating/dated',
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

    ORG_OCELOTS = 'orange ocelots',
    ORG_OOZES = 'orange oozes',
    CORAL_CAROLLERS = 'coral carollers',

    YLW_CHICKENS = 'yellow chickens',
    YLW_YOLKS = 'yellow yolks',
    YLW_YAKS = 'yellow yaks',
    MSTD_MUMMIES = 'mustard mummies',
    YLW_YETIS = 'yellow yetis',

    LIME_LLAMAS = 'lime llamas',
    MNT_MISTLETOES = 'mint mistletoes',

    GRN_GUARDIANS = 'green guardians',
    EMRD_ELVES = 'emerald elves',

    CYN_CREEPERS = 'cyan creepers',
    CYN_CNDY_CNS = 'cyan candy canes',

    AQUA_HORSES = 'aqua horses',
    AQUA_AXOLOTLS = 'aqua axolotls',
    AQUA_ABOMINATIONS = 'aqua abominations',
    TEAL_TURKEYS = 'teal turkeys',

    BLUE_BATS = 'blue bats',
    SAPPH_SIMMERS = 'sapphire simmers',
    BB_CATS = 'blue black cats',
    SAPPH_SANTAS = 'sapphire santas',

    PUR_PANDAS = 'purple pandas',
    VIO_VAMPIRES = 'violet vampires',
    PUR_PENGUINS = 'purple penguins',

    PNK_PARROTS = 'pink parrots',
    FUCH_FRANKENSTEINS = 'fuchsia frankensteins',
    PNK_PRESENTS = 'pink presents',
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
    season?: number;
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
    faction: string;
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
