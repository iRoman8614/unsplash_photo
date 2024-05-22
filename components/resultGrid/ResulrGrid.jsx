import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useInfiniteQuery} from "react-query";
import {NotFound} from "@/components/notFound/NotFound";
import {ResultGridElement} from "@/components/resultGridElement/ResultGridElement";

import styles from './ResultGrid.module.css';

async function fetchCards(query, page) {
    const response = await fetch(`https://api.unsplash.com/search/photos?client_id=Ip0XA55zY7b7-d19osq1L5btGg-YCeDZVpnnJjXqHxs&query=${query}&page=${page}`);
    if (response.status === 403) {
        throw new Error('Rate Limit Exceeded');
    }
    const data = await response.json();
    return data;
}

export const ResultGrid = () => {
    const [items, setItems] = useState([]);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { query } = router.query;

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isError } = useInfiniteQuery(
        ['photos', query],
        ({ pageParam = 1 }) => fetchCards(query, pageParam),
        {
            getNextPageParam: (lastPage, allPages) => lastPage.results.length ? allPages.length + 1 : false,
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        }
    );

    const loadInitialItems = async () => {
        let totalPages = 1;
        const itemsPerPage = 10;
        const itemsInViewport = Math.ceil(window.innerHeight / 300) * (window.innerWidth <= 950 ? 3 : 6);
        while (items.length < itemsInViewport && totalPages <= itemsInViewport / itemsPerPage) {
            try {
                await fetchNextPage({ pageParam: totalPages });
            } catch (error) {
                setError(error.message);
                break;
            }
            totalPages++;
        }
    };

    useEffect(() => {
        if (data) {
            setItems(prevItems => [...prevItems, ...data.pages.flatMap(page => page.results)]);
        }
    }, [data]);

    useEffect(() => {
        loadInitialItems();
    }, []);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetchingNextPage || !hasNextPage) return;
        setIsFetchingMore(true);
        fetchNextPage().then(() => setIsFetchingMore(false)).catch(error => setError(error.message));
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isFetchingNextPage, hasNextPage]);

    if (error) return <div>Ошибка: {error}</div>;
    if (isError) return <div>Ошибка при загрузке изображений</div>;
    if (items.length === 0) return <NotFound />;

    return (
        <div className={styles.root}>
            {items.map(item => (
                <ResultGridElement key={item.id} imageUrlSmall={item?.urls?.small} imageUrlFull={item?.urls?.full} />
            ))}
            {isFetchingMore && <div>Загрузка...</div>}
        </div>
    )
}