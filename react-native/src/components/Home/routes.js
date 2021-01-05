import ROLES from '../../types/Roles.js';
import CreateTag from '../../containers/CreateTag';
import OpenTags from '../../containers/OpenTags';
import TaskToDo from '../../containers/TaskToDo/index.js';
import { COLORS } from '../../constants/common';
import Audit from '../../containers/Audit/index.js';
import Achievements from '../../containers/Achievements/index.js';
import Trans from '../../translation/Trans.js';

const routes = [
    {
        roles: [ROLES.EMPLOYEE, ROLES.MANAGER],
        routes: [
            {
                id: 1,
                path: '/home/create-tag',
                label: Trans.HOME_CREATE_TAG,
                imgName: 'createTag',
                bgColor: COLORS.blue,
                component: CreateTag,
            },
            {
                id: 2,
                path: '/home/task-todo',
                label: Trans.HOME_TASK_TO_DO,
                imgName: 'openTags',
                bgColor: COLORS.purple,
                component: TaskToDo,
            },

            {
                id: 4,
                path: '/home/achievements',
                label: Trans.HOME_ACHIEVEMENTS,
                imgName: 'achievements',
                bgColor: COLORS.red,
                component: Achievements,
            },
            {
                id: 5,
                path: '/home/audit',
                label: Trans.HOME_AUDIT,
                imgName: 'audit',
                bgColor: COLORS.blue2,
                component: Audit,
            },
        ],
    },
    {
        roles: [ROLES.MANAGER],
        routes: [
            {
                id: 3,
                path: '/home/open-tags',
                label: Trans.HOME_OPEN_TAG,
                imgName: 'openTags',
                bgColor: COLORS.orange,
                component: OpenTags,
            },
        ],

    },
];

export default routes;
