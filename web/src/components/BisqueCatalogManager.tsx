import { BisquePiece } from '../types/pottery'

interface Props {
  pieces: BisquePiece[]
  onChange: (pieces: BisquePiece[]) => void
}

export default function BisqueCatalogManager({ pieces, onChange }: Props) {
  const addPiece = () => {
    onChange([...pieces, { id: crypto.randomUUID(), name: '', wholesaleCost: 0 }])
  }

  const updatePiece = (id: string, field: keyof BisquePiece, value: string | number) => {
    onChange(
      pieces.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  const removePiece = (id: string) => {
    onChange(pieces.filter((p) => p.id !== id))
  }

  return (
    <section className="form-section">
      <h2>Bisque Catalog</h2>
      {pieces.map((piece) => (
        <div key={piece.id} className="piece-row">
          <label>
            Piece Name
            <input
              type="text"
              value={piece.name}
              onChange={(e) => updatePiece(piece.id, 'name', e.target.value)}
            />
          </label>
          <label>
            Wholesale Cost
            <input
              type="number"
              step="0.01"
              min="0"
              value={piece.wholesaleCost || ''}
              onChange={(e) => updatePiece(piece.id, 'wholesaleCost', parseFloat(e.target.value) || 0)}
            />
          </label>
          {pieces.length > 1 && (
            <button type="button" onClick={() => removePiece(piece.id)}>×</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addPiece}>Add Piece</button>
    </section>
  )
}
