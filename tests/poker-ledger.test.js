import { describe, it, expect } from 'vitest';
import {
  EVENT_TYPES,
  formatCurrency,
  getPlayerSummary,
  getResults,
  getResultsTotals,
  getIOUData,
  getIOUTotals,
  getIOULabel,
  getMainEvents,
  getAutocompleteUsernames,
  getAutocompleteAmounts
} from '../pages/poker-ledger-logic.js';

const events = [
  { id: 1, username: 'Alice', type: 'buy-in-cash', amount: 100, notes: '', timestamp: 1000 },
  { id: 2, username: 'Alice', type: 'buy-in-iou', amount: 25, notes: '', timestamp: 2000 },
  { id: 3, username: 'Bob', type: 'buy-in-cash', amount: 80, notes: '', timestamp: 3000 },
  { id: 4, username: 'Bob', type: 'buy-in-iou', amount: 15, notes: '', timestamp: 4000 },
  { id: 5, username: 'Alice', type: 'cash-out-cash', amount: 90, notes: '', timestamp: 5000 },
  { id: 6, username: 'Alice', type: 'cash-out-iou', amount: 20, notes: '', timestamp: 6000 },
  { id: 7, username: 'Bob', type: 'cash-out-cash', amount: 60, notes: '', timestamp: 7000 },
  { id: 8, username: 'Bob', type: 'cash-out-iou', amount: 10, notes: '', timestamp: 8000 },
];

describe('Events page', () => {
  it('has 8 main events (no edit events)', () => {
    const main = getMainEvents(events);
    expect(main).toHaveLength(8);
  });

  it('each event has correct type badge text', () => {
    expect(EVENT_TYPES['buy-in-cash']).toBe('Cash in');
    expect(EVENT_TYPES['buy-in-iou']).toBe('IOHost');
    expect(EVENT_TYPES['cash-out-cash']).toBe('Cash out');
    expect(EVENT_TYPES['cash-out-iou']).toBe('IOPlayer');
  });

  it('each event shows correct player and amount', () => {
    const main = getMainEvents(events);
    expect(main[0].username).toBe('Alice');
    expect(formatCurrency(main[0].amount)).toBe('$100');
    expect(main[1].username).toBe('Alice');
    expect(formatCurrency(main[1].amount)).toBe('$25');
    expect(main[2].username).toBe('Bob');
    expect(formatCurrency(main[2].amount)).toBe('$80');
    expect(main[3].username).toBe('Bob');
    expect(formatCurrency(main[3].amount)).toBe('$15');
    expect(main[4].username).toBe('Alice');
    expect(formatCurrency(main[4].amount)).toBe('$90');
    expect(main[5].username).toBe('Alice');
    expect(formatCurrency(main[5].amount)).toBe('$20');
    expect(main[6].username).toBe('Bob');
    expect(formatCurrency(main[6].amount)).toBe('$60');
    expect(main[7].username).toBe('Bob');
    expect(formatCurrency(main[7].amount)).toBe('$10');
  });

  it('summary tiles: 2 players, 8 events', () => {
    const main = getMainEvents(events);
    const uniquePlayers = [...new Set(main.map(e => e.username))];
    expect(uniquePlayers).toHaveLength(2);
    expect(main).toHaveLength(8);
  });
});

