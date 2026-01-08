import React from 'react'
import styles from './LoadingFallback.module.scss'

interface LoadingFallbackProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
}

export function LoadingFallback({ 
  message = 'Carregando...', 
  size = 'medium' 
}: LoadingFallbackProps) {
  return (
    <div className={styles.loadingContainer} data-size={size}>
      <div className={styles.spinner}>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
        <div className={styles.spinnerRing}></div>
      </div>
      <p className={styles.loadingMessage}>{message}</p>
    </div>
  )
}

export function RouteLoadingFallback() {
  return <LoadingFallback message="Carregando página..." size="large" />
}

export function ComponentLoadingFallback() {
  return <LoadingFallback message="Carregando componente..." size="medium" />
}

export function DataLoadingFallback() {
  return <LoadingFallback message="Carregando dados..." size="small" />
}

