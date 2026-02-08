import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, GripVertical, FolderOpen, Hash } from 'lucide-react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import useSheetStore from '../store/useSheetStore';
import InlineEdit from './InlineEdit';
import QuestionItem from './QuestionItem';
import QuestionForm from './QuestionForm';

const topicColors = [
  { bg: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-600' },
  { bg: 'bg-violet-600', light: 'bg-violet-50', text: 'text-violet-600' },
  { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-600' },
  { bg: 'bg-teal-600', light: 'bg-teal-50', text: 'text-teal-600' },
  { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600' },
  { bg: 'bg-cyan-600', light: 'bg-cyan-50', text: 'text-cyan-600' },
  { bg: 'bg-purple-600', light: 'bg-purple-50', text: 'text-purple-600' },
  { bg: 'bg-fuchsia-600', light: 'bg-fuchsia-50', text: 'text-fuchsia-600' },
  { bg: 'bg-rose-600', light: 'bg-rose-50', text: 'text-rose-600' },
  { bg: 'bg-amber-600', light: 'bg-amber-50', text: 'text-amber-600' },
];

export default function TopicItem({ topic, index, searchQuery, difficultyFilter, forceExpanded }) {
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
  const color = topicColors[index % topicColors.length];
  const progressPercent = stats.total ? Math.round((stats.solved / stats.total) * 100) : 0;

  // Filter questions based on search and difficulty
  const filteredQuestions = topic.questions.filter((q) => {
    const matchesSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = !difficultyFilter || difficultyFilter === 'All' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  const filteredSubTopics = topic.subTopics
    .map((st) => ({
      ...st,
      questions: st.questions.filter((q) => {
        const matchesSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDiff = !difficultyFilter || difficultyFilter === 'All' || q.difficulty === difficultyFilter;
        return matchesSearch && matchesDiff;
      }),
    }))
    .filter((st) => {
      if (searchQuery) {
        return st.questions.length > 0 || st.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (difficultyFilter && difficultyFilter !== 'All') {
        return st.questions.length > 0;
      }
      return true;
    });

  const hasResults = filteredQuestions.length > 0 || filteredSubTopics.length > 0;
  const matchesTopic = topic.name.toLowerCase().includes((searchQuery || '').toLowerCase());

  if (searchQuery && !hasResults && !matchesTopic) return null;

  const isExpanded = expanded || forceExpanded || (searchQuery && hasResults);

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
          className={`bg-white rounded-lg border overflow-hidden transition-all duration-150 ${
            snapshot.isDragging
              ? 'shadow-xl ring-2 ring-indigo-500 border-indigo-200'
              : 'shadow-sm border-slate-200 hover:shadow-md'
          }`}
        >
          {/* Topic Header */}
          <div
            className="flex items-center px-4 py-3 cursor-pointer select-none group"
            onClick={() => setExpanded(!isExpanded)}
          >
            {/* Drag handle */}
            <div
              {...provided.dragHandleProps}
              className="mr-2.5 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={16} />
            </div>

            {/* Topic number badge */}
            <div className={`w-7 h-7 rounded-md ${color.bg} flex items-center justify-center text-white text-xs font-bold mr-3 shrink-0`}>
              {index + 1}
            </div>

            {/* Chevron */}
            <div className="mr-2 shrink-0">
              {isExpanded ? (
                <ChevronDown size={16} className="text-slate-500" />
              ) : (
                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-500" />
              )}
            </div>

            {/* Topic name */}
            <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
              <InlineEdit
                value={topic.name}
                onSave={(newName) => editTopic(topic.id, newName)}
                onDelete={() => deleteTopic(topic.id)}
                className="font-medium text-slate-800 text-sm"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 ml-4 shrink-0">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                progressPercent === 100
                  ? 'bg-emerald-50 text-emerald-700'
                  : progressPercent > 0
                  ? `${color.light} ${color.text}`
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {stats.solved}/{stats.total}
              </span>
              <div className="w-16 bg-slate-100 rounded-full h-1.5 hidden sm:block overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="border-t border-slate-100">
              {/* Action buttons */}
              <div className="px-4 py-2 bg-slate-50 flex gap-2 flex-wrap border-b border-slate-100">
                <button
                  onClick={() => { setShowAddQuestion(!showAddQuestion); setShowAddSubTopic(false); }}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md cursor-pointer ${
                    showAddQuestion
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <Plus size={13} /> Question
                </button>
                <button
                  onClick={() => { setShowAddSubTopic(!showAddSubTopic); setShowAddQuestion(false); }}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md cursor-pointer ${
                    showAddSubTopic
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <FolderOpen size={13} /> Sub-topic
                </button>
              </div>

              {/* Add Sub-topic form */}
              {showAddSubTopic && (
                <div className="px-4 py-3 bg-violet-50/50 border-b border-violet-100">
                  <form onSubmit={handleAddSubTopic} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Sub-topic name..."
                      value={newSubTopicName}
                      onChange={(e) => setNewSubTopicName(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 bg-white"
                      autoFocus
                    />
                    <button type="submit" className="px-3 py-2 text-sm font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 cursor-pointer">
                      Add
                    </button>
                    <button type="button" onClick={() => setShowAddSubTopic(false)} className="px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              {/* Add Question form */}
              {showAddQuestion && (
                <div className="px-4 py-3 bg-indigo-50/30 border-b border-indigo-100">
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
                <div key={subTopic.id} className="border-b border-slate-100 last:border-b-0">
                  <div
                    className="flex items-center px-4 py-2.5 bg-slate-50/50 cursor-pointer hover:bg-slate-50"
                    onClick={() => toggleSubTopic(subTopic.id)}
                  >
                    {expandedSubTopics[subTopic.id] ? (
                      <ChevronDown size={13} className="text-violet-500 mr-2 shrink-0" />
                    ) : (
                      <ChevronRight size={13} className="text-slate-400 mr-2 shrink-0" />
                    )}
                    <FolderOpen size={13} className="text-violet-500 mr-2 shrink-0" />
                    <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                      <InlineEdit
                        value={subTopic.name}
                        onSave={(newName) => editSubTopic(topic.id, subTopic.id, newName)}
                        onDelete={() => deleteSubTopic(topic.id, subTopic.id)}
                        className="text-sm font-medium text-slate-700"
                      />
                    </div>
                    <span className="text-xs text-violet-500 font-medium bg-violet-50 px-2 py-0.5 rounded">
                      {subTopic.questions.length}
                    </span>
                  </div>

                  {expandedSubTopics[subTopic.id] && (
                    <Droppable droppableId={`subtopic-questions-${topic.id}-${subTopic.id}`} type="SUBTOPIC_QUESTION">
                      {(droppableProvided) => (
                        <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
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

              {/* Questions under topic */}
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
                  <Hash size={20} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400">No questions yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
