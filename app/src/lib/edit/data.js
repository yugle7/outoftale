export const getMask = (values) => {
    let mask = 0;
    for (const v of values) mask |= 1 << v;
    return mask;
};

export const normText = (text) =>
    text
        .toLowerCase()
        .replace(/[^a-zа-яё0-9]/g, ' ')
        .split(' ')
        .filter((t) => t)
        .join(' ');


export function copyPaste(e) {
    let text = (e.clipboardData || window.DataTransfer).getData('text/plain');
    document.execCommand('insertText', false, text);
}

export function pasteToEnd(text) {
    document.execCommand('insertText', false, text);
}
