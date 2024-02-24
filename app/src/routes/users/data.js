export const default_params = {
    sort: '-rating',
    wanted: false,
    friend: false
};

export const user_sort = {
    '-rating': 'Лучшие',
    '-created': 'Новые',
    created: 'Старые'
};

export const user_role = [
    'Новичок',
    'Участник',
    'Модератор',
    'Админ',
    'Создатель'
];

export function getColor(position) {
    if (position < 5) return 'var(--top-color)';

    const s = 200;

    let r = 0;
    let g = 0;
    let b = 0;

    let k = Math.log(position) / Math.log(4.3) - 1;

    if (k <= 1) {
        r = s;
        b = Math.floor(s * k);
    } else if (k <= 2) {
        r = Math.floor(s * (2 - k));
        b = s;
        g = Math.floor(s / 2 * (k - 1));
    } else if (k <= 3) {
        b = s;
        g = (s + Math.floor(s * (k - 2))) / 2;
    } else if (k <= 4) {
        b = Math.floor(s * (4 - k));
        g = s
    } else if (k <= 5) {
        r = Math.floor(s * (k - 4));
        g = s;
    } else {
        r = g = b = 128;
    }
    return `rgb(${r},${g},${b})`
}

export function plural(k, names) {
    const d = Math.floor(k / 10);
    const m = k % 10;
    let i = 2;
    if (m === 1) {
        i = 0;
    } else if (d != 1 && 1 < m && m < 5) {
        i = 1;
    }
    return `${k} ${names[i]}`;
}