export const auth_provider = {
    'yandex': 'Яндекс',
    'google': 'Google'
}

export function checkPassword(password) {
    if (password !== '' && password.length < 8) {
        return 'должно быть не меньше 8 символов';
    }
}

export function checkEmail(email) {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    return 'некорректная почта';
}

export function checkLogin(login) {
    return login.includes('@') ? checkEmail(login) : checkUsername(login);
}

export function checkUsername(username) {
    if (username === '') return;

    if (username.length < 3) {
        return 'должно быть более 2 символов';
    }
    if (username.length > 15) {
        return 'должно быть не более 15 символов';
    }
    if (/[A-Z]/.test(username)) {
        return 'не должно быть заглавных букв'
    }
    if (/[^a-z0-9_]/.test(username)) {
        return 'разрешена только латиница, цифры и _'
    }
}

export function checkFullname(fullname) {
    if (fullname.length < 1) {
        return 'должно быть более 1 символа';
    }
    if (fullname.length > 25) {
        return 'должно быть не более 25 символов';
    }
    if (/[0-9]$/.test(fullname)) {
        return 'не должно быть цифр'
    }
    if (/[^a-zA-Zа-яА-ЯёЁ '-]/.test(fullname)) {
        return 'недопустимый символ'
    }
}

export function normFullname(fullname) {
    fullname = fullname.toLowerCase();
    fullname = fullname.replace('ё', 'е');
    let names = fullname.split(/[^a-zа-я]/);
    names = names.filter(name => name !== '');
    names = names.map(name => name[0].toUpperCase() + name.slice(1));
    return names.join(' ');
}


export function checkContacts(contacts) {
    contacts = contacts.split(/[,\s]+/);
    for (const c of contacts) {
        if (!normContact(c)) return 'не получилось распарсить ' + c;
    }

}

export function normContacts(contacts) {
    contacts = contacts.split(/[,\s]+/);
    return contacts.map(normContact).join('\n');
}

const hosts = {
    vkontakte: 'vk.com',
    facebook: 'fb.com',
    telegram: 't.me',
    github: 'github.com',
    gitlab: 'gitlab.com',
    linkedin: 'www.linkedin.com',
    pinterest: 'pinterest.com',
    youtube: 'www.youtube.com',
    fb: 'fb.com',
    vk: 'vk.com',
    t: 't.me'
};

export function normContact(contact) {
    const i = contact.lastIndexOf("/");
    if (i <= 0) return;

    const id = contact.substring(i + 1, contact.length);
    if (id.includes('?')) return;

    let host = contact.substring(0, i);

    for (const [k, v] of Object.entries(hosts)) {
        if (host.includes(k + '.')) {
            return v + '/' + id;
        }
    }
}
