import { useState, useCallback, useMemo } from "react";

import { useStore } from "../../store/useStore";
import { useUserData } from "../../hooks/useUserData";
import { useTransactionsData } from "../../hooks/useTransactionsData";
import Header from "../Header/Header";
import Menu from "../Menu/Menu";
import Summary from "../Summary/Summary";
import NewTransaction from "../NewTransaction/NewTransaction";
import Statement from "../Statement/Statement";
import Investments from "../Investments/Investments";
import OtherServices from "../OtherServices/OtherServices";
import CategoryChart from "../CategoryChart/CategoryChart";

import styles from "./MainPage.module.scss";

export default function MainPage() {
  const { user, transactions, deleteTransaction } = useStore();
  const [selectedMenu, setSelectedMenu] = useState("Início");

  // Buscar dados do usuário e transações usando React Query
  const { isLoading: isLoadingUser } = useUserData();
  const { isLoading: isLoadingTransactions } = useTransactionsData();

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
        return <Investments />;
      case "Outros serviços":
        return <OtherServices />;
      default:
        return <CategoryChart />;
    }
  }, [selectedMenu]);

  const renderMiddleContent = useCallback(() => {
    if (isLoadingUser || isLoadingTransactions) {
      return (
        <section id="middleContent" className={styles.middleContentContainer}>
          <div>Carregando dados...</div>
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
        <section id="statementSection">
          <Statement
            transactions={transactions}
            deleteTransaction={deleteTransaction}
          />
        </section>
      </main>
    </>
  );
}
