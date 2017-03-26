// Type definitions for Javascript_Changepoints_Analyzer
// Project: Javascript_Changepoints_Analyzer
// Definitions by: Calvin Urankar

declare function analyze(dt: analyze.Datapoint[], settings: analyze.Settings): number[];
export = analyze;
export as namespace changepointsAnalyzer;
declare namespace analyze {
  export interface Datapoint {
    x: number;
    y: number;
  }

  export interface Settings {
    maxCount: number;
    useSquared: boolean;
  }
}
