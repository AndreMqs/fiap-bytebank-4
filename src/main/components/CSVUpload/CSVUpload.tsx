import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { CSVTransaction } from '../../types/transaction';
import { CSVUploadProps } from '../../types/components';
import styles from './CSVUpload.module.scss';

export default function CSVUpload({ onTransactionsLoaded }: CSVUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [csvErrors, setCsvErrors] = useState<CSVError[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface CSVError {
    line: number;
    message: string;
  }

  const parseCSV = (csvText: string): { transactions: CSVTransaction[]; errors: CSVError[] } => {
    const lines = csvText.split('\n');
    const transactions: CSVTransaction[] = [];
    const errors: CSVError[] = [];

    if (lines.length < 2) {
      errors.push({ line: 0, message: 'Arquivo CSV deve ter pelo menos uma linha de dados' });
      return { transactions, errors };
    }

    const dataLines = lines.slice(1);
    
    dataLines.forEach((line, index) => {
      const lineNumber = index + 2; 
      
      if (line.trim() === '') {
        return;
      }
      
      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
      
      if (columns.length < 4) {
        errors.push({ 
          line: lineNumber, 
          message: `Linha ${lineNumber}: Esperado 4 colunas, encontrado ${columns.length}` 
        });
        return;
      }

      const [type, value, category, date] = columns;
      const lineErrors: string[] = [];

      const normalizedType = type.toLowerCase().trim();
      if (normalizedType !== 'receita' && normalizedType !== 'despesa') {
        lineErrors.push(`Tipo deve ser "Receita" ou "Despesa" (encontrado: "${type}")`);
      }

      const parsedValue = parseFloat(value.replace(',', '.'));
      if (isNaN(parsedValue) || parsedValue <= 0) {
        lineErrors.push(`Valor deve ser um número maior que zero (encontrado: "${value}")`);
      }

      if (!category || category.trim() === '') {
        lineErrors.push('Categoria não pode estar vazia');
      }

      if (!date || date.trim() === '') {
        lineErrors.push('Data não pode estar vazia');
      } else {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
          lineErrors.push(`Data inválida: "${date}"`);
        } else {
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          if (dateObj > today) {
            lineErrors.push('Data não pode ser futura');
          }
        }
      }

      if (lineErrors.length > 0) {
        errors.push({ 
          line: lineNumber, 
          message: `Linha ${lineNumber}: ${lineErrors.join('; ')}` 
        });
        return;
      }

      transactions.push({
        type: normalizedType === 'receita' ? 'income' : 'expense',
        value: parsedValue,
        category: category.trim(),
        date: date.trim()
      });
    });
    
    return { transactions, errors };
  };

  const handleFile = async (file: File) => {

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Por favor, selecione apenas arquivos CSV.');
      setCsvErrors([]);
      return;
    }

    setIsLoading(true);
    setError('');
    setCsvErrors([]);

    try {
      const text = await file.text();
      const { transactions, errors } = parseCSV(text);
      
      if (errors.length > 0) {
        setCsvErrors(errors);
        setError(`Encontrados ${errors.length} erro(s) no arquivo CSV. Verifique os detalhes abaixo.`);
        
        if (transactions.length === 0) {
          return;
        }
      }
      
      if (transactions.length === 0) {
        setError('Nenhuma transação válida encontrada no arquivo CSV.');
        return;
      }
      
      onTransactionsLoaded(transactions);
      
      if (errors.length > 0 && transactions.length > 0) {
        setError(`Arquivo processado com ${errors.length} erro(s). Apenas transações válidas serão adicionadas.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo CSV.');
      setCsvErrors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.csvUploadContainer}>
      <div
        className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <div className={styles.uploadContent}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <span>Processando arquivo...</span>
            </div>
          ) : (
            <>
              <div className={styles.uploadIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Arraste e solte seu arquivo CSV aqui</h3>
              <p>ou clique para selecionar</p>
              <div className={styles.csvInfo}>
                <p>Formato esperado: tipo,valor,categoria,data</p>
                <p>Exemplo: Receita,1500.00,Alimentação,2024-01-15</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className={styles.error}>
          <span>{error}</span>
        </div>
      )}
      
      {csvErrors.length > 0 && (
        <div className={styles.csvErrors}>
          <h4>Erros encontrados:</h4>
          <ul>
            {csvErrors.map((err, index) => (
              <li key={index}>
                <strong>Linha {err.line}:</strong> {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 