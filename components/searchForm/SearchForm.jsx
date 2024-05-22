import Image from "next/image";
import styles from './SearchForm.module.css'
import searchIcon from '../../public/frame12.svg'
import clearIcon from '../../public/clearIcon.svg'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export const SearchForm = () => {
    const router = useRouter();
    const { query } = router.query;
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
                    <Image className={styles.searchIcon} src={searchIcon} alt={'searchIcon'} />
                    <input
                        type='text'
                        placeholder="Телефоны, яблоки, груши..."
                        className={styles.input}
                        onChange={handleChange}
                        value={inputValue}
                    />
                    {inputValue && <Image src={clearIcon} onClick={handleClear} className={styles.clearIcon} alt={'clearIcon'}/>}
                </div>
                <button type='submit' className={styles.button}>Искать</button>
            </form>
        </div>
    );
}
