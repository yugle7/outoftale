import { writable } from "svelte/store";
import { subId } from "$lib";

export const show = writable(null);
export const look = writable(null);
export const down = writable(null);
export const find = writable(null);
export const edit = writable(null);
export const menu = writable(null);

export const scroll = writable(null);
export const select = writable(null);

export const reply = writable(null);

export const message_react = [1, 2, 3, 4, 5, 6];

export const react_color = {
    'like': 'green',
    'dislike': 'red',
    'smile': 'yellow',
    'sad': 'blue',
    'love': 'pink',
    'serious': 'brown',
};

export const react_key = ['', 'like', 'dislike', 'love', 'smile', 'sad', 'serious'];

export const chat_type = [
    'Личная переписка',
    'Совместное общение',
    'Уточняю условие',
    'Смотрю как решали',
    'Сочиняю условие',
    'Придумываю решение',
    'Решаю задачу',
    'Проверяю решение',
    'Обсуждаю правку',
    'Вопросы про сайт'
];

export function isClick(window) {
    let selection = window.getSelection();
    if (!selection) return true;
    try {
        let range = selection.getRangeAt(0);
        return range.startOffset == range.endOffset;
    } catch (err) {
        console.log(err.message);
        return true;
    }
}

export function parseUsernames(text) {
    return text.match(/(^|\s)@[a-z]{3,}\b/g)?.map((u) => u.substr(u[0] === '@' ? 1 : 2)) || [];
}

export function getTitle(chat, talk) {
    return chat.type === 0 ? talk.user.username : chat.title;
}

export function getUrl(chat) {
    const { type, talk } = chat;
    let url;

    if (type === 0) url = `/users/${talk.user.username}`;
    else if (type === 1) url = `/discussions/${chat.id}`;
    else if (type < 6) url = `/problems/${subId(chat.id, String(type).repeat(15))}`
    else if (type === 6) url = `/problems/${subId(chat.id, talk.profile_id)}`
    else if (type === 7) url = `/solutions/${chat.id}`
    else if (type === 8) url = `/drafts/${chat.id}`

    return `${url}?type=${type}`
}
