import {SearchForm} from "@/components/searchForm/SearchForm";
import {useRouter} from "next/router";
import {ResultGrid} from "@/components/resultGrid/ResulrGrid";

import styles from '../styles/page.module.css';

const Home = () => {
    const router = useRouter();
    const { query } = router.query;

    return (
        <>
            {!query && <div className={styles.root}>
                <SearchForm />
            </div>}
            {query &&<div className={styles.container}>
                <SearchForm />
                <ResultGrid/>
            </div>}
        </>
    );
}

export default Home;
