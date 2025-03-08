// src/components/MediaCard.tsx
import styles from './MediaCard.module.css';
import clsx from "clsx";

export function MediaCard() {
    return (
        <article className={clsx(
            styles.card,
            'group relative',
            'hover:shadow-lg dark:hover:shadow-neutral-800'
        )}>
            <div className={styles.imageWrapper}>
                {/* Image component */}
            </div>
        </article>
    );
}