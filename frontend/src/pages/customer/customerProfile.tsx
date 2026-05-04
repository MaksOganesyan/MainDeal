import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./customerProfile.css";

export const customerProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'active' | 'archive' | 'reviews'>('active');
    const [executorData, setExecutorData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Здесь будет загрузка данных заказчика по ID
        // const loadExecutorData = async () => {
        //     try {
        //         const response = await executorService.getExecutorById(id);
        //         setExecutorData(response.data);
        //     } catch (error) {
        //         console.error('Error loading executor:', error);
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // Временно используем моковые данные
        setTimeout(() => {
            setExecutorData({
                id: id,
                name: "Александр Пахомов",
                activeOrders: 4,
                totalOrders: 159,
                totalReviews: 65,
                rating: 4.8,
                description: " ",
                // другие данные...
            });
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) {
        return (
            <div className="profile-page-wrapper">
                <div className="loading-spinner">Загрузка...</div>
            </div>
        );
    }

    const stats = {
        activeOrders: executorData?.activeOrders || 0,
        totalOrders: executorData?.totalOrders || 0,
        totalReviews: executorData?.totalReviews || 0,
        rating: executorData?.rating || 0
    };

    return (
        <div className="profile-page-wrapper">
            <section className="picture-under-header">

            </section>

            <main className="container">
                <div className="picture-avatar"></div>
                <section className="profile-section">
                    <div className="profile-header">
                        <h1 className="profile-name">{executorData?.name || "Александр Пахомов"} (ID: {id})</h1>
                    </div>

                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-value">{stats.activeOrders}</span>
                            <span className="stat-label">Активные Заказы</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.totalOrders}</span>
                            <span className="stat-label">Заказов</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.totalReviews}</span>
                            <span className="stat-label">Отзывов</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value star-icon">{stats.rating}</span>
                            <span className="stat-label">Оценка</span>
                        </div>
                    </div>

                    <div className="profile-description">
                        <h2 className="description-title">Описание</h2>
                        <div className="hr"></div>
                        <p className="description-text">
                            {executorData?.description || " "}
                        </p>
                    </div>
                </section>

                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Активные заказы
                        <span className="tab-badge">{stats.activeOrders}</span>
                    </button>
                    <button
                        className={`tab ${activeTab === 'archive' ? 'active' : ''}`}
                        onClick={() => setActiveTab('archive')}
                    >
                        Архив заказов
                        <span className="tab-badge">{stats.totalOrders}</span>
                    </button>
                    <button
                        className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Отзывы
                        <span className="tab-badge">{stats.totalReviews}</span>
                    </button>
                </div>
            </main>

            <div className="tab-content-wrapper">
                {activeTab === 'active' && (
                    <div className="tab-content">
                        <div className="order-card">
                            <div className="order-image"></div>
                            <div className="order-title">Фигурная резка по металлу</div>
                            <div className="order-address">Москва, улица Комсомольская</div>
                            <div className="order-price">
                                <span>От 10 000 ₽</span>
                                <span>от 10 дней</span>
                            </div>
                        </div>
                        <div className="order-card">
                            <div className="order-image"></div>
                            <div className="order-title">Фигурная резка по дереву</div>
                            <div className="order-address">Москва, улица Комсомольская</div>
                            <div className="order-price">
                                <span>От 1 000 ₽</span>
                                <span>от 10 дней</span>
                            </div>
                        </div>
                        <div className="order-card">
                            <div className="order-image"></div>
                            <div className="order-title">Фигурная резка по пластику</div>
                            <div className="order-address">Москва, улица Комсомольская</div>
                            <div className="order-price">
                                <span>От 5 000 ₽</span>
                                <span>от 10 дней</span>
                            </div>
                        </div>
                        <div className="order-card">
                            <div className="order-image"></div>
                            <div className="order-title">Фигурная резка по стеклу</div>
                            <div className="order-address">Москва, улица Комсомольская</div>
                            <div className="order-price">
                                <span>От 20 000 ₽</span>
                                <span>от 10 дней</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'archive' && (
                    <div className="tab-content">
                        <div className="order-card">
                            <div className="order-image"></div>
                            <div className="order-title">Лазерная гравировка на стали (Архив)</div>
                            <div className="order-address">Москва, улица Комсомольская</div>
                            <div className="order-price">
                                <span>15 000 ₽</span>

                            </div>
                        </div>
                        <div className="order-card">
                            <div className="order-image"></div>
                            <div className="order-title">3D фрезеровка дерева (Архив)</div>
                            <div className="order-address">Москва, улица Комсомольская</div>
                            <div className="order-price">
                                <span>25 000 ₽</span>

                            </div>
                        </div>
                        <div className="order-card">
                            <div className="order-image"></div>
                            <div className="order-title">Гибка металла (Архив)</div>
                            <div className="order-address">Москва, улица Комсомольская</div>
                            <div className="order-price">
                                <span>8 000 ₽</span>

                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default customerProfile;