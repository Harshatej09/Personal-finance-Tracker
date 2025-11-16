# Create sample data for the personal finance tracker
import json
from datetime import datetime, timedelta
import random

# Generate sample transaction data for the past 6 months
start_date = datetime.now() - timedelta(days=180)
transactions = []
categories = ['Food & Dining', 'Shopping', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Travel']
income_sources = ['Salary', 'Freelance', 'Investment', 'Other']

# Generate sample transactions
for i in range(150):
    date = start_date + timedelta(days=random.randint(0, 180))
    
    # 20% chance of income, 80% chance of expense
    if random.random() < 0.2:
        transaction_type = 'income'
        amount = random.randint(500, 5000)
        category = random.choice(income_sources)
        description = f"{category} payment"
    else:
        transaction_type = 'expense'
        amount = random.randint(10, 800)
        category = random.choice(categories)
        descriptions = {
            'Food & Dining': ['Grocery shopping', 'Restaurant meal', 'Coffee', 'Takeout order'],
            'Shopping': ['Clothing', 'Electronics', 'Home goods', 'Online purchase'],
            'Transportation': ['Gas', 'Uber ride', 'Bus ticket', 'Car maintenance'],
            'Entertainment': ['Movie tickets', 'Concert', 'Gaming', 'Streaming subscription'],
            'Utilities': ['Electricity bill', 'Internet bill', 'Water bill', 'Phone bill'],
            'Healthcare': ['Doctor visit', 'Pharmacy', 'Insurance', 'Dental care'],
            'Education': ['Books', 'Course fee', 'Online learning', 'Certification'],
            'Travel': ['Flight ticket', 'Hotel', 'Car rental', 'Travel insurance']
        }
        description = random.choice(descriptions[category])
    
    transactions.append({
        'id': i + 1,
        'date': date.strftime('%Y-%m-%d'),
        'description': description,
        'category': category,
        'amount': amount,
        'type': transaction_type
    })

# Sort transactions by date (newest first)
transactions.sort(key=lambda x: x['date'], reverse=True)

# Create sample user data
user_data = {
    'name': 'John Doe',
    'email': 'john.doe@email.com',
    'avatar': '/api/placeholder/40/40',
    'total_balance': 15750,
    'monthly_budget': 3000,
    'savings_goal': 20000,
    'current_savings': 15750
}

# Calculate monthly summary data
monthly_data = {}
for transaction in transactions:
    month_key = transaction['date'][:7]  # YYYY-MM format
    if month_key not in monthly_data:
        monthly_data[month_key] = {'income': 0, 'expenses': 0}
    
    if transaction['type'] == 'income':
        monthly_data[month_key]['income'] += transaction['amount']
    else:
        monthly_data[month_key]['expenses'] += transaction['amount']

# Convert to lists for charts
months = sorted(monthly_data.keys())[-6:]  # Last 6 months
monthly_income = [monthly_data[month]['income'] for month in months]
monthly_expenses = [monthly_data[month]['expenses'] for month in months]

# Calculate expense breakdown by category
expense_breakdown = {}
for transaction in transactions:
    if transaction['type'] == 'expense':
        category = transaction['category']
        if category not in expense_breakdown:
            expense_breakdown[category] = 0
        expense_breakdown[category] += transaction['amount']

# Create the complete data structure
finance_data = {
    'user': user_data,
    'transactions': transactions[:50],  # Limit to 50 most recent transactions
    'monthly_income': monthly_income,
    'monthly_expenses': monthly_expenses,
    'months': months,
    'expense_breakdown': expense_breakdown,
    'categories': categories,
    'recent_bills': [
        {'name': 'Electricity Bill', 'amount': 120, 'due_date': '2025-08-05', 'status': 'pending'},
        {'name': 'Internet Bill', 'amount': 60, 'due_date': '2025-08-10', 'status': 'pending'},
        {'name': 'Phone Bill', 'amount': 45, 'due_date': '2025-08-15', 'status': 'pending'},
        {'name': 'Water Bill', 'amount': 35, 'due_date': '2025-08-20', 'status': 'pending'}
    ]
}

print("Sample finance data created successfully!")
print(f"Total transactions: {len(transactions)}")
print(f"Monthly data points: {len(months)}")
print(f"Expense categories: {len(expense_breakdown)}")

# Show a preview of the data
print("\nSample transaction:")
print(json.dumps(transactions[0], indent=2))

print("\nMonthly summary (last month):")
print(f"Income: ${monthly_income[-1]}")
print(f"Expenses: ${monthly_expenses[-1]}")

print("\nExpense breakdown:")
for category, amount in sorted(expense_breakdown.items(), key=lambda x: x[1], reverse=True)[:5]:
    print(f"{category}: ${amount}")