import {useState} from "react";
import Image from "next/image";
import clearIcon from '../../public/clearIcon.png';

import styles from './ResultGridElement.module.css';

export const ResultGridElement = ({ imageUrlSmall, imageUrlFull }) => {
    const [expanded, setExpanded] = useState(false);
    const openImage = () => {
        setExpanded(true);
    };
    const closeImage = () => {
        setExpanded(false);
    };
    return(
        <div className={styles.root}>
            <Image src={imageUrlSmall} alt="gallery-image" className={styles.smallImg} width={110} height={110} onClick={openImage} />
            {expanded && (
                <div className={styles.blur}>
                    <Image className={styles.bigImg} src={imageUrlFull} alt="expanded-gallery-image" width={100} height={100} />
                    <Image className={styles.closeImg} src={clearIcon} width={32} height={32} alt='close' onClick={closeImage} />
                </div>
            )}
        </div>
    )
}