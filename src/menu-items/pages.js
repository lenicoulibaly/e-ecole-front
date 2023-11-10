// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconKey, IconReceipt2, IconBug, IconBellRinging, IconPhoneCall, IconQuestionMark, IconShieldLock } from '@tabler/icons-react';

// constant
const icons = {
    IconKey,
    IconReceipt2,
    IconBug,
    IconBellRinging,
    IconPhoneCall,
    IconQuestionMark,
    IconShieldLock
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'administration',
    title: <FormattedMessage id="administration" />,
    caption: <FormattedMessage id="pages-caption" />,
    icon: icons.IconKey,
    type: 'group',
    children: [
        {
            id: 'droits d\'accès',
            title: <FormattedMessage id="droit d'accès" />,
            type: 'collapse',
            icon: icons.IconKey,
            children: [
                {
                    id: 'utilisateurs',
                    title: <FormattedMessage id="utilisateurs" />,
                    type: 'item',
                    url: '/administration/access/users',
                    target: false
                },
                {
                    id: 'roles',
                    title: <FormattedMessage id="rôles" />,
                    type: 'item',
                    url: '/administration/access/roles',
                    target: false
                },
                {
                    id: 'privilèges',
                    title: <FormattedMessage id="privilèges" />,
                    type: 'item',
                    url: '/administration/access/privileges',
                    target: false
                },
            ]
        },
        {
            id: 'paramètres',
            title: <FormattedMessage id="paramètres" />,
            type: 'collapse',
            icon: icons.IconReceipt2,
            children: [
                {
                    id: 'types',
                    title: <FormattedMessage id="types" />,
                    type: 'item',
                    url: '/administration/parametres/types'
                },
                {
                    id: 'filières',
                    title: <FormattedMessage id="filières" />,
                    type: 'item',
                    url: '/administration/parametres/filieres'
                }
            ]
        }
    ]
};

export default pages;
