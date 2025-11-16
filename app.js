// Finance Tracker Application
class FinanceTracker {
    constructor() {
        this.data = {
            userProfile: {
                name: "Sri Harsha Tej",
                email: "harshatej@gmail.com",
                phone: "+91 63093 66852",
            },
            budgetCategories: [
                {name: "Food & Dining", budget: 800, spent: 450, color: "#1FB8CD"},
                {name: "Transportation", budget: 400, spent: 320, color: "#FFC185"},
                {name: "Entertainment", budget: 300, spent: 180, color: "#B4413C"},
                {name: "Utilities", budget: 500, spent: 450, color: "#ECEBD5"},
                {name: "Healthcare", budget: 200, spent: 120, color: "#5D878F"}
            ],
            expenseCategories: [
                "Food & Dining", "Transportation", "Entertainment", "Utilities", "Healthcare", 
                "Shopping", "Groceries", "Gas", "Coffee", "Rent", "Insurance", "Phone"
            ],
            expenses: [
                {id: 1, description: "Grocery Store", amount: 85.50, category: "Groceries", date: "2024-12-09", type: "expense"},
                {id: 2, description: "Gas Station", amount: 45.00, category: "Transportation", date: "2024-12-08", type: "expense"},
                {id: 3, description: "Restaurant", amount: 32.75, category: "Food & Dining", date: "2024-12-07", type: "expense"},
                {id: 4, description: "Salary", amount: 3500.00, category: "Income", date: "2024-12-01", type: "income"}
            ],
            bills: [
                {id: 1, name: "Electric Bill", amount: 125.00, dueDate: "2024-12-15", category: "Utilities", status: "unpaid", recurring: "monthly"},
                {id: 2, name: "Internet Bill", amount: 59.99, dueDate: "2024-12-18", category: "Utilities", status: "unpaid", recurring: "monthly"},
                {id: 3, name: "Phone Bill", amount: 85.00, dueDate: "2024-12-20", category: "Phone", status: "paid", recurring: "monthly"},
                {id: 4, name: "Insurance", amount: 150.00, dueDate: "2024-12-25", category: "Insurance", status: "unpaid", recurring: "monthly"}
            ]
        };

        this.charts = {};
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        this.setupEventListeners();
        this.populateExpenseCategories();
        this.renderDashboard();
        this.renderProfile();
        this.renderBudget();
        this.renderExpenses();
        this.renderBills();
        this.setCurrentDate();
        
        // Initialize with dashboard
        this.navigateToSection('dashboard');
        
        // Render charts after a short delay to ensure proper initialization
        setTimeout(() => {
            if (this.currentSection === 'charts') {
                this.renderCharts();
            }
        }, 100);
    }

