import { ChartConfiguration, ChartType } from 'chart.js';

export const SPENDING_CHART_CONFIG: {
  type: ChartType;
  options: ChartConfiguration['options'];
} = {
  type: 'line',
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Spending Trends' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '₹' + value.toLocaleString();
          },
        },
      },
    },
    animation: {
      duration: 1000,
    },
  },
};

export const CATEGORY_CHART_CONFIG: {
  type: ChartType;
  options: ChartConfiguration['options'];
} = {
  type: 'doughnut',
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Category Spending' },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.label + ': ₹' + context.parsed.toLocaleString();
          },
        },
      },
    },
    animation: {
      duration: 1000,
    },
  },
};

export const INCOME_CHART_CONFIG: {
  type: ChartType;
  options: ChartConfiguration['options'];
} = {
  type: 'bar',
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Income vs Expenses' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '₹' + value.toLocaleString();
          },
        },
      },
    },
    animation: {
      duration: 1000,
    },
  },
};

export const CHART_COLORS = {
  income: '#4CAF50',
  expenses: '#F44336',
  savings: '#2196F3',
  primary: '#3f51b5',
  secondary: '#ff4081',
};
