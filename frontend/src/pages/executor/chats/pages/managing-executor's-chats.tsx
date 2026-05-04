import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, chatsData } from '../data/chatData';
import { formatDate } from '../utils/dateUtils';
import "../styles/managing-executor's-chats.css";

interface Category {
    id: number;
    name: string;
    value: string;
}

interface Chat {
    id: number;
    category: string;
    customer: string;
    manager: string;
    order: string;
    date: string;
    status: 'active' | 'inactive';
}

export const ManagingExecutorsChats: React.FC = () => {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentSort, setCurrentSort] = useState<'desc' | 'asc'>('desc');

    const searchInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const sortContainerRef = useRef<HTMLDivElement>(null);
    const sortLabelRef = useRef<HTMLSpanElement>(null);

    const getFilteredCategories = useCallback((query: string) => {
        if (!query) return categories;
        return categories.filter(cat =>
            cat.name.toLowerCase().includes(query.toLowerCase())
        );
    }, []);

    const filteredCategories = getFilteredCategories(searchQuery);

    const filteredAndSortedChats = React.useMemo(() => {
        let filtered = selectedCategory !== 'all'
            ? chatsData.filter(chat => chat.category === selectedCategory)
            : [...chatsData];

        return filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return currentSort === 'desc'
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
        });
    }, [selectedCategory, currentSort]);

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category.value);
        setSearchQuery(category.name);
        setShowDropdown(false);
    };

    const handleSortClick = () => {
        setIsSortOpen(!isSortOpen);
    };

    const handleSortSelect = (sort: 'desc' | 'asc', label: string) => {
        setCurrentSort(sort);
        if (sortLabelRef.current) {
            sortLabelRef.current.textContent = label;
        }
        setIsSortOpen(false);
    };

    const handleChatClick = (chatId: number) => {
        navigate(`/chat/${chatId}`);
    };

    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            if (sortContainerRef.current && !sortContainerRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowDropdown(false);
                setIsSortOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <div className="wrapper-content">
            <main className="content">
                <form className="orders-toolbar" method="get" action="/orders">
                    <div className={`orders-toolbar__sort ${isSortOpen ? 'orders-toolbar__sort--open' : ''}`} ref={sortContainerRef}>
                        <button
                            type="button"
                            className="orders-toolbar__sort-button"
                            onClick={handleSortClick}
                        >
                            <span className="orders-toolbar__sort-label" ref={sortLabelRef}>
                                Сортировка
                            </span>
                            <span className="orders-toolbar__sort-arrow">&#709;</span>
                        </button>

                        <div className={`orders-toolbar__sort-menu ${isSortOpen ? 'show' : ''}`}>
                            <button
                                type="button"
                                className="orders-toolbar__sort-option"
                                onClick={() => handleSortSelect('desc', 'Сначала новые')}
                            >
                                Сначала новые
                            </button>
                            <button
                                type="button"
                                className="orders-toolbar__sort-option"
                                onClick={() => handleSortSelect('asc', 'Сначала старые')}
                            >
                                Сначала старые
                            </button>
                        </div>
                    </div>

                    <div className="orders-toolbar__search">
                        <div className="orders-toolbar__search-wrapper">
                            <input
                                type="text"
                                className="orders-toolbar__search-input"
                                placeholder="Поиск"
                                ref={searchInputRef}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowDropdown(e.target.value.length > 0);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                autoComplete="off"
                            />
                            <svg
                                className="orders-toolbar__search-icon"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>

                        <div className={`orders-toolbar__dropdown ${showDropdown ? 'show' : ''}`} ref={dropdownRef}>
                            {filteredCategories.length === 0 ? (
                                <div className="orders-toolbar__category-item" style={{ color: '#999' }}>
                                    Ничего не найдено
                                </div>
                            ) : (
                                filteredCategories.map(category => (
                                    <div
                                        key={category.id}
                                        className="orders-toolbar__category-item"
                                        onClick={() => handleCategorySelect(category)}
                                        dangerouslySetInnerHTML={{
                                            __html: highlightMatch(category.name, searchQuery)
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </form>

                <div className="chats">
                    {filteredAndSortedChats.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#858584', fontSize: '12px' }}>
                            Нет чатов для выбранной категории
                        </div>
                    ) : (
                        filteredAndSortedChats.map(chat => (
                            <div
                                key={chat.id}
                                className="chat"
                                onClick={() => handleChatClick(chat.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="chat__header">
                                    <div className="chat__users">
                                        <div className="chat__wrapper-user">
                                            <span className="chat__id">Заказчик:</span>
                                            <div className="chat__profil">
                                                <img src="/src/pages/executor/images/Client.png" alt="client" className="chat__ava" />
                                                <span className="chat__usname">{chat.customer}</span>
                                            </div>
                                        </div>
                                        <div className="chat__wrapper-user">
                                            <span className="chat__id">Менеджер:</span>
                                            <div className="chat__profil">
                                                <div className="chat__avatar-wrapper">
                                                    <img src="/src/pages/executor/images/manager.png" alt="manager" className="chat__ava" />
                                                </div>
                                                <span className="chat__usname">{chat.manager}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chat__order">Заказ: {chat.order}</div>
                                    <div className="chat__manager">
                                        Менеджер: {chat.manager === 'Назначить' ? 'Пока не назначен' : chat.manager}
                                    </div>
                                </div>
                                <div className="chat__data-time">
                                    <div
                                        className="chat__circle"
                                        style={{
                                            backgroundColor: chat.status === 'active' ? '#1a7fae' : '#444444'
                                        }}
                                    />
                                    <div className="chat__data">{formatDate(chat.date)}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default ManagingExecutorsChats;