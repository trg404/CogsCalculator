/**
 * StaffConfigForm — lets the studio owner define employee roles and their
 * labor cost parameters. Each role has:
 *   - A name (e.g. "Glazing Guide", "Manager")
 *   - An hourly rate
 *   - Minutes spent per customer
 *   - How many customers they help simultaneously
 *
 * These values feed into calculateStaffLaborCost() in the core library
 * to determine per-piece labor costs.
 */
import { StaffRole } from '../types/pottery'

interface Props {
  /** The current list of staff roles */
  roles: StaffRole[]
  /** Called with the updated full array whenever a role is added, edited, or removed */
  onChange: (roles: StaffRole[]) => void
}

export default function StaffConfigForm({ roles, onChange }: Props) {
  /** Add a new role with sensible defaults: $15/hr is a common starting
   *  wage for pottery studio staff, 15 min per customer at 1:1 attention */
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

  /** Update a single field on one role, identified by id */
  const updateRole = (id: string, field: keyof StaffRole, value: string | number) => {
    onChange(roles.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  /** Remove a role by id */
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
          {/* Hide delete button when only 1 role remains */}
          {roles.length > 1 && (
            <button type="button" onClick={() => removeRole(role.id)}>×</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addRole}>Add Role</button>
    </section>
  )
}
