import React, { useState, useRef, useEffect } from "react";
import "./all-orders-executor's.css";
import { Link } from "react-router-dom";

// Типы для заказа
interface Order {
    title: string;
    address: string;
    price: string;
    duration: string;
    clientName: string;
    category: string;
    isUrgent: boolean;
    isWholesale: boolean;
    isSingle: boolean;
}

export const AllOrdersExecutor: React.FC = () => {
    // Состояния для фильтров
    const [urgentChecked, setUrgentChecked] = useState(false);
    const [wholesaleChecked, setWholesaleChecked] = useState(true);
    const [singleChecked, setSingleChecked] = useState(false);
    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("Москва");

    // Состояние для открытых/закрытых секций фильтра
    const [openSections, setOpenSections] = useState({
        region: false,
        сроки: false,
        объем: false,
        категории: false,
        стоимость: false,
    });

    // Состояние для категорий
    const [categoriesExpanded, setCategoriesExpanded] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Все заказы");

    // Состояние для сортировки
    const [sortOpen, setSortOpen] = useState(false);
    const [sortLabel, setSortLabel] = useState("Сортировка");
    const [sortType, setSortType] = useState("");

    // Состояние для текущих фильтров (чтобы запоминать, что выбрано)
    const [currentFilters, setCurrentFilters] = useState({
        urgent: false,
        wholesale: true,
        single: false,
        priceFrom: "",
        priceTo: "",
        region: "Москва",
        category: "Все заказы"
    });

    // Исходные данные (полный каталог)
    const [allOrders] = useState<Order[]>([
        {
            title: "Необходима Фигурная резка по металлу",
            address: "Москва, улица Комсомольская",
            price: "1 000 ₽",
            duration: "Срочно",
            clientName: "Александр",
            category: "Фрезерные работы",
            isUrgent: true,
            isWholesale: false,
            isSingle: true
        },
        {
            title: "Необходима Фигурная резка по дереву",
            address: "Москва, улица Комсомольская",
            price: "10 000 ₽",
            duration: "2 недели",
            clientName: "Олег",
            category: "Лазерная резка",
            isUrgent: false,
            isWholesale: true,
            isSingle: false
        },
        {
            title: "Необходима Фигурная резка по пластику",
            address: "Санкт-Петербург, Невский проспект",
            price: "5 000 ₽",
            duration: "Срочно",
            clientName: "Александр",
            category: "Плазменная резка",
            isUrgent: true,
            isWholesale: true,
            isSingle: false
        },
        {
            title: "Необходима Фигурная резка по стеклу",
            address: "Москва, улица Комсомольская",
            price: "1 000 ₽",
            duration: "1 неделя",
            clientName: "Александр",
            category: "Другое",
            isUrgent: false,
            isWholesale: false,
            isSingle: true
        },
        {
            title: "Токарная обработка вала",
            address: "Москва, улица Тверская",
            price: "15 000 ₽",
            duration: "3 дня",
            clientName: "Иван",
            category: "Токарные работы",
            isUrgent: true,
            isWholesale: false,
            isSingle: true
        },
        {
            title: "Сварочные работы для забора",
            address: "Санкт-Петербург, улица Ленина",
            price: "8 000 ₽",
            duration: "5 дней",
            clientName: "Петр",
            category: "Сварочные работы",
            isUrgent: false,
            isWholesale: true,
            isSingle: false
        }
    ]);

    // Отфильтрованные и отсортированные заказы
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(allOrders);

    // Реф для меню сортировки
    const sortRef = useRef<HTMLDivElement>(null);

    // Закрытие меню сортировки при клике вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setSortOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Закрытие по Escape
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSortOpen(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    // Переключение секции фильтра
    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    // Переключение категорий
    const toggleCategories = () => {
        setCategoriesExpanded(!categoriesExpanded);
    };

    // Выбор категории
    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
    };

    // Функция фильтрации (применяет фильтры к allOrders)
    const getFilteredOrders = () => {
        let filtered = [...allOrders];

        // Фильтр по региону
        if (selectedRegion) {
            filtered = filtered.filter(order =>
                order.address.toLowerCase().includes(selectedRegion.toLowerCase())
            );
        }

        // Фильтр по срочности
        if (urgentChecked) {
            filtered = filtered.filter(order => order.isUrgent);
        }

        // Фильтр по объему
        if (wholesaleChecked && !singleChecked) {
            filtered = filtered.filter(order => order.isWholesale);
        } else if (!wholesaleChecked && singleChecked) {
            filtered = filtered.filter(order => order.isSingle);
        } else if (wholesaleChecked && singleChecked) {
            filtered = filtered.filter(order => order.isWholesale || order.isSingle);
        }

        // Фильтр по категории
        if (selectedCategory !== "Все заказы") {
            filtered = filtered.filter(order => order.category === selectedCategory);
        }

        // Фильтр по цене
        if (priceFrom) {
            const from = parseInt(priceFrom);
            filtered = filtered.filter(order => extractPrice(order.price) >= from);
        }
        if (priceTo) {
            const to = parseInt(priceTo);
            filtered = filtered.filter(order => extractPrice(order.price) <= to);
        }

        return filtered;
    };

    // Применить фильтры и сортировку
    const applyFiltersAndSort = () => {
        const filtered = getFilteredOrders();
        const sorted = applySort(filtered, sortType);
        setFilteredOrders(sorted);
    };

    // Функция сортировки
    const applySort = (ordersToSort: Order[], type: string) => {
        if (type === "") {
            return ordersToSort; // без сортировки (сохраняем порядок после фильтрации)
        }

        const sorted = [...ordersToSort];
        if (type === "asc") {
            sorted.sort((a, b) => {
                const priceA = extractPrice(a.price);
                const priceB = extractPrice(b.price);
                return priceA - priceB;
            });
        } else if (type === "desc") {
            sorted.sort((a, b) => {
                const priceA = extractPrice(a.price);
                const priceB = extractPrice(b.price);
                return priceB - priceA;
            });
        }
        return sorted;
    };

    // Обработчик сортировки
    const handleSortSelect = (type: string, label: string) => {
        setSortType(type);
        setSortLabel(label);
        setSortOpen(false);

        // Применяем сортировку к текущим отфильтрованным заказам
        setFilteredOrders(prev => applySort(prev, type));
    };

    // Применить фильтры (кнопка Найти)
    const applyFilters = () => {
        applyFiltersAndSort();
    };

    // Сброс всех фильтров
    const resetFilters = () => {
        setUrgentChecked(false);
        setWholesaleChecked(true);
        setSingleChecked(false);
        setPriceFrom("");
        setPriceTo("");
        setSelectedCategory("Все заказы");
        setSelectedRegion("Москва");
        setSortType("");
        setSortLabel("Сортировка");

        // Сбрасываем заказы до исходных
        setFilteredOrders(allOrders);
    };

    // Вспомогательная функция для извлечения числа из цены
    const extractPrice = (priceString: string): number => {
        return parseInt(priceString.replace(/[^0-9]/g, "")) || 0;
    };

    // Категории для отображения
    const categories = [
        "Все заказы",
        "Токарные работы",
        "Фрезерные работы",
        "Сварочные работы",
        "Листогибочные работы",
        "Лазерная резка",
        "Плазменная резка",
        "Гибка труб",
        "Штамповка",
        "Другое",
    ];

    // Отображаемые категории (в зависимости от expanded)
    const displayedCategories = categoriesExpanded ? categories : categories.slice(0, 5);

    return (
        <>
            <div className="wrapper">
                <div className="wrapper__content">
                    <div className="content">
                        {/* Форма фильтрации */}
                        <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="filter-form__name-form filter-form__group">Фильтр заказов</div>

                            {/* Регион */}
                            <div className="filter-form__group filter-group filter-group--collapsible">
                                <div className="filter-group__header" onClick={() => toggleSection("region")}>
                                    <span className={`filter-group__arrow ${openSections.region ? "filter-group__arrow--rotated" : ""}`}>
                                        &#709;
                                    </span>
                                    <legend className="filter-group__title">Регион</legend>
                                </div>
                                <div className={`filter-group__content ${!openSections.region ? "filter-group__content--hidden" : ""}`}>
                                    <select
                                        className="filter-group__select"
                                        name="region"
                                        value={selectedRegion}
                                        onChange={(e) => setSelectedRegion(e.target.value)}
                                    >
                                        <option>Москва</option>
                                        <option>Санкт-Петербург</option>
                                    </select>
                                </div>
                            </div>

                            {/* Сроки выполнения */}
                            <div className="filter-form__group filter-group filter-group--collapsible">
                                <div className="filter-group__header" onClick={() => toggleSection("сроки")}>
                                    <span className={`filter-group__arrow ${openSections.сроки ? "filter-group__arrow--rotated" : ""}`}>
                                        &#709;
                                    </span>
                                    <legend className="filter-group__title">Сроки выполнения</legend>
                                </div>
                                <div className={`filter-group__content ${!openSections.сроки ? "filter-group__content--hidden" : ""}`}>
                                    <label className="filter-group__item">
                                        <input
                                            className="filter-group__checkbox"
                                            type="checkbox"
                                            name="urgent"
                                            checked={urgentChecked}
                                            onChange={(e) => setUrgentChecked(e.target.checked)}
                                        />
                                        <span className="filter-group__label-text">Срочный заказ</span>
                                    </label>
                                </div>
                            </div>

                            {/* Объем выполнения */}
                            <div className="filter-form__group filter-group filter-group--collapsible">
                                <div className="filter-group__header" onClick={() => toggleSection("объем")}>
                                    <span className={`filter-group__arrow ${openSections.объем ? "filter-group__arrow--rotated" : ""}`}>
                                        &#709;
                                    </span>
                                    <legend className="filter-group__title">Объем выполнения</legend>
                                </div>
                                <div className={`filter-group__content ${!openSections.объем ? "filter-group__content--hidden" : ""}`}>
                                    <label className="filter-group__item">
                                        <input
                                            className="filter-group__checkbox"
                                            type="checkbox"
                                            name="wholesale"
                                            checked={wholesaleChecked}
                                            onChange={(e) => setWholesaleChecked(e.target.checked)}
                                        />
                                        <span className="filter-group__label-text">Оптовый заказ</span>
                                    </label>
                                    <label className="filter-group__item">
                                        <input
                                            className="filter-group__checkbox"
                                            type="checkbox"
                                            name="single"
                                            checked={singleChecked}
                                            onChange={(e) => setSingleChecked(e.target.checked)}
                                        />
                                        <span className="filter-group__label-text">Единичная деталь</span>
                                    </label>
                                </div>
                            </div>

                            {/* Категории */}
                            <div className="filter-form__group filter-group filter-group--collapsible">
                                <div className="filter-group__header" onClick={() => toggleSection("категории")}>
                                    <span className={`filter-group__arrow ${openSections.категории ? "filter-group__arrow--rotated" : ""}`}>
                                        &#709;
                                    </span>
                                    <legend className="filter-group__title">Категории</legend>
                                </div>
                                <div className={`filter-group__content ${!openSections.категории ? "filter-group__content--hidden" : ""}`}>
                                    <div className="filter-group__items-wrapper">
                                        <div
                                            className={`filter-group__items ${categoriesExpanded ? "filter-group__items--expanded" : "filter-group__items--collapsed"
                                                }`}
                                        >
                                            {displayedCategories.map((category) => (
                                                <label className="filter-group__item" key={category}>
                                                    <input
                                                        className="filter-group__checkbox-none"
                                                        type="checkbox"
                                                        checked={selectedCategory === category}
                                                        onChange={() => handleCategorySelect(category)}
                                                    />
                                                    <span className="filter-group__label-text">{category}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <button className="filter-group__toggle-btn" type="button" onClick={toggleCategories}>
                                            {categoriesExpanded ? "Свернуть" : "Показать все"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Стоимость */}
                            <div className="filter-form__group filter-group filter-group--collapsible">
                                <div className="filter-group__header" onClick={() => toggleSection("стоимость")}>
                                    <span className={`filter-group__arrow ${openSections.стоимость ? "filter-group__arrow--rotated" : ""}`}>
                                        &#709;
                                    </span>
                                    <legend className="filter-group__title">Стоимость, ₽</legend>
                                </div>
                                <div className={`filter-group__content ${!openSections.стоимость ? "filter-group__content--hidden" : ""}`}>
                                    <div className="filter-group__price-row">
                                        <input
                                            className="filter-group__input"
                                            type="number"
                                            placeholder="от"
                                            name="priceFrom"
                                            value={priceFrom}
                                            onChange={(e) => setPriceFrom(e.target.value)}
                                        />
                                        <input
                                            className="filter-group__input"
                                            type="number"
                                            placeholder="до"
                                            name="priceTo"
                                            value={priceTo}
                                            onChange={(e) => setPriceTo(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Кнопки */}
                            <div className="filter-form__button-find">
                                <button
                                    className="filter-form__button"
                                    type="button"
                                    onClick={applyFilters}
                                >
                                    Найти
                                </button>
                                <button
                                    className="filter-form__button"
                                    type="button"
                                    onClick={resetFilters}
                                >
                                    Сбросить
                                </button>
                            </div>
                        </form>

                        {/* Секция заказов */}
                        <section className="orders">
                            <div className="orders-toolbar">
                                <div className="orders-toolbar__view">
                                    <button className="orders-toolbar__button">
                                        <i className="las la-bars"></i>
                                    </button>
                                    <button className="orders-toolbar__button">
                                        <i className="las la-th-large"></i>
                                    </button>
                                    <button className="orders-toolbar__button">
                                        <i className="las la-map"></i>
                                    </button>
                                </div>

                                <div className={`orders-toolbar__sort ${sortOpen ? "orders-toolbar__sort--open" : ""}`} ref={sortRef}>
                                    <button
                                        className="orders-toolbar__sort-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSortOpen(!sortOpen);
                                        }}
                                    >
                                        <span className="orders-toolbar__sort-label">{sortLabel}</span>
                                        <span className="orders-toolbar__sort-arrow">&#709;</span>
                                    </button>
                                    <div className="orders-toolbar__sort-menu">
                                        <button
                                            className={`orders-toolbar__sort-option ${sortType === "desc" ? "orders-toolbar__sort-option--active" : ""}`}
                                            onClick={() => handleSortSelect("desc", "По убыванию цены")}
                                        >
                                            По убыванию цены
                                        </button>
                                        <button
                                            className={`orders-toolbar__sort-option ${sortType === "asc" ? "orders-toolbar__sort-option--active" : ""}`}
                                            onClick={() => handleSortSelect("asc", "По возрастанию цены")}
                                        >
                                            По возрастанию цены
                                        </button>
                                        <button
                                            className={`orders-toolbar__sort-option ${sortType === "" ? "orders-toolbar__sort-option--active" : ""}`}
                                            onClick={() => handleSortSelect("", "Сортировка")}
                                        >
                                            Сбросить
                                        </button>
                                    </div>
                                </div>
                                {/* Кнопка перехода на страницу всех заказов */}
                                <Link to="/deals" className="orders-toolbar__deals-link">
                                    <button className="filter-form__button">
                                        Перейти к заказам
                                    </button>
                                </Link>
                            </div>

                            <div className="orders-cards">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order, index) => (
                                        <div className="order-card" key={index}>
                                            <div className="order-card__image"></div>
                                            <div className="order-card__title">{order.title}</div>
                                            <div className="order-card__address">{order.address}</div>
                                            <div className="order-card__wrapper-price-term">
                                                <div className="order-card__price">{order.price}</div>
                                                <div className="order-card__duration">
                                                    <span className="order-card__term-label">Срок</span>
                                                    <span className="order-card__value">{order.duration}</span>
                                                </div>
                                            </div>
                                            <div className="order-card__line"></div>
                                            <div className="order-card__client">
                                                <div className="order-card__photo"></div>
                                                <div className="order-card__name">{order.clientName}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-orders-message">
                                        <p>Заказы по заданным критериям не найдены</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

        </>
    );
};