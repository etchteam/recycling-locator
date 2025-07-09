import { describe, expect, test } from 'vitest';

import getNotes from '@/lib/details/getNotes';
import { Location } from '@/types/locatorApi';

const createMockLocation = (notes: (string | undefined)[]): Location => ({
  id: 'test-location',
  address: 'Test Address',
  distance: 100,
  name: 'Test Location',
  latitude: 51.5074,
  longitude: -0.1278,
  locations: notes.map((note) => ({
    locationType: 'RECYCLE' as const,
    source: 'valpak' as const,
    materials: [],
    notes: note,
  })),
});

describe('getNotes', () => {
  test('Returns empty array when no locations have notes', () => {
    const location = createMockLocation([undefined, undefined]);
    expect(getNotes(location)).toEqual([]);
  });

  test('Filters out undefined and empty notes', () => {
    const location = createMockLocation([undefined, '', '   ', 'Valid note']);
    expect(getNotes(location)).toEqual(['Valid note']);
  });

  test('Trims whitespace from regular notes', () => {
    const location = createMockLocation([
      '  Note with leading spaces',
      'Note with trailing spaces  ',
      '  Note with both  ',
    ]);
    expect(getNotes(location)).toEqual([
      'Note with leading spaces',
      'Note with trailing spaces',
      'Note with both',
    ]);
  });

  test('Converts What Three Words patterns to clickable URLs', () => {
    const location = createMockLocation([
      'Visit ///filled.count.soap for parking',
      'Location at ///index.home.raft',
    ]);
    expect(getNotes(location)).toEqual([
      'Visit https://what3words.com/filled.count.soap for parking',
      'Location at https://what3words.com/index.home.raft',
    ]);
  });

  test('Handles multiple What Three Words patterns in a single note', () => {
    const location = createMockLocation([
      'Start at ///filled.count.soap and end at ///index.home.raft',
    ]);
    expect(getNotes(location)).toEqual([
      'Start at https://what3words.com/filled.count.soap and end at https://what3words.com/index.home.raft',
    ]);
  });

  test('Handles What Three Words patterns with different cases', () => {
    const location = createMockLocation([
      'Location ///FILLED.COUNT.SOAP',
      'Another ///Filled.Count.Soap',
      'Mixed ///filled.COUNT.soap',
    ]);
    expect(getNotes(location)).toEqual([
      'Location https://what3words.com/FILLED.COUNT.SOAP',
      'Another https://what3words.com/Filled.Count.Soap',
      'Mixed https://what3words.com/filled.COUNT.soap',
    ]);
  });

  test('Trims What Three Words notes after conversion', () => {
    const location = createMockLocation([
      '  ///filled.count.soap  ',
      '  Location at ///index.home.raft  ',
    ]);
    expect(getNotes(location)).toEqual([
      'https://what3words.com/filled.count.soap',
      'Location at https://what3words.com/index.home.raft',
    ]);
  });

  test('Does not modify notes without What Three Words patterns', () => {
    const location = createMockLocation([
      'Regular note without patterns',
      'Note with //two.slashes.only',
      'Note with ///too.many.words.here',
      'Note with ///numbers123.in.words',
    ]);
    expect(getNotes(location)).toEqual([
      'Regular note without patterns',
      'Note with //two.slashes.only',
      'Note with ///too.many.words.here',
      'Note with ///numbers123.in.words',
    ]);
  });

  test('Handles complex scenarios with mixed content', () => {
    const location = createMockLocation([
      undefined,
      '  ',
      'Regular note',
      '  Trimmed note  ',
      'Visit ///filled.count.soap for more info',
      '',
      'Multiple ///one.two.three and ///four.five.six locations',
      undefined,
    ]);
    expect(getNotes(location)).toEqual([
      'Regular note',
      'Trimmed note',
      'Visit https://what3words.com/filled.count.soap for more info',
      'Multiple https://what3words.com/one.two.three and https://what3words.com/four.five.six locations',
    ]);
  });

  test('Handles edge case with just What Three Words pattern', () => {
    const location = createMockLocation(['///filled.count.soap']);
    expect(getNotes(location)).toEqual([
      'https://what3words.com/filled.count.soap',
    ]);
  });

  test('Handles empty locations array', () => {
    const location: Location = {
      id: 'test-location',
      address: 'Test Address',
      distance: 100,
      name: 'Test Location',
      latitude: 51.5074,
      longitude: -0.1278,
      locations: [],
    };
    expect(getNotes(location)).toEqual([]);
  });

  test('Preserves order of notes', () => {
    const location = createMockLocation([
      'First note',
      'Second ///one.two.three note',
      'Third note',
      '///four.five.six',
    ]);
    expect(getNotes(location)).toEqual([
      'First note',
      'Second https://what3words.com/one.two.three note',
      'Third note',
      'https://what3words.com/four.five.six',
    ]);
  });
});
