export const react_color = {
    'like': 'green',
    'dislike': 'red',
    'smile': 'yellow',
    'sad': 'blue',
    'love': 'pink',
    'serious': 'brown',
};

export function getColor(position) {
    if (position <= 5) return 'var(--top-color)'

    let r = 0;
    let g = 0;
    let b = 0;

    const s = 200;

    let k = (Math.log(position) / Math.log(4.3) - 1);

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
