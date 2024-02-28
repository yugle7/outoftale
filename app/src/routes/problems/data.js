export const default_params = {
    sort: '-changed',
    status: 5
}

export const problem_sort = {
    '-changed': 'Новые',
    'changed': 'Старые',
    '-like': 'Лучшие'
};

export const problem_weight = [0, 1, 2, 3, 4, 5];
export const weight_name = ['Нулевки', 'Легкие', 'Простые', 'Обычные', 'Сложные', 'Тяжелые'];

export const problem_status = [
    'Черновик',
    'Предложена',
    'Архив',
    'Дубль',
    'Отбор',
    'Выложена'
];

export const problem_category = [
    'Теория вероятностей',
    'На смекалку',
    'Шахматы и шашки',
    'Загадки',
    'Программистам',
    'Математика',
    'Правдивцы и лжецы',
    'Геометрия',
    'Логика',
    'Детям',
    'Преферанс',
    'Игры',
    'Алгоритмы',
    'Последовательности',
    'Физика',
    'Взвешивания',
];

export const problem_react = [1, 2];

export function getTypes(solution, profile) {
    if (!solution) return [2];

    const { author_id, progress, step } = solution;
    const { role, id } = profile;

    let types;
    if (author_id === id) {
        types = [2];
        if (progress === 5) types.push(3);
        if (role >= 2) types.push(4);
        if (progress === 5 && role >= 2) types.push(5);
        if (step > 0) types.push(6);
    } else {
        types = [2, 3, 4, 5, 7];
    }
    return types;
}

export function getStatuses(profile, problem) {
    const { like, answer, proof, status } = problem;
    const { role } = profile;

    switch (status) {
        case 0:
            return answer || proof ? [1] : [];
        case 1:
            return role >= 2 ? [0, 2, 3, 4] : [0, 2, 3];
        case 2:
        case 3:
            return [1];
        case 4:
            return role >= 3 || like > 80 ? [1, 5] : [1];
        case 5:
            return role >= 3 || like < 50 ? [1] : [];
        default:
            return [];
    }
}