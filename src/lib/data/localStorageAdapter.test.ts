import { getInitialCareData } from './types';
import { isCareDataShape } from './localStorageAdapter';

describe('isCareDataShape', () => {
  it('accepts the current care data structure', () => {
    expect(isCareDataShape(getInitialCareData())).toBe(true);
  });

  it('rejects incomplete or invalid care data', () => {
    expect(isCareDataShape(null)).toBe(false);
    expect(isCareDataShape({ medications: [] })).toBe(false);
    expect(isCareDataShape({ ...getInitialCareData(), tasks: null })).toBe(false);
  });
});
