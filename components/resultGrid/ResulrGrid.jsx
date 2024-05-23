import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useInfiniteQuery } from "react-query";
import { NotFound } from "@/components/notFound/NotFound";
import { ResultGridElement } from "@/components/resultGridElement/ResultGridElement";

import styles from './ResultGrid.module.css';

async function fetchCards(query, page) {
    const response = await fetch(`https://api.unsplash.com/search/photos?client_id=Ip0XA55zY7b7-d19osq1L5btGg-YCeDZVpnnJjXqHxs&query=${query}&page=${page}`);
    if (response.status === 403) {
        throw new Error('Rate Limit Exceeded');
    }
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

export const ResultGrid = () => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { query } = router.query;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isError,
    } = useInfiniteQuery(
        ['photos', query],
        ({ pageParam = 1 }) => fetchCards(query, pageParam),
        {
            getNextPageParam: (lastPage, pages) => lastPage.total_pages > pages.length ? pages.length + 1 : undefined,
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes,
            onSuccess: (data) => {
                setItems(prevItems => [...prevItems, ...data.pages.flatMap(page => page.results)]);
            },
        }
    );

    const loadInitialItems = async () => {
        setItems([]);
        let totalPages = 1;
        const itemsPerPage = 10;
        const itemsInViewport = Math.ceil(window.innerHeight / 100) * (window.innerWidth <= 950 ? 3 : 6);
        while (totalPages <= Math.ceil(itemsInViewport / itemsPerPage)) {
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
        if (query) {
            loadInitialItems();
        }
    }, [query]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 100 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage]);

    if (isError) return <div>Ошибка: {error}</div>;
    if (items.length === 0 && !isFetchingNextPage) return <NotFound />;

    return (
        <div className={styles.root}>
            {items.map(item => (
                <ResultGridElement key={item.id} imageUrlSmall={item?.urls?.small} imageUrlFull={item?.urls?.full} />
            ))}
        </div>
    );
};
