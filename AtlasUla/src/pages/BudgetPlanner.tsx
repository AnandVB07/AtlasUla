import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/UI';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  PieChart as ChartIcon, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  AlertCircle,
  HelpCircle,
  PiggyBank
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Trip, Expense, BudgetAllocation } from '../types';
import { toast } from 'react-hot-toast';

export const BudgetPlanner: React.FC = () => {
  const { user, gainXP, unlockAchievement } = useAuth();
  const location = useLocation();

  // Selected trip state
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Modal Expense State
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<'Hotel' | 'Food' | 'Transport' | 'Shopping' | 'Emergency' | 'Entertainment'>('Food');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseNotes, setExpenseNotes] = useState('');

  // Budget Adjust State
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [adjustedTotal, setAdjustedTotal] = useState('');

  // Load Trips
  useEffect(() => {
    if (user) {
      const storedTrips = localStorage.getItem('atlasula_trips');
      if (storedTrips) {
        try {
          const loadedTrips: Trip[] = JSON.parse(storedTrips);
          setTrips(loadedTrips);
          
          // Check route state for a specific trip selection
          const stateTripId = (location.state as any)?.tripId;
          const match = stateTripId 
            ? loadedTrips.find(t => t.id === stateTripId) 
            : loadedTrips[0];
          
          setSelectedTrip(match || null);
          if (match) {
            setAdjustedTotal(match.budget.total.toString());
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [user, location.state]);

  if (trips.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <Wallet className="w-16 h-16 text-textSecondary/20" />
        <h2 className="text-xl font-bold text-white font-sora">No active budgets found</h2>
        <p className="text-xs text-textSecondary max-w-sm">
          Please plan and save an itinerary first using the AI Planner to unlock smart budgeting dashboards!
        </p>
      </div>
    );
  }

  const handleTripChange = (tripId: string) => {
    const match = trips.find(t => t.id === tripId) || null;
    setSelectedTrip(match);
    if (match) {
      setAdjustedTotal(match.budget.total.toString());
    }
  };

  // Log new expense
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip) return;
    if (!expenseTitle.trim() || !expenseAmount) {
      toast.error('Fill in all mandatory fields.');
      return;
    }

    const newExpense: Expense = {
      id: 'exp_' + Math.random().toString(36).substring(2, 9),
      title: expenseTitle,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      date: expenseDate,
      notes: expenseNotes
    };

    const updatedExpenses = [newExpense, ...selectedTrip.expenses];
    const updatedTrip = {
      ...selectedTrip,
      expenses: updatedExpenses
    };

    // Save to LocalStorage
    const updatedTrips = trips.map(t => t.id === selectedTrip.id ? updatedTrip : t);
    setTrips(updatedTrips);
    setSelectedTrip(updatedTrip);
    localStorage.setItem('atlasula_trips', JSON.stringify(updatedTrips));

    // Reset Form
    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseNotes('');
    setShowAddExpense(false);
    toast.success('Expense logged successfully.');

    // Award XP
    gainXP(30);

    // Achievements check
    const totalSpent = updatedExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    if (totalSpent <= selectedTrip.budget.total) {
      // Trigger check or flag elsewhere
    }
  };

  // Delete expense
  const handleDeleteExpense = (expId: string) => {
    if (!selectedTrip) return;
    const updatedExpenses = selectedTrip.expenses.filter(e => e.id !== expId);
    const updatedTrip = {
      ...selectedTrip,
      expenses: updatedExpenses
    };

    const updatedTrips = trips.map(t => t.id === selectedTrip.id ? updatedTrip : t);
    setTrips(updatedTrips);
    setSelectedTrip(updatedTrip);
    localStorage.setItem('atlasula_trips', JSON.stringify(updatedTrips));
    toast.success('Expense deleted.');
  };

  // Update budget totals
  const handleUpdateBudget = () => {
    if (!selectedTrip || !adjustedTotal) return;

    const total = parseFloat(adjustedTotal);
    if (isNaN(total) || total <= 0) return;

    // Distribute allocations proportionately
    const budgetAllocation: BudgetAllocation = {
      total,
      Hotel: Math.round(total * 0.45),
      Food: Math.round(total * 0.25),
      Transport: Math.round(total * 0.12),
      Shopping: Math.round(total * 0.08),
      Emergency: Math.round(total * 0.05),
      Entertainment: Math.round(total * 0.05),
    };

    const updatedTrip = {
      ...selectedTrip,
      budget: budgetAllocation
    };

    const updatedTrips = trips.map(t => t.id === selectedTrip.id ? updatedTrip : t);
    setTrips(updatedTrips);
    setSelectedTrip(updatedTrip);
    localStorage.setItem('atlasula_trips', JSON.stringify(updatedTrips));
    setIsEditingBudget(false);
    toast.success('Budget limits updated.');
    gainXP(50);
  };

  // Calculations
  const totalBudget = selectedTrip?.budget.total || 0;
  const totalSpent = selectedTrip?.expenses.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  const remainingBudget = totalBudget - totalSpent;
  const percentSpent = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
  const isOverBudget = remainingBudget < 0;

  // Category summary map
  const getCategorySpent = (cat: string) => {
    return selectedTrip?.expenses
      .filter(e => e.category === cat)
      .reduce((acc, curr) => acc + curr.amount, 0) || 0;
  };

  // Chart data compile
  const getRechartsPieData = () => {
    if (!selectedTrip) return [];
    const categories = ['Hotel', 'Food', 'Transport', 'Shopping', 'Emergency', 'Entertainment'];
    return categories.map(cat => ({
      name: cat,
      value: getCategorySpent(cat)
    })).filter(c => c.value > 0);
  };

  const chartData = getRechartsPieData();
  const COLORS = ['#7C5CFF', '#00D4FF', '#22C55E', '#F59E0B', '#EF4444', '#B6C2CF'];

  // AI Expense Auditor heuristics
  const getAIAuditingAdvice = () => {
    if (!selectedTrip) return [];
    const advices = [];

    const foodSpent = getCategorySpent('Food');
    const foodLimit = selectedTrip.budget.Food;
    if (foodSpent > foodLimit * 0.75) {
      advices.push(`⚠️ Dining costs are at ${Math.round((foodSpent/foodLimit)*100)}% of limit. Seek out local food courts or traditional markets to save.`);
    }

    const shoppingSpent = getCategorySpent('Shopping');
    const shoppingLimit = selectedTrip.budget.Shopping;
    if (shoppingSpent > shoppingLimit) {
      advices.push(`🚨 Shopping budget exceeded by $${shoppingSpent - shoppingLimit}! Postpone non-essential shopping to avoid emergency fund deficits.`);
    }

    if (totalSpent > totalBudget) {
      advices.push(`🚨 Total expenditures have breached the $${totalBudget} trip budget. Consider dropping entertainment events or lodging options.`);
    } else if (remainingBudget > totalBudget * 0.4) {
      advices.push(`✨ Excellent job! You are maintaining a healthy ${Math.round((remainingBudget/totalBudget)*100)}% margin. Feel free to splurge slightly on unique activities.`);
    } else {
      advices.push(`👍 Spending is currently matching the predicted AI pace. Keep logging daily items to stay on track.`);
    }

    return advices;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Selector Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sora">Finance & Expenses</h1>
          <p className="text-xs text-textSecondary mt-1">Audit travel allocations, track spend logs, and read audits.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-textSecondary font-medium">Select Trip:</span>
          <select
            value={selectedTrip?.id || ''}
            onChange={(e) => handleTripChange(e.target.value)}
            className="glass-input rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none cursor-pointer bg-card"
          >
            {trips.map(t => (
              <option key={t.id} value={t.id}>📍 {t.destination}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedTrip && (
        <>
          {/* Overview Stat Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="glass" className="p-5 flex items-center justify-between border-white/10 relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] text-textSecondary uppercase tracking-widest font-sora">Trip Budget Limit</span>
                {isEditingBudget ? (
                  <div className="flex gap-2 items-center mt-1">
                    <input
                      type="number"
                      value={adjustedTotal}
                      onChange={(e) => setAdjustedTotal(e.target.value)}
                      className="w-24 bg-white/5 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                    />
                    <Button variant="accent" size="sm" onClick={handleUpdateBudget} className="h-8 py-0 px-3 cursor-pointer">Save</Button>
                  </div>
                ) : (
                  <h3 className="text-xl font-bold text-white font-sora flex items-center gap-2">
                    ${totalBudget}
                    <button 
                      onClick={() => setIsEditingBudget(true)}
                      className="text-[10px] text-primary-light hover:text-white transition-colors cursor-pointer"
                    >
                      (Edit)
                    </button>
                  </h3>
                )}
              </div>
              <Wallet className="w-8 h-8 text-primary-light/50" />
            </Card>

            <Card variant="glass" className="p-5 flex items-center justify-between border-white/10">
              <div className="space-y-1">
                <span className="text-[10px] text-textSecondary uppercase tracking-widest font-sora">Total Spent</span>
                <h3 className="text-xl font-bold text-white font-sora">${totalSpent}</h3>
              </div>
              <TrendingDown className={`w-8 h-8 ${isOverBudget ? 'text-error/50 animate-pulse' : 'text-accent/50'}`} />
            </Card>

            <Card variant="glass" className="p-5 flex items-center justify-between border-white/10">
              <div className="space-y-1">
                <span className="text-[10px] text-textSecondary uppercase tracking-widest font-sora">
                  {isOverBudget ? 'Budget Exceeded' : 'Remaining Balance'}
                </span>
                <h3 className={`text-xl font-bold font-sora ${isOverBudget ? 'text-error' : 'text-success'}`}>
                  ${Math.abs(remainingBudget)}
                </h3>
              </div>
              <PiggyBank className={`w-8 h-8 ${isOverBudget ? 'text-error/50' : 'text-success/50'}`} />
            </Card>
          </div>

          {/* Allocation Breakdown and Recharts Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Category Budgets progress bars */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-lg font-bold text-white font-sora">Category Allocations</h2>
                <span className="text-xs bg-white/5 border border-white/5 text-textSecondary px-2.5 py-0.5 rounded-full font-medium">
                  {percentSpent}% Spent Total
                </span>
              </div>
              
              <Card variant="solid" className="p-5 bg-card/65 border-white/5 space-y-4">
                {(['Hotel', 'Food', 'Transport', 'Shopping', 'Emergency', 'Entertainment'] as const).map((cat) => {
                  const limit = selectedTrip.budget[cat];
                  const spent = getCategorySpent(cat);
                  const catPercent = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
                  const isOver = spent > limit;

                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-white">{cat}</span>
                        <span className={isOver ? 'text-error' : 'text-textSecondary'}>
                          ${spent} / <span className="text-textSecondary/60">${limit}</span> ({Math.round((spent/limit)*100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOver ? 'bg-error' : cat === 'Hotel' ? 'bg-primary' : 'bg-accent'
                          }`}
                          style={{ width: `${catPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>

            {/* Recharts Pie Chart */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-lg font-bold text-white font-sora">Expenditure Share</h2>
              <Card variant="solid" className="p-5 bg-card/65 border-white/5 flex flex-col justify-center items-center h-full min-h-[300px]">
                {chartData.length > 0 ? (
                  <div className="w-full h-56 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            background: '#161B33', 
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            color: '#fff'
                          }} 
                          formatter={(value) => [`$${value}`, 'Spent']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Total Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-textSecondary font-sora">Total Spent</span>
                      <span className="text-xl font-black text-white font-sora">${totalSpent}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-textSecondary p-8 flex flex-col items-center justify-center">
                    <ChartIcon className="w-8 h-8 text-textSecondary/20 mb-2" />
                    No expenses logged. Add expenses to populate visual sharing chart!
                  </div>
                )}
                {/* Labels Indicator */}
                {chartData.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
                    {chartData.map((item, idx) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-[10px] font-semibold text-textSecondary">{item.name} (${item.value})</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* AI Auditor & Expenses List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Expense Logger List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white font-sora">Expense Logs</h2>
                <Button variant="primary" size="sm" onClick={() => setShowAddExpense(true)} className="gap-1.5 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Log Expense
                </Button>
              </div>

              <Card variant="solid" className="p-4 bg-card/65 border-white/5 space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
                {selectedTrip.expenses.length > 0 ? (
                  selectedTrip.expenses.map((exp) => (
                    <div 
                      key={exp.id}
                      className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center border text-xs font-bold ${
                          exp.category === 'Hotel' ? 'bg-primary/20 border-primary/40 text-primary-light' :
                          exp.category === 'Food' ? 'bg-accent/20 border-accent/40 text-accent' :
                          exp.category === 'Transport' ? 'bg-warning/20 border-warning/40 text-warning' :
                          exp.category === 'Entertainment' ? 'bg-success/20 border-success/40 text-success' : 'bg-white/5 border-white/10 text-white'
                        }`}>
                          {exp.category.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white leading-normal">{exp.title}</h4>
                          <p className="text-[9px] text-textSecondary mt-0.5 font-medium uppercase tracking-wider">
                            {exp.category} • {exp.date} {exp.notes ? `• ${exp.notes}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-white">${exp.amount}</span>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1.5 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 text-textSecondary hover:text-error hover:bg-error/15 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-xs text-textSecondary py-8">
                    No expense logs saved for this trip yet.
                  </div>
                )}
              </Card>
            </div>

            {/* AI Insights Auditor */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-lg font-bold text-white font-sora">AI Expense Audit</h2>
              <Card variant="solid" className="p-5 bg-card/65 border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles className="w-5 h-5 animate-pulse-glow" />
                  <h3 className="text-xs font-bold uppercase tracking-wider font-sora">Live Financial Insights</h3>
                </div>
                <div className="space-y-3 pt-2">
                  {getAIAuditingAdvice().map((adv, idx) => (
                    <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-textSecondary leading-relaxed">
                      {adv}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Add Expense Modal */}
          {showAddExpense && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
              <div className="absolute inset-0" onClick={() => setShowAddExpense(false)} />
              <Card variant="glass" className="w-full max-w-md relative z-10 border-white/10 p-6 space-y-4 transform animate-float">
                <h3 className="text-base font-bold text-white font-sora">Log Travel Expense</h3>
                <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
                  <Input
                    label="Expense Title"
                    placeholder="e.g. Traditional Lunch, Metro Pass"
                    required
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Amount ($)"
                      type="number"
                      min={0.01}
                      step={0.01}
                      required
                      placeholder="35.50"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                    />
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Category</label>
                      <select
                        value={expenseCategory}
                        onChange={(e: any) => setExpenseCategory(e.target.value)}
                        className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium focus:outline-none bg-card cursor-pointer"
                      >
                        <option value="Hotel">🏨 Lodging</option>
                        <option value="Food">🍛 Dinings</option>
                        <option value="Transport">🚇 Transit</option>
                        <option value="Shopping">🛍️ Shopping</option>
                        <option value="Entertainment">🎟️ Entertainment</option>
                        <option value="Emergency">⚠️ Emergency</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Expense Date"
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                  />

                  <Input
                    label="Optional Notes"
                    placeholder="e.g. Near Pont Neuf, split with John"
                    value={expenseNotes}
                    onChange={(e) => setExpenseNotes(e.target.value)}
                  />

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" variant="primary" className="flex-1 cursor-pointer">Log Expense</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddExpense(false)} className="cursor-pointer">Cancel</Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BudgetPlanner;
