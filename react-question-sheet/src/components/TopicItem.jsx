import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, GripVertical, FolderOpen, Hash } from 'lucide-react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import useSheetStore from '../store/useSheetStore';
import InlineEdit from './InlineEdit';
import QuestionItem from './QuestionItem';
import QuestionForm from './QuestionForm';

const topicAccentColors = [
  'from-indigo-500 to-indigo-600',
  'from-purple-500 to-purple-600',
  'from-blue-500 to-blue-600',
  'from-teal-500 to-teal-600',
  'from-emerald-500 to-emerald-600',
  'from-cyan-500 to-cyan-600',
  'from-violet-500 to-violet-600',
  'from-fuchsia-500 to-fuchsia-600',
  'from-rose-500 to-rose-600',
  'from-amber-500 to-amber-600',
];

export default function TopicItem({ topic, index, searchQuery }) {
  const [expanded, setExpanded] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showAddSubTopic, setShowAddSubTopic] = useState(false);
  const [newSubTopicName, setNewSubTopicName] = useState('');
  const [expandedSubTopics, setExpandedSubTopics] = useState({});

  const {
    editTopic,
    deleteTopic,
    addSubTopic,
    editSubTopic,
    deleteSubTopic,
    addQuestion,
    editQuestion,
    deleteQuestion,
    addSubTopicQuestion,
    editSubTopicQuestion,
    deleteSubTopicQuestion,
    toggleQuestionSolved,
    toggleSubTopicQuestionSolved,
    getTopicStats,
  } = useSheetStore();

  const stats = getTopicStats(topic.id);
  const accentColor = topicAccentColors[index % topicAccentColors.length];
  const progressPercent = stats.total ? Math.round((stats.solved / stats.total) * 100) : 0;

  // Filter questions based on search
  const filteredQuestions = searchQuery
    ? topic.questions.filter((q) =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : topic.questions;

  const filteredSubTopics = searchQuery
    ? topic.subTopics
        .map((st) => ({
          ...st,
          questions: st.questions.filter((q) =>
            q.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((st) => st.questions.length > 0 || st.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : topic.subTopics;

  const hasResults = filteredQuestions.length > 0 || filteredSubTopics.length > 0;
  const matchesTopic = topic.name.toLowerCase().includes((searchQuery || '').toLowerCase());

  if (searchQuery && !hasResults && !matchesTopic) return null;

  const isExpanded = expanded || (searchQuery && hasResults);

  const handleAddSubTopic = (e) => {
    e.preventDefault();
    if (newSubTopicName.trim()) {
      addSubTopic(topic.id, newSubTopicName.trim());
      setNewSubTopicName('');
      setShowAddSubTopic(false);
    }
  };

  const toggleSubTopic = (stId) => {
    setExpandedSubTopics((prev) => ({ ...prev, [stId]: !prev[stId] }));
  };

  return (
    <Draggable draggableId={`topic-${topic.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 mb-3 ${
            snapshot.isDragging
              ? 'shadow-2xl ring-2 ring-indigo-400 border-indigo-200 scale-[1.01]'
              : 'shadow-sm hover:shadow-lg border-gray-200/70 hover:border-gray-300/80'
          }`}
        >
          {/* Topic Header */}
          <div
            className="flex items-center px-5 py-4 cursor-pointer select-none group/header"
            onClick={() => setExpanded(!isExpanded)}
          >
            {/* Drag handle */}
            <div
              {...provided.dragHandleProps}
              className="mr-3 text-gray-200 hover:text-gray-400 cursor-grab active:cursor-grabbing transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={18} />
            </div>

            {/* Topic number badge */}
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${accentColor} flex items-center justify-center text-white text-xs font-bold mr-3 shrink-0 shadow-sm`}>
              {index + 1}
            </div>

            {/* Chevron */}
            <div className="mr-2 shrink-0">
              {isExpanded ? (
                <ChevronDown size={18} className="text-indigo-500 transition-transform" />
              ) : (
                <ChevronRight size={18} className="text-gray-400 group-hover/header:text-gray-600 transition-colors" />
              )}
            </div>

            {/* Topic name */}
            <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
              <InlineEdit
                value={topic.name}
                onSave={(newName) => editTopic(topic.id, newName)}
                onDelete={() => deleteTopic(topic.id)}
                className="font-semibold text-gray-800"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 ml-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                  progressPercent === 100
                    ? 'bg-emerald-100 text-emerald-700'
                    : progressPercent > 0
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {stats.solved}/{stats.total}
                </span>
              </div>
              <div className="w-20 bg-gray-100 rounded-full h-1.5 hidden sm:block overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    progressPercent === 100
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="border-t border-gray-100">
              {/* Action buttons */}
              <div className="px-4 py-2.5 bg-gradient-to-r from-gray-50 to-slate-50 flex gap-3 flex-wrap border-b border-gray-100">
                <button
                  onClick={() => { setShowAddQuestion(!showAddQuestion); setShowAddSubTopic(false); }}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    showAddQuestion
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <Plus size={14} /> Add Question
                </button>
                <button
                  onClick={() => { setShowAddSubTopic(!showAddSubTopic); setShowAddQuestion(false); }}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    showAddSubTopic
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <FolderOpen size={14} /> Add Sub-topic
                </button>
              </div>

              {/* Add Sub-topic form */}
              {showAddSubTopic && (
                <div className="px-4 py-3.5 bg-purple-50/50 border-b border-purple-100">
                  <form onSubmit={handleAddSubTopic} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Sub-topic name..."
                      value={newSubTopicName}
                      onChange={(e) => setNewSubTopicName(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddSubTopic(false)}
                      className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              {/* Add Question form */}
              {showAddQuestion && (
                <div className="px-4 py-3.5 bg-indigo-50/50 border-b border-indigo-100">
                  <QuestionForm
                    onSubmit={(q) => {
                      addQuestion(topic.id, q);
                      setShowAddQuestion(false);
                    }}
                    onCancel={() => setShowAddQuestion(false)}
                  />
                </div>
              )}

              {/* Sub-topics */}
              {filteredSubTopics.map((subTopic) => (
                <div key={subTopic.id} className="border-b border-gray-100 last:border-b-0">
                  <div
                    className="flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-50/50 to-transparent cursor-pointer hover:from-purple-50 transition-colors"
                    onClick={() => toggleSubTopic(subTopic.id)}
                  >
                    {expandedSubTopics[subTopic.id] ? (
                      <ChevronDown size={14} className="text-purple-500 mr-2 shrink-0" />
                    ) : (
                      <ChevronRight size={14} className="text-gray-400 mr-2 shrink-0" />
                    )}
                    <FolderOpen size={14} className="text-purple-500 mr-2 shrink-0" />
                    <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                      <InlineEdit
                        value={subTopic.name}
                        onSave={(newName) => editSubTopic(topic.id, subTopic.id, newName)}
                        onDelete={() => deleteSubTopic(topic.id, subTopic.id)}
                        className="text-sm font-medium text-gray-700"
                      />
                    </div>
                    <span className="text-xs text-purple-400 font-medium bg-purple-50 px-2 py-0.5 rounded-lg">
                      {subTopic.questions.length} questions
                    </span>
                  </div>

                  {expandedSubTopics[subTopic.id] && (
                    <Droppable droppableId={`subtopic-questions-${topic.id}-${subTopic.id}`} type="SUBTOPIC_QUESTION">
                      {(droppableProvided) => (
                        <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps} className="bg-white">
                          {subTopic.questions.map((q, qIndex) => (
                            <QuestionItem
                              key={q.id}
                              question={q}
                              index={qIndex}
                              topicId={topic.id}
                              subTopicId={subTopic.id}
                              draggableId={`stq-${topic.id}-${subTopic.id}-${q.id}`}
                              onToggleSolved={(qId) =>
                                toggleSubTopicQuestionSolved(topic.id, subTopic.id, qId)
                              }
                              onEdit={(qId, updated) =>
                                editSubTopicQuestion(topic.id, subTopic.id, qId, updated)
                              }
                              onDelete={(qId) =>
                                deleteSubTopicQuestion(topic.id, subTopic.id, qId)
                              }
                            />
                          ))}
                          {droppableProvided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </div>
              ))}

              {/* Questions under topic (no sub-topic) */}
              <Droppable droppableId={`topic-questions-${topic.id}`} type="QUESTION">
                {(droppableProvided) => (
                  <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                    {filteredQuestions.map((q, qIndex) => (
                      <QuestionItem
                        key={q.id}
                        question={q}
                        index={qIndex}
                        topicId={topic.id}
                        draggableId={`q-${topic.id}-${q.id}`}
                        onToggleSolved={(qId) => toggleQuestionSolved(topic.id, qId)}
                        onEdit={(qId, updated) => editQuestion(topic.id, qId, updated)}
                        onDelete={(qId) => deleteQuestion(topic.id, qId)}
                      />
                    ))}
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>

              {filteredQuestions.length === 0 && filteredSubTopics.length === 0 && !showAddQuestion && (
                <div className="px-4 py-10 text-center">
                  <Hash size={24} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">No questions yet. Click &ldquo;Add Question&rdquo; to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
