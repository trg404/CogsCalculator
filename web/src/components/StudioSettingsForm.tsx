import { StudioSettings, OverheadItem } from '../types/pottery'
import OverheadCategorySection from './OverheadCategorySection'

interface Props {
  settings: StudioSettings
  onChange: (settings: StudioSettings) => void
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function StudioSettingsForm({ settings, onChange }: Props) {
  const updateField = <K extends keyof StudioSettings>(field: K, value: StudioSettings[K]) => {
    onChange({ ...settings, [field]: value })
  }

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

  const fixedTotal = settings.overhead.fixedCosts.reduce((sum, item) => sum + Math.max(0, item.amount), 0)
  const variableTotal = settings.overhead.variableCosts.reduce((sum, item) => sum + Math.max(0, item.amount), 0)
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
