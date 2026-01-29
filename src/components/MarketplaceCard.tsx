import Link from 'next/link'
import styles from './MarketplaceCard.module.css'

export type CommitmentType = 'Safe' | 'Balanced' | 'Aggressive'

export interface MarketplaceCardProps {
  id: string
  type: CommitmentType
  score: number
  amount: string
  duration: string
  yield: string
  maxLoss: string
  owner: string
  price: string
  forSale: boolean
  viewHref?: string
  tradeHref?: string
}

function clampScore(score: number) {
  if (Number.isNaN(score)) return 0
  return Math.max(0, Math.min(100, Math.round(score)))
}

function scoreTier(score: number): 'high' | 'mid' | 'low' {
  if (score >= 90) return 'high'
  if (score >= 80) return 'mid'
  return 'low'
}

function truncateAddress(addr: string) {
  const s = addr?.trim() ?? ''
  if (s.length <= 12) return s
  return `${s.slice(0, 6)}...${s.slice(-4)}`
}

function TypeIcon({ type }: { type: CommitmentType }) {
  // Minimal inline SVGs so we don’t pull in any icon deps.
  if (type === 'Safe') {
    return (
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        <path
          d="M12 3l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9.2 12.2l1.9 1.9 3.9-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (type === 'Balanced') {
    return (
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        <path
          d="M4 15l5-5 4 4 7-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 5v6h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        d="M13 3s-1 3-1 5 2 3 2 5-1 4-4 4-5-2-5-5c0-5 5-9 8-9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 10c2 2 2 3.5 2 5a4 4 0 01-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function MarketplaceCard({
  id,
  type,
  score,
  amount,
  duration,
  yield: apy,
  maxLoss,
  owner,
  price,
  forSale,
  viewHref,
  tradeHref,
}: MarketplaceCardProps) {
  const clampedScore = clampScore(score)
  const tier = scoreTier(clampedScore)

  const typeClass =
    type === 'Safe' ? styles.typeSafe : type === 'Balanced' ? styles.typeBalanced : styles.typeAggressive

  const scoreClass = tier === 'high' ? styles.scoreHigh : tier === 'mid' ? styles.scoreMid : styles.scoreLow

  const resolvedViewHref = viewHref ?? `/commitments?id=${encodeURIComponent(id)}`
  const resolvedTradeHref = tradeHref ?? `/marketplace/trade?id=${encodeURIComponent(id)}`

  return (
    <article className={`${styles.card} ${typeClass}`} aria-label={`Commitment ${id}`}>
      <header className={styles.topRow}>
        <div className={styles.iconWrap} aria-hidden="true">
          <TypeIcon type={type} />
        </div>
        <div className={styles.badges}>
          <span className={styles.typeBadge}>{type}</span>
          <span className={`${styles.scoreBadge} ${scoreClass}`}>{clampedScore}%</span>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.metaId}>#CMT-{id.padStart(3, '0')}</div>

        <dl className={styles.kv}>
          <div className={styles.kvRow}>
            <dt>Amount</dt>
            <dd>{amount}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Duration</dt>
            <dd>{duration}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Yield</dt>
            <dd className={styles.accentValue}>{apy}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Max Loss</dt>
            <dd>{maxLoss}</dd>
          </div>
          <div className={styles.kvRow}>
            <dt>Owner</dt>
            <dd className={styles.mono}>{truncateAddress(owner)}</dd>
          </div>
        </dl>
      </div>

      <footer className={styles.bottom}>
        <div className={styles.pricePanel} aria-label="Price">
          <div className={styles.priceLabel}>Price</div>
          <div className={styles.priceValue}>{price}</div>
        </div>

        <div className={styles.actions}>
          <Link className={styles.viewButton} href={resolvedViewHref} aria-label={`View ${id}`}>
            View
          </Link>

          {forSale ? (
            <Link className={styles.tradeButton} href={resolvedTradeHref} aria-label={`Trade ${id}`}>
              Trade
            </Link>
          ) : (
            <div className={styles.notForSale} aria-disabled="true">
              Not for sale
            </div>
          )}
        </div>
      </footer>
    </article>
  )
}


