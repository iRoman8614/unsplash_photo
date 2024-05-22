import {useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import clearIcon from '../../public/clearIcon.png';

import styles from './ResultGridElement.module.css';

export const ResultGridElement = ({ imageUrlSmall, imageUrlFull }) => {
    const [expanded, setExpanded] = useState(false);
    const { basePath = '' } = useRouter();
    const openImage = () => {
        setExpanded(true);
    };
    const closeImage = () => {
        setExpanded(false);
    };
    return(
        <div className={styles.root}>
            <Image src={`${basePath}${imageUrlSmall}`} alt="gallery-image" className={styles.smallImg} width={110} height={110} onClick={openImage} />
            {expanded && (
                <div className={styles.blur}>
                    <Image className={styles.bigImg} src={`${basePath}${imageUrlFull}`} alt="expanded-gallery-image" width={100} height={100} />
                    <Image className={styles.closeImg} src={`${basePath}/clearIcon.png`} width={32} height={32} alt='close' onClick={closeImage} />
                </div>
            )}
        </div>
    )
}