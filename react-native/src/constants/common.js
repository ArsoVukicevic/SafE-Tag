import { URL } from './api';

export const ROUTES = {
    HOME: {
        ROOT: '/home',
        CREATE_TAG: {
            ROOT: '/home/create-tag',
            LOCATION: '/home/create-tag/location',
            CLASSIFICATION: '/home/create-tag/classification',
            RISK_ASSESSMENT: '/home/create-tag/risk-assessment',
            DESCRIPTION: '/home/create-tag/description',
        },
        TASK_TODO: {
            ROOT: '/home/task-todo',
            TASKS: '/home/task-todo/tasks',
            TASKS_DETAILS: '/home/task-todo/details',
            CORRESPODENCE: '/home/task-todo/correspodence',
        },
        OPEN_TAGS: {
            ROOT: '/home/open-tags',
            ASSIGN_TAG: '/home/open-tags/assign-tag',
            DETAILS: '/home/open-tags/details',
        },
        ACHIEVEMENTS: '/home/achievements',
    },
    LOGIN: '/login',
};

export const IMAGES_PATH = URL + 'images/';

export const COLORS = {
    orange: '#FE9600',
    blue: '#0C8EA1',
    purple: '#86249A',
    blue2: '#0096FF',
    yellow: '#FFFF00',
    selectedGreen: '#00930F',
    red: '#b52424',
    CREATE_TAG_BTN: '#D4D0CF',
    CREATE_TAG_LABEL: '#000000'
};

export const MSG_TYPE = {
    TEXT: 1,
    IMAGE: 2,
};


export const STATUS_COLOR = {
    '-1': 'red',
    0: 'gold',
    1: 'green',
};
