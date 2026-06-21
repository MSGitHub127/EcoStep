import React, { useState, Suspense, lazy } from 'react'
import { useEcoStepStore } from './state/useEcoStepStore.js'
import Header from './components/Header.jsx'
import OnboardingQuiz from './components/OnboardingQuiz.jsx'
import StreakWidget from './components/StreakWidget.jsx'
import DashboardHero from './components/DashboardHero.jsx'
import InsightCard from './components/InsightCard.jsx'
import QuickTapPanel from './components/QuickTapPanel.jsx'
import ActionChecklist from './components/ActionChecklist.jsx'
import PointsToast from './components/PointsToast.jsx'
import BottomNav from './components/BottomNav.jsx'
import ProfileView from './components/ProfileView.jsx'

// Lazy-loaded because it pulls in recharts, which is sizable — no reason
// to ship that in the initial bundle for people who never open this tab.
const ProgressView = lazy(() => import('./components/ProgressView.jsx'))

export default function App() {
  const store = useEcoStepStore()
  const [activeTab, setActiveTab] = useState('home')

  const {
    isDark,
    toggleTheme,
    onboardingComplete,
    stepIndex,
    calculating,
    selectAnswer,
    resetQuiz,
    answers,
    baselineTons,
    breakdown,
    insight,
    tapCounts,
    tapQuickAction,
    customLogs,
    logCustomAction,
    checked,
    toggleChecklistItem,
    streak,
    celebrate,
    toast,
    pointsToday,
    effectiveTons,
    soccerFields,
    todayCategoryTotals,
    dailyGoal,
    setDailyGoal,
    weeklyHistory,
    badges,
    badgeProgress,
    resetAll,
  } = store

  const handleRetakeQuiz = () => {
    resetQuiz()
    setActiveTab('home')
  }

  const handleResetAll = () => {
    resetAll()
    setActiveTab('home')
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen w-full font-body bg-offwhite dark:bg-charcoal text-charcoal dark:text-offwhite transition-colors duration-500">
        <PointsToast toast={toast} />
        <div className={`max-w-md mx-auto px-5 pt-6 ${onboardingComplete ? 'pb-24' : 'pb-16'}`}>
          <Header isDark={isDark} onToggleTheme={toggleTheme} />

          {!onboardingComplete ? (
            <>
              <p className="font-body text-sm mb-5 opacity-55">
                Three quick steps to set your starting line. No eco-guilt — just a baseline.
              </p>
              <OnboardingQuiz stepIndex={stepIndex} calculating={calculating} onSelect={selectAnswer} />
            </>
          ) : activeTab === 'home' ? (
            <div className="anim-step space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm opacity-55">Welcome back</p>
                  <h1 className="font-display text-2xl font-semibold tracking-tight">Your impact today</h1>
                </div>
                <StreakWidget streak={streak} celebrate={celebrate} />
              </div>

              <DashboardHero
                effectiveTons={effectiveTons}
                soccerFields={soccerFields}
                pointsToday={pointsToday}
                dailyGoal={dailyGoal}
              />
              <InsightCard insight={insight} />
              <QuickTapPanel
                tapCounts={tapCounts}
                onTap={tapQuickAction}
                customLogs={customLogs}
                onLogCustom={logCustomAction}
              />
              <ActionChecklist checked={checked} onToggle={toggleChecklistItem} />
            </div>
          ) : activeTab === 'progress' ? (
            <Suspense fallback={<div className="font-body text-sm opacity-55 py-12 text-center">Loading…</div>}>
              <ProgressView
                weeklyHistory={weeklyHistory}
                badges={badges}
                badgeProgress={badgeProgress}
                streak={streak}
                todayCategoryTotals={todayCategoryTotals}
              />
            </Suspense>
          ) : (
            <ProfileView
              answers={answers}
              baselineTons={baselineTons}
              breakdown={breakdown}
              dailyGoal={dailyGoal}
              setDailyGoal={setDailyGoal}
              isDark={isDark}
              onToggleTheme={toggleTheme}
              onRetakeQuiz={handleRetakeQuiz}
              onResetAll={handleResetAll}
            />
          )}
        </div>

        {onboardingComplete && <BottomNav active={activeTab} onChange={setActiveTab} />}
      </div>
    </div>
  )
}