    setupEventListeners() {
        // Navigation - use event delegation for better reliability
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-item') || e.target.closest('.nav-item')) {
                const navItem = e.target.matches('.nav-item') ? e.target : e.target.closest('.nav-item');
                const section = navItem.getAttribute('data-section');
                if (section) {
                    e.preventDefault();
                    this.navigateToSection(section);
                }
            }
        });

        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }

        // Modal controls
        this.setupModalControls();

        // Form submissions
        const expenseForm = document.getElementById('expenseForm');
        if (expenseForm) {
            expenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addExpense();
            });
        }

        const billForm = document.getElementById('billForm');
        if (billForm) {
            billForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addBill();
            });
        }

        const budgetForm = document.getElementById('budgetForm');
        if (budgetForm) {
            budgetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addBudget();
            });
        }
    }

    setupModalControls() {
        // Add expense modal
        const addExpenseBtn = document.getElementById('addExpenseBtn');
        if (addExpenseBtn) {
            addExpenseBtn.addEventListener('click', () => {
                this.showModal('expenseModal');
            });
        }

        // Add bill modal
        const addBillBtn = document.getElementById('addBillBtn');
        if (addBillBtn) {
            addBillBtn.addEventListener('click', () => {
                this.showModal('billModal');
            });
        }

        // Add budget modal
        const addBudgetBtn = document.getElementById('addBudgetBtn');
        if (addBudgetBtn) {
            addBudgetBtn.addEventListener('click', () => {
                this.showModal('budgetModal');
            });
        }

        // Close modals
        document.addEventListener('click', (e) => {
            if (e.target.matches('.modal__close') || e.target.matches('.modal__backdrop')) {
                this.hideAllModals();
            }
            if (e.target.matches('[id^="cancel"]')) {
                this.hideAllModals();
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    navigateToSection(sectionName) {
        console.log('Navigating to:', sectionName); // Debug log
        
        // Update current section
        this.currentSection = sectionName;

        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('nav-item--active');
        });
        
        const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('nav-item--active');
        }

        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('section--active');
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('section--active');
            targetSection.style.display = 'block';
        }

        // Special handling for charts section
        if (sectionName === 'charts') {
            setTimeout(() => {
                this.renderCharts();
            }, 100);
        }

        // Refresh data when navigating to sections
        this.refreshSectionData(sectionName);
    }

    refreshSectionData(sectionName) {
        switch(sectionName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'budget':
                this.renderBudget();
                break;
            case 'expenses':
                this.renderExpenses();
                break;
            case 'bills':
                this.renderBills();
                break;
            case 'charts':
                // Charts will be rendered by the timeout in navigateToSection
                break;
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        });
        this.resetForms();
    }

    resetForms() {
        const forms = ['expenseForm', 'billForm', 'budgetForm'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.reset();
            }
        });
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        const expenseDate = document.getElementById('expenseDate');
        const billDueDate = document.getElementById('billDueDate');
        
        if (expenseDate) expenseDate.value = today;
        if (billDueDate) billDueDate.value = today;
    }

    populateExpenseCategories() {
        const select = document.getElementById('expenseCategory');
        if (select) {
            select.innerHTML = '<option value="">Select Category</option>';
            this.data.expenseCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                select.appendChild(option);
            });
        }
    }

    renderDashboard() {
        this.updateStats();
        this.renderRecentTransactions();
    }

    updateStats() {
        const totalIncome = this.data.expenses
            .filter(expense => expense.type === 'income')
            .reduce((sum, expense) => sum + expense.amount, 0);

        const totalExpenses = this.data.expenses
            .filter(expense => expense.type === 'expense')
            .reduce((sum, expense) => sum + expense.amount, 0);

        const totalBalance = totalIncome - totalExpenses;

        const upcomingBills = this.data.bills
            .filter(bill => bill.status === 'unpaid')
            .reduce((sum, bill) => sum + bill.amount, 0);

        const elements = {
            totalIncome: document.getElementById('totalIncome'),
            totalExpenses: document.getElementById('totalExpenses'),
            totalBalance: document.getElementById('totalBalance'),
            upcomingBills: document.getElementById('upcomingBills')
        };

        if (elements.totalIncome) elements.totalIncome.textContent = `$${totalIncome.toFixed(2)}`;
        if (elements.totalExpenses) elements.totalExpenses.textContent = `$${totalExpenses.toFixed(2)}`;
        if (elements.totalBalance) elements.totalBalance.textContent = `$${totalBalance.toFixed(2)}`;
        if (elements.upcomingBills) elements.upcomingBills.textContent = `$${upcomingBills.toFixed(2)}`;
    }

    renderRecentTransactions() {
        const container = document.getElementById('recentTransactions');
        if (!container) return;

        const recentTransactions = this.data.expenses
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        container.innerHTML = recentTransactions.map(transaction => `
            <div class="transaction-item fade-in">
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-category">${transaction.category} • ${this.formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-amount transaction-amount--${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                </div>
            </div>
        `).join('');
    }

    renderProfile() {
        const elements = {
            profileName: document.getElementById('profileName'),
            profileEmail: document.getElementById('profileEmail'),
            profilePhone: document.getElementById('profilePhone'),
            userName: document.getElementById('userName'),
            userAvatar: document.getElementById('userAvatar')
        };

        if (elements.profileName) elements.profileName.value = this.data.userProfile.name;
        if (elements.profileEmail) elements.profileEmail.value = this.data.userProfile.email;
        if (elements.profilePhone) elements.profilePhone.value = this.data.userProfile.phone;
        if (elements.userName) elements.userName.textContent = this.data.userProfile.name;
        if (elements.userAvatar) elements.userAvatar.src = this.data.userProfile.profilePicture;
    }

    updateProfile() {
        const elements = {
            profileName: document.getElementById('profileName'),
            profileEmail: document.getElementById('profileEmail'),
            profilePhone: document.getElementById('profilePhone')
        };

        if (elements.profileName) this.data.userProfile.name = elements.profileName.value;
        if (elements.profileEmail) this.data.userProfile.email = elements.profileEmail.value;
        if (elements.profilePhone) this.data.userProfile.phone = elements.profilePhone.value;

        const userName = document.getElementById('userName');
        if (userName) userName.textContent = this.data.userProfile.name;
        
        this.showNotification('Profile updated successfully!', 'success');
    }

    renderBudget() {
        const container = document.getElementById('budgetList');
        if (!container) return;

        container.innerHTML = this.data.budgetCategories.map(budget => {
            const percentage = Math.min((budget.spent / budget.budget) * 100, 100);
            const isOverBudget = budget.spent > budget.budget;

            return `
                <div class="budget-item fade-in">
                    <div class="budget-header">
                        <h4 class="budget-name">${budget.name}</h4>
                        <div class="budget-amounts">
                            $${budget.spent.toFixed(2)} / $${budget.budget.toFixed(2)}
                        </div>
                    </div>
                    <div class="budget-progress">
                        <div class="budget-progress-bar ${isOverBudget ? 'budget-progress-bar--over' : ''}" 
                             style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderExpenses() {
        const container = document.getElementById('expenseList');
        if (!container) return;

        const expenses = this.data.expenses
            .filter(expense => expense.type === 'expense')
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = expenses.map(expense => `
            <div class="expense-item fade-in">
                <div class="expense-details">
                    <div class="expense-description">${expense.description}</div>
                    <div class="expense-category">${expense.category} • ${this.formatDate(expense.date)}</div>
                </div>
                <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
            </div>
        `).join('');
    }

    renderBills() {
        const container = document.getElementById('billList');
        if (!container) return;

        const bills = this.data.bills.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        container.innerHTML = bills.map(bill => {
            const dueDate = new Date(bill.dueDate);
            const today = new Date();
            const isOverdue = dueDate < today && bill.status === 'unpaid';
            const status = isOverdue ? 'overdue' : bill.status;

            return `
                <div class="bill-item fade-in">
                    <div class="bill-details">
                        <div class="bill-name">${bill.name}</div>
                        <div class="bill-category">${bill.category} • Due: ${this.formatDate(bill.dueDate)}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="bill-amount">$${bill.amount.toFixed(2)}</div>
                        <span class="bill-status bill-status--${status}">${status}</span>
                        ${bill.status === 'unpaid' ? `<button class="btn btn--sm btn--primary" onclick="window.app.markBillPaid(${bill.id})">Pay</button>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderCharts() {
        this.renderExpenseChart();
        this.renderIncomeChart();
        this.renderBudgetChart();
    }

    renderExpenseChart() {
        const canvas = document.getElementById('expenseChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.expense) {
            this.charts.expense.destroy();
        }

        const expensesByCategory = {};
        this.data.expenses
            .filter(expense => expense.type === 'expense')
            .forEach(expense => {
                expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
            });

        const labels = Object.keys(expensesByCategory);
        const data = Object.values(expensesByCategory);
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

        this.charts.expense = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    renderIncomeChart() {
        const canvas = document.getElementById('incomeChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.income) {
            this.charts.income.destroy();
        }

        const totalIncome = this.data.expenses
            .filter(expense => expense.type === 'income')
            .reduce((sum, expense) => sum + expense.amount, 0);

        const totalExpenses = this.data.expenses
            .filter(expense => expense.type === 'expense')
            .reduce((sum, expense) => sum + expense.amount, 0);

        this.charts.income = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Income', 'Expenses', 'Balance'],
                datasets: [{
                    label: 'Amount ($)',
                    data: [totalIncome, totalExpenses, totalIncome - totalExpenses],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    renderBudgetChart() {
        const canvas = document.getElementById('budgetChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.budget) {
            this.charts.budget.destroy();
        }

        const labels = this.data.budgetCategories.map(budget => budget.name);
        const budgetData = this.data.budgetCategories.map(budget => budget.budget);
        const spentData = this.data.budgetCategories.map(budget => budget.spent);

        this.charts.budget = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Budget',
                        data: budgetData,
                        backgroundColor: '#1FB8CD',
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    },
                    {
                        label: 'Spent',
                        data: spentData,
                        backgroundColor: '#FFC185',
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    addExpense() {
        const elements = {
            description: document.getElementById('expenseDescription'),
            amount: document.getElementById('expenseAmount'),
            category: document.getElementById('expenseCategory'),
            date: document.getElementById('expenseDate')
        };

        const description = elements.description?.value;
        const amount = parseFloat(elements.amount?.value || 0);
        const category = elements.category?.value;
        const date = elements.date?.value;

        if (!description || !amount || !category || !date) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const newExpense = {
            id: Date.now(),
            description,
            amount,
            category,
            date,
            type: 'expense'
        };

        this.data.expenses.push(newExpense);
        this.updateBudgetSpending(category, amount);
        this.hideAllModals();
        this.refreshAllData();
        this.showNotification('Expense added successfully!', 'success');
    }

    addBill() {
        const elements = {
            name: document.getElementById('billName'),
            amount: document.getElementById('billAmount'),
            category: document.getElementById('billCategory'),
            dueDate: document.getElementById('billDueDate'),
            recurring: document.getElementById('billRecurring')
        };

        const name = elements.name?.value;
        const amount = parseFloat(elements.amount?.value || 0);
        const category = elements.category?.value;
        const dueDate = elements.dueDate?.value;
        const recurring = elements.recurring?.value;

        if (!name || !amount || !category || !dueDate || !recurring) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const newBill = {
            id: Date.now(),
            name,
            amount,
            category,
            dueDate,
            recurring,
            status: 'unpaid'
        };

        this.data.bills.push(newBill);
        this.hideAllModals();
        this.refreshAllData();
        this.showNotification('Bill added successfully!', 'success');
    }

    addBudget() {
        const elements = {
            name: document.getElementById('budgetName'),
            amount: document.getElementById('budgetAmount')
        };

        const name = elements.name?.value;
        const amount = parseFloat(elements.amount?.value || 0);

        if (!name || !amount) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
        const newBudget = {
            name,
            budget: amount,
            spent: 0,
            color: colors[this.data.budgetCategories.length % colors.length]
        };

        this.data.budgetCategories.push(newBudget);
        
        // Add to expense categories if not already there
        if (!this.data.expenseCategories.includes(name)) {
            this.data.expenseCategories.push(name);
            this.populateExpenseCategories();
        }

        this.hideAllModals();
        this.refreshAllData();
        this.showNotification('Budget category added successfully!', 'success');
    }

    updateBudgetSpending(category, amount) {
        const budget = this.data.budgetCategories.find(b => b.name === category);
        if (budget) {
            budget.spent += amount;
        }
    }

    markBillPaid(billId) {
        const bill = this.data.bills.find(b => b.id === billId);
        if (bill) {
            bill.status = 'paid';
            this.refreshAllData();
            this.showNotification('Bill marked as paid!', 'success');
        }
    }

    refreshAllData() {
        this.renderDashboard();
        this.renderBudget();
        this.renderExpenses();
        this.renderBills();
        
        // Only refresh charts if we're on the charts section
        if (this.currentSection === 'charts') {
            this.renderCharts();
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `status status--${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        // Add animation styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new FinanceTracker();
        window.app = app;
    });
} else {
    app = new FinanceTracker();
    window.app = app;
}

