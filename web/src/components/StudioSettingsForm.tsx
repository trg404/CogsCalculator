/**
 * StudioSettingsForm — the main settings panel where the owner configures
 * everything that affects COGS except staff roles and the bisque catalog
 * (those have their own components).
 *
 * Sections:
 *   1. Overhead Costs — fixed and variable cost categories with line items
 *   2. Production Volume — pieces per month and glaze cost per piece
 *   3. Kiln Settings — worker rate, firing time, crew size, and batch capacity
 */
import { sumOverheadItems } from '../../../src/pottery'
import { StudioSettings, OverheadItem } from '../types/pottery'
import { formatCurrency } from '../utils/formatCurrency'
import OverheadCategorySection from './OverheadCategorySection'

interface Props {
  /** The current studio settings object */
  settings: StudioSettings
  /** Called with the full updated settings object on any change */
  onChange: (settings: StudioSettings) => void
}

export default function StudioSettingsForm({ settings, onChange }: Props) {
  /** Generic updater for top-level settings fields (piecesPerMonth, glazeCostPerPiece, etc.) */
  const updateField = <K extends keyof StudioSettings>(field: K, value: StudioSettings[K]) => {
    onChange({ ...settings, [field]: value })
  }

  /** Updater for nested kiln settings fields */
  const updateKiln = <K extends keyof StudioSettings['kiln']>(
    field: K,
    value: StudioSettings['kiln'][K]
  ) => {
    onChange({ ...settings, kiln: { ...settings.kiln, [field]: value } })
  }

  const updateFixedCosts = (fixedCosts: OverheadItem[]) => {
    onChange({ ...settings, overhead: { ...settings.overhead, fixedCosts } })
  }

  const updateVariableCosts = (variableCosts: OverheadItem[]) => {
    onChange({ ...settings, overhead: { ...settings.overhead, variableCosts } })
  }

  const fixedTotal = sumOverheadItems(settings.overhead.fixedCosts)
  const variableTotal = sumOverheadItems(settings.overhead.variableCosts)
  const monthlyTotal = fixedTotal + variableTotal

  return (
    <section className="form-section">
      <h2>Studio Settings</h2>

      <div className="settings-group">
        <h3>Overhead Costs</h3>

        <OverheadCategorySection
          title="Fixed Costs"
          items={settings.overhead.fixedCosts}
          onChange={updateFixedCosts}
        />

        <OverheadCategorySection
          title="Variable Costs"
          items={settings.overhead.variableCosts}
          onChange={updateVariableCosts}
        />

        <div className="overhead-total">
          <strong>Monthly Overhead Total:</strong> <span>{formatCurrency(monthlyTotal)}</span>
        </div>
      </div>

      <div className="settings-group">
        <h3>Production Volume</h3>
        <label>
          Pieces per Month
          <input
            type="number"
            min="0"
            value={settings.piecesPerMonth || ''}
            onChange={(e) => updateField('piecesPerMonth', parseInt(e.target.value) || 0)}
          />
        </label>
        <label>
          Glaze Cost per Piece ($)
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.glazeCostPerPiece || ''}
            onChange={(e) => updateField('glazeCostPerPiece', parseFloat(e.target.value) || 0)}
          />
        </label>
      </div>

      <div className="settings-group">
        <h3>Kiln Settings</h3>
        <label>
          Kiln Worker Rate ($/hr)
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.kiln.hourlyRate || ''}
            onChange={(e) => updateKiln('hourlyRate', parseFloat(e.target.value) || 0)}
          />
        </label>
        <label>
          Minutes per Firing
          <input
            type="number"
            min="0"
            value={settings.kiln.minutesPerFiring || ''}
            onChange={(e) => updateKiln('minutesPerFiring', parseInt(e.target.value) || 0)}
          />
        </label>
        <label>
          Kiln Workers
          <input
            type="number"
            min="1"
            value={settings.kiln.kilnWorkerCount || ''}
            onChange={(e) => updateKiln('kilnWorkerCount', parseInt(e.target.value) || 0)}
          />
        </label>
        <label>
          Pieces per Firing
          <input
            type="number"
            min="1"
            value={settings.kiln.piecesPerFiring || ''}
            onChange={(e) => updateKiln('piecesPerFiring', parseInt(e.target.value) || 0)}
          />
        </label>
      </div>
    </section>
  )
}