describe('Results page', () => {
  const results = getResults(events);
  const totals = getResultsTotals(results);

  it('Total Money In tile: $220 with subtitle', () => {
    expect(formatCurrency(totals.grandTotalBuyIn)).toBe('$220');
    expect(formatCurrency(totals.totalCashIn)).toBe('$180');
    expect(formatCurrency(totals.totalIOHost)).toBe('$40');
  });

  it('Total Money Out tile: $180 with subtitle', () => {
    expect(formatCurrency(totals.grandTotalCashOut)).toBe('$180');
    expect(formatCurrency(totals.totalCashOut)).toBe('$150');
    expect(formatCurrency(totals.totalIOPlayer)).toBe('$30');
  });

  it('Money on Table tile: $40', () => {
    expect(formatCurrency(totals.moneyOnTable)).toBe('$40');
  });

  it('Discrepancy tile: +$40 with subtitle "Host earns $40"', () => {
    expect(totals.discrepancyDisplay).toBe('+$40');
    expect(totals.discrepancySubtitle).toBe('Host earns $40');
    expect(totals.discrepancyClass).toBe('positive');
  });

  it('results sorted by net descending: Alice (-15) then Bob (-25)', () => {
    expect(results[0].player).toBe('Alice');
    expect(results[0].net).toBe(-15);
    expect(results[1].player).toBe('Bob');
    expect(results[1].net).toBe(-25);
  });

  it('Alice row: Buy-In $125 (breakdown $100 cash, $25 IOHost), Cash-Out $110 (breakdown $90 cash, $20 IOPlayer), Net -$15', () => {
    const alice = results.find(r => r.player === 'Alice');
    expect(formatCurrency(alice.totalBuyIn)).toBe('$125');
    expect(formatCurrency(alice.buyInCash)).toBe('$100');
    expect(formatCurrency(alice.buyInIou)).toBe('$25');
    expect(formatCurrency(alice.totalCashOut)).toBe('$110');
    expect(formatCurrency(alice.cashOutCash)).toBe('$90');
    expect(formatCurrency(alice.cashOutIou)).toBe('$20');
    expect(alice.net).toBe(-15);
  });

  it('Bob row: Buy-In $95 (breakdown $80 cash, $15 IOHost), Cash-Out $70 (breakdown $60 cash, $10 IOPlayer), Net -$25', () => {
    const bob = results.find(r => r.player === 'Bob');
    expect(formatCurrency(bob.totalBuyIn)).toBe('$95');
    expect(formatCurrency(bob.buyInCash)).toBe('$80');
    expect(formatCurrency(bob.buyInIou)).toBe('$15');
    expect(formatCurrency(bob.totalCashOut)).toBe('$70');
    expect(formatCurrency(bob.cashOutCash)).toBe('$60');
    expect(formatCurrency(bob.cashOutIou)).toBe('$10');
    expect(bob.net).toBe(-25);
  });
});

describe('IOUs page', () => {
  const iouData = getIOUData(events);
  const { totalOwedToHost, totalHostOwes } = getIOUTotals(iouData);

  it('Owed to Host tile: $10', () => {
    expect(formatCurrency(totalOwedToHost)).toBe('$10');
  });

  it('Host Owes tile: $0', () => {
    expect(formatCurrency(totalHostOwes)).toBe('$0');
  });

  it('Alice owes host $5', () => {
    const alice = iouData.find(d => d.player === 'Alice');
    expect(alice.netIou).toBe(5);
    expect(getIOULabel(alice)).toBe('Alice owes host $5');
  });

  it('Bob owes host $5', () => {
    const bob = iouData.find(d => d.player === 'Bob');
    expect(bob.netIou).toBe(5);
    expect(getIOULabel(bob)).toBe('Bob owes host $5');
  });
});

describe('formatCurrency', () => {
  it('whole numbers have no decimals', () => {
    expect(formatCurrency(50)).toBe('$50');
  });

  it('fractional amounts show 2 decimals', () => {
    expect(formatCurrency(50.5)).toBe('$50.50');
  });
});

describe('Autocomplete', () => {
  it('getAutocompleteUsernames returns players sorted by frequency', () => {
    const result = getAutocompleteUsernames(events);
    expect(result).toContain('Alice');
    expect(result).toContain('Bob');
    expect(result).toHaveLength(2);
  });

  it('getAutocompleteAmounts for buy-in types returns in-direction amounts', () => {
    const result = getAutocompleteAmounts(events, ['buy-in-cash', 'buy-in-iou']);
    expect(result).toContain(100);
    expect(result).toContain(25);
    expect(result).toContain(80);
    expect(result).toContain(15);
    expect(result).not.toContain(90);
    expect(result).not.toContain(60);
  });

  it('getAutocompleteAmounts for cash-out types returns out-direction amounts', () => {
    const result = getAutocompleteAmounts(events, ['cash-out-cash', 'cash-out-iou']);
    expect(result).toContain(90);
    expect(result).toContain(20);
    expect(result).toContain(60);
    expect(result).toContain(10);
    expect(result).not.toContain(100);
    expect(result).not.toContain(25);
  });

  it('excludes edit events from autocomplete', () => {
    const eventsWithEdit = [...events, { id: 99, username: 'Ghost', type: 'edit', amount: 999, timestamp: 9000 }];
    const usernames = getAutocompleteUsernames(eventsWithEdit);
    expect(usernames).not.toContain('Ghost');
  });
});
