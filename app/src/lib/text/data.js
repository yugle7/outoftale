export const parse = (text) => {
    let result = [];

    let code = false;
    text.split('```').forEach((t) => {
        t.split('\n').forEach(r => {
            if (r) result.push(code ? r : getSecretCodeLinkUserText(r));
        });
        code = !code;
    });
    return result;
}

const secret = /\[([^\]]+)\]\(([^\)]+)\)/g;

const getSecretCodeLinkUserText = (text) => {
    const result = [];

    let i = 0;
    for (const res of text.matchAll(secret)) {
        if (i < res.index) {
            addCodeLinkUserText(text.slice(i, res.index), result);
        }
        result.push([getCodeLinkUserText(res[1]), res[2]]);
        i = res.index + res[0].length;
    }
    if (i === 0) {
        addCodeLinkUserText(text, result);
    } else if (i < text.length) {
        addCodeLinkUserText(text.slice(i), result);
    }
    return result;
}
const getCodeLinkUserText = (text) => {
    const result = [];
    addCodeLinkUserText(text, result);
    return result;
}
const addCodeLinkUserText = (text, result) => {
    let code = false;
    text.split('`').forEach((t) => {
        if (code) {
            result.push([t]);
        } else {
            addLinkUserText(t, result);
        }
        code = !code;
    });
}

const url = /(https?:\/\/[a-z0-9.-_]+\.[a-z]{2,}(\/\S*)?)\(([^\)]+)\)/g;

const addLinkUserText = (text, result) => {
    let i = 0;
    for (const res of text.matchAll(url)) {
        if (i < res.index) {
            addUserText(text.slice(i, res.index), result);
        }
        result.push([res[1], res[3]]);
        i = res.index + res[0].length;
    }
    if (i === 0) {
        addUserText(text, result);
    } else if (i < text.length) {
        addUserText(text.slice(i), result);
    }
}

function addUserText(text, result) {
    if (!text) return;

    let i = 0;
    for (const res of text.matchAll(/@([a-z0-9_]+)/g)) {
        if (i < res.index) {
            result.push(text.slice(i, res.index));
        }
        result.push(['@', res[1]]);
        i = res.index + res[0].length;
    }
    if (i === 0) {
        result.push(text);
    } else if (i < text.length) {
        result.push(text.slice(i));
    }
}

