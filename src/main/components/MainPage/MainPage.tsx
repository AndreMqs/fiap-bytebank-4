import { useState, useCallback, useMemo, Suspense, lazy } from "react";

import { useUserData } from "../../hooks/useUserData";
import { useTransactionsData } from "../../hooks/useTransactionsData";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";
import { ComponentLoadingFallback, DataLoadingFallback } from "../../../presentation/components/layout/LoadingFallback";
import Header from "../Header/Header";
import Menu from "../Menu/Menu";
import Summary from "../Summary/Summary";
import NewTransaction from "../NewTransaction/NewTransaction";
import Statement from "../Statement/Statement";
import OtherServices from "../OtherServices/OtherServices";

const CategoryChart = lazy(() => import("../CategoryChart/CategoryChart"));
const Investments = lazy(() => import("../Investments/Investments"));

import styles from "./MainPage.module.scss";

export default function MainPage() {
  const [selectedMenu, setSelectedMenu] = useState("Início");


  const { user, isLoading: isLoadingUser } = useUserData();
  const { transactions, isLoading: isLoadingTransactions } = useTransactionsData();
  const { deleteTransactionAsync } = useDeleteTransaction();
  
  const deleteTransaction = useCallback(async (id: number) => {
    await deleteTransactionAsync(id);
  }, [deleteTransactionAsync]);

  const handleMenuClick = useCallback((title: string) => {
    setSelectedMenu(title);
  }, []);

  const menuItems = useMemo(
    () => [
      {
        title: "Início",
        route: "/inicio",
        selected: selectedMenu === "Início",
      },
      {
        title: "Transferências",
        route: "/inicio",
        selected: selectedMenu === "Transferências",
      },
      {
        title: "Investimentos",
        route: "/inicio",
        selected: selectedMenu === "Investimentos",
      },
      {
        title: "Outros serviços",
        route: "/home",
        selected: selectedMenu === "Outros serviços",
      },
    ],
    [selectedMenu]
  );

  const mainContent = useMemo(() => {
    switch (selectedMenu) {
      case "Transferências":
        return <NewTransaction />;
      case "Investimentos":
        return (
          <Suspense fallback={<ComponentLoadingFallback />}>
            <Investments />
          </Suspense>
        );
      case "Outros serviços":
        return <OtherServices />;
      default:
        return (
          <Suspense fallback={<ComponentLoadingFallback />}>
            <CategoryChart />
          </Suspense>
        );
    }
  }, [selectedMenu]);

  const renderMiddleContent = useCallback(() => {
    if (isLoadingUser || isLoadingTransactions) {
      return (
        <section id="middleContent" className={styles.middleContentContainer}>
          <DataLoadingFallback />
        </section>
      );
    }
    
    if (!user) {
      return (
        <section id="middleContent" className={styles.middleContentContainer}>
          <div>Erro ao carregar dados do usuário</div>
        </section>
      );
    }
    
    return (
      <section id="middleContent" className={styles.middleContentContainer}>
        <Summary username={user.name || 'Cliente'} money={user.balance || 0} />
        {mainContent}
      </section>
    );
  }, [mainContent, user, isLoadingUser, isLoadingTransactions]);

  return (
    <>
      <Header items={menuItems} onMenuClick={handleMenuClick} />
      <main id="mainContent" className={styles.mainContentContainer}>
        <Menu items={menuItems} onMenuClick={handleMenuClick} />
        {renderMiddleContent()}
        <section className={styles.statementSection}>
          <Statement
            transactions={transactions}
            deleteTransaction={deleteTransaction}
          />
        </section>
      </main>
    </>
  );
}
