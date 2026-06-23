import { describe, expect, it } from 'vitest';
import { issueInputSchema, profileSchema, rewardSchema, statusSchema } from './schemas.js';

describe('issue input contract', () => {
  const valid = {
    title: 'Broken storm drain cover',
    description: 'The metal cover is missing beside the crossing.',
    latitude: 12.9784,
    longitude: 77.6408,
    address: '12th Main Road, Indiranagar',
    wardId: '80',
    clientRequestId: '3a709033-23cc-4b37-8493-d9b6c1cf1942'
  };

  it('accepts a bounded geolocated report', () => {
    expect(issueInputSchema.parse(valid).wardId).toBe('80');
  });

  it('rejects impossible coordinates', () => {
    expect(() => issueInputSchema.parse({ ...valid, latitude: 121 })).toThrow();
  });

  it('rejects non-idempotent client identifiers', () => {
    expect(() => issueInputSchema.parse({ ...valid, clientRequestId: 'retry-me' })).toThrow();
  });
});

describe('authority status contract', () => {
  it('allows only lifecycle states', () => {
    expect(() => statusSchema.parse({ status: 'Deleted', note: 'hide it' })).toThrow();
    expect(statusSchema.parse({ status: 'In progress', note: 'Crew dispatched' }).status).toBe('In progress');
  });
});

describe('profile and rewards contracts', () => {
  it('accepts bounded citizen preferences', () => {
    expect(profileSchema.parse({ displayName: 'Srijan Jaiswal', language: 'Kannada' }).language).toBe('Kannada');
  });

  it('rejects arbitrary reward identifiers', () => {
    expect(() => rewardSchema.parse({ rewardId: 'cash-transfer' })).toThrow();
  });
});
