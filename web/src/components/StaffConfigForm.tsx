import { StaffRole } from '../types/pottery'

interface Props {
  roles: StaffRole[]
  onChange: (roles: StaffRole[]) => void
}

export default function StaffConfigForm({ roles, onChange }: Props) {
  const addRole = () => {
    onChange([
      ...roles,
      {
        id: crypto.randomUUID(),
        name: '',
        hourlyRate: 15,
        minutesPerCustomer: 15,
        customersSimultaneous: 1,
      },
    ])
  }

  const updateRole = (id: string, field: keyof StaffRole, value: string | number) => {
    onChange(roles.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const removeRole = (id: string) => {
    onChange(roles.filter((r) => r.id !== id))
  }

  return (
    <section className="form-section">
      <h2>Staff Roles</h2>
      {roles.map((role) => (
        <div key={role.id} className="role-row">
          <label>
            Role Name
            <input
              type="text"
              value={role.name}
              onChange={(e) => updateRole(role.id, 'name', e.target.value)}
            />
          </label>
          <label>
            Hourly Rate ($)
            <input
              type="number"
              step="0.01"
              min="0"
              value={role.hourlyRate || ''}
              onChange={(e) => updateRole(role.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            Minutes per Customer
            <input
              type="number"
              min="0"
              value={role.minutesPerCustomer || ''}
              onChange={(e) => updateRole(role.id, 'minutesPerCustomer', parseInt(e.target.value) || 0)}
            />
          </label>
          <label>
            Customers at Once
            <input
              type="number"
              min="1"
              value={role.customersSimultaneous || ''}
              onChange={(e) => updateRole(role.id, 'customersSimultaneous', parseInt(e.target.value) || 1)}
            />
          </label>
          {roles.length > 1 && (
            <button type="button" onClick={() => removeRole(role.id)}>×</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addRole}>Add Role</button>
    </section>
  )
}
