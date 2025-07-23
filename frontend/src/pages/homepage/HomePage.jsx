import React from "react";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import "./HomePage.css";

const columns = [
  "Просроченные",
  "Сегодня",
  "Неделя",
  "Две",
  "Больше двух",
  "Завершенные"
];

const HomePage = () => {
  return (
    <div className="homepage-root">
      <header className="homepage-header">
        <div className="homepage-header-left">
          <Button theme="gray" size="medium">Создать задачу</Button>
        </div>
        <div className="homepage-header-center">
          <input className="homepage-search" placeholder="Поиск задач..." />
          <Icon type="search" width="20" height="20" className="homepage-search-icon" />
        </div>
        <div className="homepage-header-right">
          <div className="homepage-categories">
            {/* Здесь будут категории */}
            <span className="homepage-category">Все</span>
            <span className="homepage-category">Работа</span>
            <span className="homepage-category">Личное</span>
          </div>
        </div>
      </header>
      <main className="homepage-table-wrapper">
        <table className="homepage-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {columns.map((col) => (
                <td key={col}></td>
              ))}
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default HomePage; 