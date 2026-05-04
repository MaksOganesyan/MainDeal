
// ExecutorProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ExecutorProfilePage.module.css";


export const ExecutorProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'active' | 'archive' | 'reviews'>('active');
    const [executorData, setExecutorData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Здесь будет загрузка данных исполнителя по ID
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
                name: "Иван Иванов",
                activeOrders: 4,
                totalOrders: 159,
                totalReviews: 65,
                rating: 4.8,
                description: "Специалист по металлообработке с 10-летним опытом. Выполняю заказы любой сложности: лазерная резка, сварка, гибка металла, фрезеровка. Оборудование последнего поколения.",
                // другие данные...
            });
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) {
        return (
            <div className={styles["profile-page-wrapper"]}>
                <div className={styles["loading-spinner"]}>Загрузка...</div>
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
        <div className={styles["profile-page-wrapper"]}>
            <section className={styles["picture-under-header"]}></section>

            <main className={styles.container}>
                <div className={styles["picture-avatar"]}></div>
                <div className={styles["profile-header"]}>
                    <h1 className={styles["profile-name"]}>{executorData?.name || "Иван Иванов"} (ID: {id})</h1>
                    <div className={styles.actions}>
                        <button className={styles["action-btn"]}>
                            <i className="fa-regular fa-copy" style={{ marginRight: '8px', fontWeight: '400' }}></i>
                            Связаться с исполнителем</button>
                        <button className={`${styles["action-btn"]} ${styles["transparent-btn"]}`}>
                            <i className="fa-solid fa-plus" style={{ marginRight: '8px', fontWeight: '400', color: ' #1a7fae' }}></i>
                            В избранное</button>
                    </div>
                </div>
                <section className={styles["profile-section"]}>

                    <div className={styles["profile-stats"]}>
                        <div className={styles["stat-item"]}>
                            <span className={styles["stat-value"]}>{stats.activeOrders}</span>
                            <span className={styles["stat-label"]}>Услуги</span>
                        </div>
                        <div className={styles["stat-item"]}>
                            <span className={styles["stat-value"]}>{stats.totalOrders}</span>
                            <span className={styles["stat-label"]}>Заказов</span>
                        </div>
                        <div className={styles["stat-item"]}>
                            <span className={styles["stat-value"]}>{stats.totalReviews}</span>
                            <span className={styles["stat-label"]}>Отзывов</span>
                        </div>
                        <div className={styles["stat-item"]}>
                            <span className={`${styles["stat-value"]} ${styles["star-icon"]}`}>{stats.rating}</span>
                            <span className={styles["stat-label"]}>Оценка</span>
                        </div>
                    </div>

                    <div className={styles["profile-description"]}>
                        <h2 className={styles["description-title"]}>Описание</h2>

                        <p className={styles["description-text"]}>
                            {executorData?.description || "Специалист по металлообработке с 10-летним опытом. Выполняю заказы любой сложности: лазерная резка, сварка, гибка металла, фрезеровка. Оборудование последнего поколения."}
                        </p>
                        <div className={styles.hr}></div>
                    </div>
                </section>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'active' ? styles.active : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Объявления и услуги
                        <span className={styles["tab-badge"]}>{stats.activeOrders}</span>
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'archive' ? styles.active : ''}`}
                        onClick={() => setActiveTab('archive')}
                    >
                        Выполненные заказы
                        <span className={styles["tab-badge"]}>{stats.totalOrders}</span>
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Отзывы
                        <span className={styles["tab-badge"]}>{stats.totalReviews}</span>
                    </button>
                </div>
            </main>

            <div className={styles["tab-content-wrapper"]}>
                {activeTab === 'active' && (
                    <div className={styles["tab-content"]}>
                        <div className={styles["order-card"]}>
                            <div className={styles["order-image"]}></div>
                            <div className={styles["order-title"]}>Фигурная резка по металлу</div>
                            <div className={styles["order-address"]}>Москва, улица Комсомольская</div>
                            <div className={styles["order-price"]}>
                                <span>От 10 000 ₽</span>
                                <span>от 10 дней</span>
                            </div>
                        </div>
                        <div className={styles["order-card"]}>
                            <div className={styles["order-image"]}></div>
                            <div className={styles["order-title"]}>Фигурная резка по дереву</div>
                            <div className={styles["order-address"]}>Москва, улица Комсомольская</div>
                            <div className={styles["order-price"]}>
                                <span>От 1 000 ₽</span>
                                <span>от 10 дней</span>
                            </div>
                        </div>
                        <div className={styles["order-card"]}>
                            <div className={styles["order-image"]}></div>
                            <div className={styles["order-title"]}>Фигурная резка по пластику</div>
                            <div className={styles["order-address"]}>Москва, улица Комсомольская</div>
                            <div className={styles["order-price"]}>
                                <span>От 5 000 ₽</span>
                                <span>от 10 дней</span>
                            </div>
                        </div>
                        <div className={styles["order-card"]}>
                            <div className={styles["order-image"]}></div>
                            <div className={styles["order-title"]}>Фигурная резка по стеклу</div>
                            <div className={styles["order-address"]}>Москва, улица Комсомольская</div>
                            <div className={styles["order-price"]}>
                                <span>От 20 000 ₽</span>
                                <span>от 10 дней</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'archive' && (
                    <div className={styles["tab-content"]}>
                        <div className={styles["order-card"]}>
                            <div className={styles["order-image"]}></div>
                            <div className={styles["order-title"]}>Лазерная гравировка на стали (Архив)</div>
                            <div className={styles["order-address"]}>Москва, улица Комсомольская</div>
                            <div className={styles["order-price"]}>
                                <span>15 000 ₽</span>
                            </div>
                        </div>
                        <div className={styles["order-card"]}>
                            <div className={styles["order-image"]}></div>
                            <div className={styles["order-title"]}>3D фрезеровка дерева (Архив)</div>
                            <div className={styles["order-address"]}>Москва, улица Комсомольская</div>
                            <div className={styles["order-price"]}>
                                <span>25 000 ₽</span>
                            </div>
                        </div>
                        <div className={styles["order-card"]}>
                            <div className={styles["order-image"]}></div>
                            <div className={styles["order-title"]}>Гибка металла (Архив)</div>
                            <div className={styles["order-address"]}>Москва, улица Комсомольская</div>
                            <div className={styles["order-price"]}>
                                <span>8 000 ₽</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};