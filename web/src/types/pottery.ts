/**
 * Web-layer type definitions for the Pottery COGS Calculator.
 *
 * The core library (src/pottery.ts) defines pure calculation types without
 * UI concerns. These web types extend them with `id` fields needed for
 * React list rendering and localStorage persistence.
 *
 * Mapping between core and web types:
 *   Core StaffLaborInput  =>  Web StaffRole (adds id, name)
 *   Core KilnLaborInput   =>  Web KilnSettings (same fields, renamed for UI clarity)
 *   Core OverheadItem      =>  Re-exported as-is (already has id)
 */
import type { OverheadSettings } from '../../../src/pottery'

/** A pottery piece in the studio's catalog (e.g. "Snowman Globe", $4.50). */
export interface BisquePiece {
  /** Unique identifier for React keys and selection tracking */
  id: string
  /** Display name shown in the catalog and piece selector dropdown */
  name: string
  /** What the studio pays the supplier for this bisque piece */
  wholesaleCost: number
}

/**
 * A staff role in the UI, extending the core StaffLaborInput with an id
 * (for React list keys) and a name (for display and COGS breakdown labels).
 */
export interface StaffRole {
  id: string
  name: string
  hourlyRate: number
  minutesPerCustomer: number
  customersSimultaneous: number
}

/**
 * Kiln configuration for the UI. Same fields as the core KilnLaborInput
 * type — renamed to "Settings" to match the UI's settings-form context.
 */
export interface KilnSettings {
  hourlyRate: number
  minutesPerFiring: number
  kilnWorkerCount: number
  piecesPerFiring: number
}

/** Re-export core types that the web layer uses directly. */
export type { COGSBreakdown, COGSResult, OverheadItem, OverheadSettings } from '../../../src/pottery'

/**
 * Studio-wide settings that affect COGS calculations.
 *
 * Note: Staff roles are stored separately (under the 'pottery-staff-roles'
 * localStorage key) because they are managed independently from these settings.
 */
export interface StudioSettings {
  overhead: OverheadSettings
  piecesPerMonth: number
  glazeCostPerPiece: number
  kiln: KilnSettings
}
