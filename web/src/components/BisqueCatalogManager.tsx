/**
 * BisqueCatalogManager — lets the studio owner manage their catalog of
 * pottery pieces (bisque). Each piece has a name and wholesale cost.
 *
 * The catalog is a simple CRUD list:
 *   - Add a new blank piece
 *   - Edit any piece's name or cost inline
 *   - Remove a piece (only when more than one exists, so the list is never empty)
 *
 * All changes are lifted to the parent via the `onChange` callback.
 */
import { BisquePiece } from '../types/pottery'

interface Props {
  /** The current list of bisque pieces in the catalog */
  pieces: BisquePiece[]
  /** Called with the updated full array whenever any piece is added, edited, or removed */
  onChange: (pieces: BisquePiece[]) => void
}

export default function BisqueCatalogManager({ pieces, onChange }: Props) {
  /** Append a new blank piece with a unique id */
  const addPiece = () => {
    onChange([...pieces, { id: crypto.randomUUID(), name: '', wholesaleCost: 0 }])
  }

  /** Update a single field on one piece, identified by id */
  const updatePiece = (id: string, field: keyof BisquePiece, value: string | number) => {
    onChange(
      pieces.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  /** Remove a piece from the catalog by id */
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
          {/* Hide delete button when only 1 piece remains to prevent an empty catalog */}
          {pieces.length > 1 && (
            <button type="button" onClick={() => removePiece(piece.id)}>×</button>
          )}
        </div>
      ))}
      <button type="button" onClick={addPiece}>Add Piece</button>
    </section>
  )
}
