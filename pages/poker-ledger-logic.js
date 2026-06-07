export const EVENT_TYPES = {
  'buy-in-cash': 'Cash in',
  'buy-in-iou': 'IOHost',
  'cash-out-cash': 'Cash out',
  'cash-out-iou': 'IOPlayer',
  'edit': 'Edit'
};

export function formatCurrency(amount) {
  const num = parseFloat(amount);
  return '$' + (num % 1 === 0 ? num.toFixed(0) : num.toFixed(2));
}

export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getPlayerSummary(events) {
  const s = {};
  events.forEach(ev => {
    if (ev.type === 'edit') return;
    if (!s[ev.username]) s[ev.username] = { buyInCash: 0, buyInIou: 0, cashOutCash: 0, cashOutIou: 0 };
    if (ev.type === 'buy-in-cash') s[ev.username].buyInCash += ev.amount;
    else if (ev.type === 'buy-in-iou') s[ev.username].buyInIou += ev.amount;
    else if (ev.type === 'cash-out-cash') s[ev.username].cashOutCash += ev.amount;
    else if (ev.type === 'cash-out-iou') s[ev.username].cashOutIou += ev.amount;
  });
  return s;
}

export function getResults(events) {
  const summary = getPlayerSummary(events);
  return Object.entries(summary).map(([player, s]) => {
    const totalBuyIn = s.buyInCash + s.buyInIou;
    const totalCashOut = s.cashOutCash + s.cashOutIou;
    const net = totalCashOut - totalBuyIn;
    return { player, totalBuyIn, totalCashOut, net, ...s };
  }).filter(r => r.totalBuyIn > 0 || r.totalCashOut > 0)
    .sort((a, b) => b.net - a.net);
}

export function getResultsTotals(results) {
  const grandTotalBuyIn = results.reduce((sum, r) => sum + r.totalBuyIn, 0);
  const grandTotalCashOut = results.reduce((sum, r) => sum + r.totalCashOut, 0);
  const totalCashIn = results.reduce((sum, r) => sum + r.buyInCash, 0);
  const totalIOHost = results.reduce((sum, r) => sum + r.buyInIou, 0);
  const totalCashOut = results.reduce((sum, r) => sum + r.cashOutCash, 0);
  const totalIOPlayer = results.reduce((sum, r) => sum + r.cashOutIou, 0);
  const hostEarnings = grandTotalBuyIn - grandTotalCashOut;
  const moneyOnTable = grandTotalBuyIn - grandTotalCashOut;

  const discrepancyClass = hostEarnings > 0 ? 'positive' : (hostEarnings < 0 ? 'negative' : 'neutral');
  const discrepancyDisplay = hostEarnings >= 0 ? '+' + formatCurrency(hostEarnings) : formatCurrency(hostEarnings);
  const discrepancySubtitle = hostEarnings > 0 ? 'Host earns ' + formatCurrency(hostEarnings)
    : hostEarnings < 0 ? 'Host loses ' + formatCurrency(Math.abs(hostEarnings))
    : 'No discrepancy between money in and out';

  return {
    grandTotalBuyIn, grandTotalCashOut,
    totalCashIn, totalIOHost, totalCashOut, totalIOPlayer,
    hostEarnings, moneyOnTable,
    discrepancyClass, discrepancyDisplay, discrepancySubtitle
  };
}

export function getIOUData(events) {
  const s = {};
  events.forEach(ev => {
    if (ev.type === 'edit') return;
    if (!s[ev.username]) s[ev.username] = { buyInIou: 0, cashOutIou: 0 };
    if (ev.type === 'buy-in-iou') s[ev.username].buyInIou += ev.amount;
    else if (ev.type === 'cash-out-iou') s[ev.username].cashOutIou += ev.amount;
  });
  return Object.entries(s)
    .map(([player, d]) => ({ player, owesHost: d.buyInIou, hostOwes: d.cashOutIou, netIou: d.buyInIou - d.cashOutIou }))
    .filter(d => d.owesHost > 0 || d.hostOwes > 0);
}

export function getIOUTotals(iouData) {
  const totalOwedToHost = iouData.reduce((sum, d) => sum + Math.max(0, d.netIou), 0);
  const totalHostOwes = iouData.reduce((sum, d) => sum + Math.max(0, -d.netIou), 0);
  return { totalOwedToHost, totalHostOwes };
}

export function getIOULabel(d) {
  if (d.netIou > 0) return d.player + ' owes host ' + formatCurrency(d.netIou);
  if (d.netIou < 0) return 'Host owes ' + d.player + ' ' + formatCurrency(Math.abs(d.netIou));
  return d.player + ' — Settled';
}

export function getMainEvents(events) {
  return events.filter(e => e.type !== 'edit');
}

export function getAutocompleteUsernames(events) {
  const freq = {};
  events.forEach(ev => {
    if (ev.type === 'edit') return;
    freq[ev.username] = (freq[ev.username] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name]) => name);
}

export function getAutocompleteAmounts(events, types) {
  const freq = {};
  events.forEach(ev => {
    if (!types.includes(ev.type)) return;
    freq[ev.amount] = (freq[ev.amount] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([amount]) => parseFloat(amount));
}
