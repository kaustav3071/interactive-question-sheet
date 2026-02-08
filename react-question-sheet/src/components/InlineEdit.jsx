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
      <div className="flex items-center gap-1.5 flex-1">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 px-2.5 py-1 text-sm border border-indigo-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
        />
        <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md cursor-pointer">
          <Check size={14} />
        </button>
        <button
          onClick={() => { setEditValue(value); setEditing(false); }}
          className="p-1 text-slate-400 hover:bg-slate-100 rounded-md cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 group/inline ${className}`}>
      <span className="flex-1 truncate">{value}</span>
      <div className="flex items-center gap-0.5 opacity-0 group-hover/inline:opacity-100 transition-opacity">
        {renderActions && renderActions()}
        <button
          onClick={(e) => { e.stopPropagation(); setEditing(true); }}
          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md cursor-pointer"
          title="Edit"
        >
          <Pencil size={12} />
        </button>
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
