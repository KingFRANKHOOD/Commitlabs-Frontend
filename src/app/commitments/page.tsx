'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MyCommitmentsHeader from '@/components/MyCommitmentsHeader'
import styles from './page.module.css'

// TODO: Replace with actual data from contracts
const mockCommitments = [
  {
    id: '1',
    type: 'Balanced',
    amount: '100000',
    duration: 60,
    maxLoss: 8,
    status: 'active',
    createdAt: '2024-01-15',
    expiresAt: '2024-03-15',
    currentValue: '102000',
    complianceScore: 95,
  },
  {
    id: '2',
    type: 'Safe',
    amount: '50000',
    duration: 30,
    maxLoss: 2,
    status: 'active',
    createdAt: '2024-01-20',
    expiresAt: '2024-02-20',
    currentValue: '50100',
    complianceScore: 100,
  },
]

export default function MyCommitments() {
  const router = useRouter()

  return (
    <main id="main-content">
      <MyCommitmentsHeader 
        onBack={() => router.push('/')}
        onCreateNew={() => router.push('/create')}
      />

      <div className={styles.container}>
        <div className={styles.commitmentsList}>
          {mockCommitments.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No commitments yet. Create your first commitment to get started.</p>
              <Link href="/create" className={styles.createLink}>
                Create Commitment
              </Link>
            </div>
          ) : (
            mockCommitments.map((commitment) => (
              <div key={commitment.id} className={styles.commitmentCard}>
                <div className={styles.cardHeader}>
                  <h2>{commitment.type} Commitment</h2>
                  <span className={`${styles.status} ${styles[commitment.status]}`}>
                    {commitment.status}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.metric}>
                    <span className={styles.label}>Amount:</span>
                    <span className={styles.value}>{commitment.amount} XLM</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.label}>Current Value:</span>
                    <span className={styles.value}>{commitment.currentValue} XLM</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.label}>Duration:</span>
                    <span className={styles.value}>{commitment.duration} days</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.label}>Max Loss:</span>
                    <span className={styles.value}>{commitment.maxLoss}%</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.label}>Compliance Score:</span>
                    <span className={styles.value}>{commitment.complianceScore}/100</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.label}>Expires:</span>
                    <span className={styles.value}>{commitment.expiresAt}</span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.actionButton} aria-label={`View details for ${commitment.type} commitment`}>
                    View Details
                  </button>
                  <button className={styles.actionButton} aria-label={`View attestations for ${commitment.type} commitment`}>
                    View Attestations
                  </button>
                  <button className={styles.actionButtonDanger} aria-label={`Early exit for ${commitment.type} commitment`}>
                    Early Exit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

