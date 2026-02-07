import { useState } from 'react';
import { ExternalLink, GripVertical, Youtube, CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import QuestionForm from './QuestionForm';

const difficultyConfig = {
  Easy: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  Medium: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  Hard: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
};

export default function QuestionItem({
  question,
  index,
  topicId,
  subTopicId,
  onToggleSolved,
  onEdit,
  onDelete,
  draggableId,
}) {
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEdit = (updated) => {
    onEdit(question.id, updated);
    setShowEditForm(false);
  };

  const diff = difficultyConfig[question.difficulty] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };

  if (showEditForm) {
    return (
      <div className="px-4 py-4 bg-indigo-50/50 border-b border-indigo-100">
        <QuestionForm
          initialData={question}
          onSubmit={handleEdit}
          onCancel={() => setShowEditForm(false)}
          submitLabel="Save"
        />
      </div>
    );
  }

  return (
    <Draggable draggableId={draggableId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex items-center px-4 py-3 border-b border-gray-100/80 transition-all group ${
            snapshot.isDragging
              ? 'bg-indigo-50 shadow-lg rounded-xl ring-1 ring-indigo-200'
              : index % 2 === 0
              ? 'bg-white hover:bg-slate-50/70'
              : 'bg-gray-50/30 hover:bg-slate-50/70'
          }`}
        >
          {/* Drag handle */}
          <div
            {...provided.dragHandleProps}
            className="mr-2.5 text-gray-200 hover:text-gray-400 cursor-grab active:cursor-grabbing transition-colors"
          >
            <GripVertical size={14} />
          </div>

          {/* Solved toggle */}
          <button
            onClick={() => onToggleSolved(question.id)}
            className="mr-3 shrink-0 cursor-pointer transition-transform hover:scale-110 active:scale-95"
            title={question.solved ? 'Mark unsolved' : 'Mark solved'}
          >
            {question.solved ? (
              <CheckCircle2 size={20} className="text-emerald-500 drop-shadow-sm" />
            ) : (
              <Circle size={20} className="text-gray-300 hover:text-gray-400" />
            )}
          </button>

          {/* Question number */}
          <span className="text-xs text-gray-400 font-mono w-7 shrink-0">{index + 1}.</span>

          {/* Title */}
          <span
            className={`flex-1 text-sm leading-snug ${
              question.solved
                ? 'line-through text-gray-400 decoration-gray-300'
                : 'text-gray-700 font-medium'
            }`}
          >
            {question.title}
          </span>

          {/* Difficulty badge */}
          <span
            className={`px-2.5 py-0.5 rounded-md text-xs font-semibold mr-3 border ${diff.bg} ${diff.text} ${diff.border}`}
          >
            {question.difficulty}
          </span>

          {/* Actions (always visible on mobile, hover on desktop) */}
          <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            {question.problemUrl && (
              <a
                href={question.problemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Open Problem"
              >
                <ExternalLink size={14} />
              </a>
            )}
            {question.resource && (
              <a
                href={question.resource}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Video Resource"
              >
                <Youtube size={14} />
              </a>
            )}
            <button
              onClick={() => setShowEditForm(true)}
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(question.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
