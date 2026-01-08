import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { GetInvestments } from '../../domain/usecases/GetInvestments'
import { investmentRepository } from '../../infra/repositories/InvestmentRepository'
import { queryKeys } from '../../infra/react-query/queryKeys'

const getInvestmentsUseCase = new GetInvestments(investmentRepository)

export function useInvestmentsData() {
  const { user: authUser } = useAuth()

  const {
    data: investments,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.investments(authUser?.uid),
    queryFn: async () => {
      if (!authUser?.uid) {
        throw new Error('Usuário não autenticado')
      }
      return getInvestmentsUseCase.execute(authUser.uid)
    },
    enabled: !!authUser?.uid,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (error) {
      console.error('Erro ao carregar investimentos:', error)
    }
  }, [error])

  const totals = {
    total: 0,
    rendaFixa: 0,
    rendaVariavel: 0,
  }

  if (investments) {
    investments.forEach((investment) => {
      totals.total += investment.value
      if (investment.type === 'renda_fixa') {
        totals.rendaFixa += investment.value
      } else {
        totals.rendaVariavel += investment.value
      }
    })
  }

  const chartData = [
    {
      name: 'Renda Fixa',
      value: totals.rendaFixa,
      color: '#2196F3',
    },
    {
      name: 'Renda Variável',
      value: totals.rendaVariavel,
      color: '#FF9800',
    },
  ].filter(item => item.value > 0)

  return {
    investments: investments || [],
    totals,
    chartData,
    isLoading,
    error,
    refetch,
  }
}

