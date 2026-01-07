import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';

import { useInvestmentsData } from '../../hooks/useInvestmentsData';
import { useAddInvestment } from '../../hooks/useAddInvestment';
import InvestmentForm from './InvestmentForm/InvestmentForm';

import styles from './Investments.module.scss';

const ChartWrapper = ({ children, width, height }: { children: React.ReactNode; width: number; height: number }) => {
  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      {children}
    </div>
  );
};

export default function Investments() {
  const { totals, chartData, isLoading } = useInvestmentsData();
  const { addInvestmentAsync, isLoading: isAdding } = useAddInvestment();
  const { rendaFixa, rendaVariavel, total } = totals;
  const data = chartData;

  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 425);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!hasMounted) return null;

  if (isLoading) {
    return (
      <div className={styles.investmentsContainer}>
        <div className={styles.investmentsContent}>
          <span className={styles.title}>Investimentos</span>
          <div>Carregando investimentos...</div>
        </div>
      </div>
    );
  }

  const handleAddInvestment = async (data: { type: 'renda_fixa' | 'renda_variavel'; value: number }) => {
    try {
      await addInvestmentAsync(data);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao adicionar investimento:', error);
    }
  };

  return (
    <div className={styles.investmentsContainer}>
      <div className={styles.investmentsContent}>
        <div className={styles.headerContainer}>
          <span className={styles.title}>Investimentos</span>
          <button
            onClick={() => setShowForm(!showForm)}
            className={styles.toggleFormButton}
          >
            {showForm ? 'Ocultar Formulário' : 'Adicionar Investimento'}
          </button>
        </div>

        {showForm && (
          <InvestmentForm
            onSubmit={handleAddInvestment}
            isLoading={isAdding}
          />
        )}

        <span className={styles.total}>Total: R$ {total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
        <div className={styles.yields}>
          <div className={styles.yieldBox}>
            <span className={styles.yieldTitle}>Renda Fixa</span>
            <span className={styles.yieldValue}>R$ {rendaFixa.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
          </div>
          <div className={styles.yieldBox}>
            <span className={styles.yieldTitle}>Renda variável</span>
            <span className={styles.yieldValue}>R$ {rendaVariavel.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
          </div>
        </div>
        <span className={styles.statistics}>Estatísticas</span>
        {data.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            Nenhum investimento cadastrado ainda.
          </div>
        ) : (
          <div className={styles.chartContainer}>
            {isMobile ? (
            <div className={styles.mobileChartAndLegend}>
              <ChartWrapper width={300} height={180}>
                <PieChart width={300} height={180}>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={35}
                    label={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartWrapper>
              <div className={styles.mobileLegendWrapper}>
                {data.map((item) => (
                  <div key={item.name} className={styles.mobileLegendItem}>
                    <span className={styles.mobileLegendDot} style={{ backgroundColor: item.color }} />
                    <span className={styles.mobileLegendText}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.desktopChartWrapper}>
              <ChartWrapper width={400} height={220}>
                <PieChart width={400} height={220}>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    label={false}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ChartWrapper>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
} 