interface Employee {
  id: string
  hourlyRate: number
  hoursWorked: number
  role: string
  shift: string
}

interface LaborFormProps {
  employees: Employee[]
  onChange: (employees: Employee[]) => void
}

export default function LaborForm({ employees, onChange }: LaborFormProps) {
  const updateEmployee = (id: string, field: keyof Employee, value: string | number) => {
    const updated = employees.map((emp) =>
      emp.id === id ? { ...emp, [field]: value } : emp
    )
    onChange(updated)
  }

  const addEmployee = () => {
    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      hourlyRate: 0,
      hoursWorked: 0,
      role: '',
      shift: '',
    }
    onChange([...employees, newEmployee])
  }

  const removeEmployee = (id: string) => {
    onChange(employees.filter((emp) => emp.id !== id))
  }

  return (
    <div className="form-section">
      <h2>Labor</h2>

      {employees.map((employee, index) => (
        <div key={employee.id} className="form-card">
          <div className="form-card-header">
            <span>Employee {index + 1}</span>
            {employees.length > 1 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeEmployee(employee.id)}
              >
                ×
              </button>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`hourlyRate-${employee.id}`}>Hourly Rate</label>
              <input
                type="number"
                id={`hourlyRate-${employee.id}`}
                value={employee.hourlyRate || ''}
                onChange={(e) =>
                  updateEmployee(employee.id, 'hourlyRate', parseFloat(e.target.value) || 0)
                }
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`hoursWorked-${employee.id}`}>Hours Worked</label>
              <input
                type="number"
                id={`hoursWorked-${employee.id}`}
                value={employee.hoursWorked || ''}
                onChange={(e) =>
                  updateEmployee(employee.id, 'hoursWorked', parseFloat(e.target.value) || 0)
                }
                min="0"
                step="0.5"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`role-${employee.id}`}>Role</label>
              <input
                type="text"
                id={`role-${employee.id}`}
                value={employee.role}
                onChange={(e) => updateEmployee(employee.id, 'role', e.target.value)}
                placeholder="e.g., baker, cashier"
              />
            </div>

            <div className="form-group">
              <label htmlFor={`shift-${employee.id}`}>Shift</label>
              <input
                type="text"
                id={`shift-${employee.id}`}
                value={employee.shift}
                onChange={(e) => updateEmployee(employee.id, 'shift', e.target.value)}
                placeholder="e.g., morning, evening"
              />
            </div>
          </div>
        </div>
      ))}

      <button type="button" className="add-btn" onClick={addEmployee}>
        + Add Employee
      </button>
    </div>
  )
}
