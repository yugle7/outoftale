import PocketBase from 'pocketbase'
import { writable } from "svelte/store";

import { PUBLIC_PB_URL } from '$env/static/public'

export const screen = writable(null);
export const params = writable({});
export const loaded = writable(true);
export const edited = writable({});
export const search = writable('');
export const create = writable(false);

export const back = writable('');
export const role_rating = [0, 5, 100, 1000];

export const member_became = 'yny763xiqeqteno';

export const pb = new PocketBase(PUBLIC_PB_URL);
pb.autoCancellation(false);

function getCode(s, i) {
    const n = s.charCodeAt(i);
    return n < 58 ? n - 48 : n - 87;
}
function getChar(n) {
    if (n >= 36) {
        n -= 36;
    }
    return String.fromCharCode(n < 10 ? n + 48 : n + 87);
}
export function subId(a, b) {
    let s = '';
    for (let i = 0; i < 15; i++) {
        s += getChar(36 + getCode(a, i) - getCode(b, i));
    }
    return s;
}
export function addId(a, b) {
    let s = '';
    for (let i = 0; i < 15; i++) {
        s += getChar(getCode(a, i) + getCode(b, i));
    }
    return s;
}

export function getAuthor(user) {
    const { username, position } = user;
    return { username, position };
}

export function getProblem(problem) {
    const { title, weight, categories, status } = problem;
    return { title, weight, categories, status };
}

export function getDraft(problem) {
    const { title, categories, condition, notes, answer, proof } = problem;
    return { title, categories, condition, notes, answer, proof };
}

export function getSolution(solution) {
    const { reviewer_id, progress, answer, proof } = solution;
    return { reviewer_id, progress, answer, proof };
}