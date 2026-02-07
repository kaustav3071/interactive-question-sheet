import { useState, useRef, useEffect } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';

export default function InlineEdit({ value, onSave, onDelete, className = '', renderActions }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    if (editValue.trim() && editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(value);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 flex-1">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 px-2 py-1 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={handleSave} className="p-1 text-green-600 hover:text-green-700 cursor-pointer">
          <Check size={14} />
        </button>
        <button
          onClick={() => {
            setEditValue(value);
            setEditing(false);
          }}
          className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <span className="flex-1 truncate">{value}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {renderActions && renderActions()}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
          className="p-1 text-gray-400 hover:text-indigo-600 cursor-pointer"
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
