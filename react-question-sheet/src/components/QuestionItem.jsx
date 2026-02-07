import { useState } from 'react';
import { ExternalLink, GripVertical, Youtube, CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import QuestionForm from './QuestionForm';

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
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

  if (showEditForm) {
    return (
      <div className="px-4 py-3 bg-indigo-50 border-b border-gray-100">
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
          className={`flex items-center px-4 py-2.5 border-b border-gray-50 hover:bg-gray-50 transition-colors group ${
            snapshot.isDragging ? 'bg-indigo-50 shadow-lg rounded-lg' : ''
          }`}
        >
          <div
            {...provided.dragHandleProps}
            className="mr-2 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={14} />
          </div>

          <button
            onClick={() => onToggleSolved(question.id)}
            className="mr-3 flex-shrink-0 cursor-pointer"
            title={question.solved ? 'Mark unsolved' : 'Mark solved'}
          >
            {question.solved ? (
              <CheckCircle2 size={18} className="text-green-500" />
            ) : (
              <Circle size={18} className="text-gray-300 hover:text-gray-400" />
            )}
          </button>

          <span className="text-sm text-gray-500 w-8 flex-shrink-0">{index + 1}.</span>

          <span
            className={`flex-1 text-sm ${
              question.solved ? 'line-through text-gray-400' : 'text-gray-700'
            }`}
          >
            {question.title}
          </span>

          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium mr-3 ${
              difficultyColors[question.difficulty] || 'bg-gray-100 text-gray-600'
            }`}
          >
            {question.difficulty}
          </span>

          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {question.problemUrl && (
              <a
                href={question.problemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-blue-600"
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
                className="p-1 text-gray-400 hover:text-red-600"
                title="Video Resource"
              >
                <Youtube size={14} />
              </a>
            )}
            <button
              onClick={() => setShowEditForm(true)}
              className="p-1 text-gray-400 hover:text-indigo-600 cursor-pointer"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(question.id)}
              className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
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
