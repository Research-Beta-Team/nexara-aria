import useStore from '../store/useStore';

export default function useCredits() {
  const creditsIncluded = useStore(s => s.creditsIncluded);
  const creditsUsed = useStore(s => s.creditsUsed);
  const rolloverBalance = useStore(s => s.rolloverBalance);
  const creditBurnRatePerDay = useStore(s => s.creditBurnRatePerDay);

  const totalAvailable = creditsIncluded + rolloverBalance;
  const creditsRemaining = Math.max(0, totalAvailable - creditsUsed);
  const usagePercent = totalAvailable > 0
    ? Math.min(100, Math.max(0, (creditsUsed / totalAvailable) * 100))
    : 0;

  return {
    creditsRemaining,
    creditsUsed,
    creditsIncluded,
    rolloverBalance,
    usagePercent,
    isLow: usagePercent > 85,
    isCritical: usagePercent > 95,
    canAffordAction: (creditCost) => creditsRemaining >= creditCost,
    estimatedDaysRemaining: creditBurnRatePerDay > 0
      ? Math.floor(creditsRemaining / creditBurnRatePerDay)
      : Infinity,
  };
}
