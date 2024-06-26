import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Image from "next/image";
import searchIcon from '../../public/searchIcon.png'
import clearIcon from '../../public/clearIcon.png'

import styles from './SearchForm.module.css'

export const SearchForm = () => {
    const router = useRouter();
    const {query} = router.query;
    //const {basePath = ''} = router.basePath || '';
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (query !== null) {
            autoChange(query);
        }
    }, [query]);

    const autoChange = (value) => {
        setInputValue(value)
    }
    const handleChange = (event) => {
        setInputValue(event.target.value);
    };
    const handleSearch = () => {
        if (inputValue.trim()) {
            router.push(`/?query=${encodeURIComponent(inputValue)}`);
        }
    }
    const handleClear = () => {
        setInputValue('')
        router.push(`/`);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        handleSearch();
    }

    return (
        <div className={styles.root}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formBlock}>
                    <Image className={styles.searchIcon} src={searchIcon} width={24} height={24} alt={'searchIcon'} />
                    <input
                        type='text'
                        placeholder="Телефоны, яблоки, груши..."
                        className={styles.input}
                        onChange={handleChange}
                        value={inputValue}
                    />
                    {inputValue && <Image src={clearIcon} onClick={handleClear} className={styles.clearIcon} width={32} height={32} alt={'clearIcon'}/>}
                </div>
                <button type='submit' className={styles.button}>Искать</button>
            </form>
        </div>
    );
}
