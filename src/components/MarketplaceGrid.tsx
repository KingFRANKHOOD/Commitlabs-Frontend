import type { MarketplaceCardProps } from './MarketplaceCard'
import { MarketplaceCard } from './MarketplaceCard'
import styles from './MarketplaceGrid.module.css'

export interface MarketplaceGridProps {
  items: MarketplaceCardProps[]
}

export function MarketplaceGrid({ items }: MarketplaceGridProps) {
  if (!items || items.length === 0) {
    return (
      <section className={styles.emptySection} aria-label="Marketplace listings">
        <div className={styles.emptyCard}>
          <p className={styles.emptyTitle}>No commitments available</p>
          <p className={styles.emptySubtitle}>New offers will appear here once they are listed.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section} aria-label="Marketplace listings">
      <ul className={styles.grid}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <MarketplaceCard {...item} />
          </li>
        ))}
      </ul>
    </section>
  )
}


