// Данные категорий для поиска
export const categories = [
    { id: 1, name: 'Все заказы', value: 'all' },
    { id: 2, name: 'Токарные работы', value: 'turning' },
    { id: 3, name: 'Фрезерные работы', value: 'milling' },
    { id: 4, name: 'Сварочные работы', value: 'welding' },
    { id: 5, name: 'Листогибочные работы', value: 'bending' },
    { id: 6, name: 'Лазерная резка', value: 'laser' },
    { id: 7, name: 'Плазменная резка', value: 'plasma' },
    { id: 8, name: 'Гибка труб', value: 'pipe' },
    { id: 9, name: 'Штамповка', value: 'stamp' }
];

// Данные чатов (заглушка)
export const chatsData = [
    {
        id: 1,
        category: 'laser',
        customer: 'Александр',
        manager: 'Евгений',
        order: 'Лазерная резка по металлу',
        date: '2024-03-25',
        status: 'active'
    },
    {
        id: 2,
        category: 'turning',
        customer: 'Иван',
        manager: 'Евгений',
        order: 'Токарные работы вал',
        date: '2024-03-24',
        status: 'inactive'
    },
    {
        id: 3,
        category: 'milling',
        customer: 'Петр',
        manager: 'Назначить',
        order: 'Фрезерные работы деталь',
        date: '2024-03-23',
        status: 'active'
    },
    {
        id: 4,
        category: 'welding',
        customer: 'Сергей',
        manager: 'Дмитрий',
        order: 'Сварочные работы рама',
        date: '2024-03-22',
        status: 'inactive'
    },
    {
        id: 5,
        category: 'laser',
        customer: 'Михаил',
        manager: 'Назначить',
        order: 'Лазерная резка лист',
        date: '2024-03-21',
        status: 'active'
    }
];