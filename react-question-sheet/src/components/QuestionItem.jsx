import { useState } from 'react';
import { ExternalLink, GripVertical, Youtube, CheckCircle2, Circle, Pencil, Trash2, StickyNote, ChevronDown } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import useSheetStore from '../store/useSheetStore';
import QuestionForm from './QuestionForm';

const difficultyConfig = {
  Easy: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Medium: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  Hard: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
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
  const [showNotes, setShowNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(question.notes || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { updateQuestionNotes, updateSubTopicQuestionNotes } = useSheetStore();

  const handleEdit = (updated) => {
    onEdit(question.id, updated);
    setShowEditForm(false);
  };

  const handleSaveNotes = () => {
    if (subTopicId) {
      updateSubTopicQuestionNotes(topicId, subTopicId, question.id, notesValue);
    } else {
      updateQuestionNotes(topicId, question.id, notesValue);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(question.id);
    setShowDeleteConfirm(false);
  };

  const diff = difficultyConfig[question.difficulty] || { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' };

  if (showEditForm) {
    return (
      <div className="px-4 py-3 bg-indigo-50/30 border-b border-slate-100">
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
          className={`border-b border-slate-100 group ${
            snapshot.isDragging
              ? 'bg-indigo-50 shadow-md rounded-lg ring-1 ring-indigo-200'
              : 'bg-white hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center px-4 py-2.5">
            {/* Drag handle */}
            <div
              {...provided.dragHandleProps}
              className="mr-2 text-slate-200 hover:text-slate-400 cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={14} />
            </div>

            {/* Solved toggle */}
            <button
              onClick={() => onToggleSolved(question.id)}
              className="mr-3 shrink-0 cursor-pointer hover:scale-110 active:scale-95"
              title={question.solved ? 'Mark unsolved' : 'Mark solved'}
            >
              {question.solved ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <Circle size={18} className="text-slate-300 hover:text-slate-400" />
              )}
            </button>

            {/* Question number */}
            <span className="text-xs text-slate-400 font-mono w-6 shrink-0">{index + 1}.</span>

            {/* Title */}
            <span
              className={`flex-1 text-sm ${
                question.solved
                  ? 'line-through text-slate-400'
                  : 'text-slate-700'
              }`}
            >
              {question.title}
            </span>

            {/* Right side: badge + actions */}
            <div className="flex items-center shrink-0 ml-auto pl-3">
              {/* Difficulty badge */}
              <span className={`inline-flex items-center justify-center gap-1.5 w-20 px-2 py-0.5 rounded text-xs font-medium ${diff.bg} ${diff.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`}></span>
                {question.difficulty}
              </span>

              {/* Actions */}
              <div className="flex items-center justify-end w-28 gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {question.problemUrl && (
                  <a
                    href={question.problemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    title="Open Problem"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
                {question.resource && (
                  <a
                    href={question.resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                    title="Video Resource"
                  >
                    <Youtube size={13} />
                  </a>
                )}
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className={`p-1.5 rounded-md cursor-pointer ${
                    question.notes ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                  }`}
                  title="Notes"
                >
                  <StickyNote size={12} />
                </button>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md cursor-pointer"
                  title="Edit"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Notes section */}
          {showNotes && (
            <div className="px-4 pb-3 pt-1 ml-12">
              <textarea
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                onBlur={handleSaveNotes}
                placeholder="Add personal notes, approach, time complexity..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-amber-50/30 placeholder-slate-400 resize-none"
                rows={2}
              />
            </div>
          )}

          {/* Delete confirmation */}
          {showDeleteConfirm && (
            <div className="px-4 py-2.5 bg-red-50 border-t border-red-100 flex items-center justify-between">
              <span className="text-sm text-red-700">Delete this question?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
