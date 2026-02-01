import { StudioSettings } from '../types/pottery'

interface Props {
  settings: StudioSettings
  onChange: (settings: StudioSettings) => void
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

  return (
    <section className="form-section">
      <h2>Studio Settings</h2>

      <div className="settings-group">
        <h3>Overhead & Volume</h3>
        <label>
          Monthly Overhead ($)
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.monthlyOverhead || ''}
            onChange={(e) => updateField('monthlyOverhead', parseFloat(e.target.value) || 0)}
          />
        </label>
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
