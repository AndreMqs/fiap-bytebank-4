import styles from './ModalLoadingFallback.module.scss';

export function ModalLoadingFallback() {
  return (
    <div className={styles.modalLoadingOverlay}>
      <div className={styles.modalLoadingBox}>
        <div className={styles.spinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
      </div>
    </div>
  );
}

