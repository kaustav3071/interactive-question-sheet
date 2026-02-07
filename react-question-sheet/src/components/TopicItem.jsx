import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, GripVertical, FolderOpen } from 'lucide-react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import useSheetStore from '../store/useSheetStore';
import InlineEdit from './InlineEdit';
import QuestionItem from './QuestionItem';
import QuestionForm from './QuestionForm';

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
          className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow ${
            snapshot.isDragging ? 'shadow-xl ring-2 ring-indigo-300' : 'hover:shadow-md'
          }`}
        >
          {/* Topic Header */}
          <div
            className="flex items-center px-4 py-3 cursor-pointer select-none"
            onClick={() => setExpanded(!isExpanded)}
          >
            <div
              {...provided.dragHandleProps}
              className="mr-3 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={18} />
            </div>

            {isExpanded ? (
              <ChevronDown size={18} className="text-gray-400 mr-2 flex-shrink-0" />
            ) : (
              <ChevronRight size={18} className="text-gray-400 mr-2 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
              <InlineEdit
                value={topic.name}
                onSave={(newName) => editTopic(topic.id, newName)}
                onDelete={() => deleteTopic(topic.id)}
                className="font-semibold text-gray-800"
              />
            </div>

            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {stats.solved}/{stats.total}
              </span>
              <div className="w-16 bg-gray-200 rounded-full h-1.5 hidden sm:block">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: stats.total ? `${(stats.solved / stats.total) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="border-t border-gray-100">
              {/* Action buttons */}
              <div className="px-4 py-2 bg-gray-50 flex gap-2 flex-wrap">
                <button
                  onClick={() => setShowAddQuestion(!showAddQuestion)}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
                >
                  <Plus size={14} /> Add Question
                </button>
                <button
                  onClick={() => setShowAddSubTopic(!showAddSubTopic)}
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                >
                  <FolderOpen size={14} /> Add Sub-topic
                </button>
              </div>

              {/* Add Sub-topic form */}
              {showAddSubTopic && (
                <div className="px-4 py-3 bg-purple-50 border-b border-gray-100">
                  <form onSubmit={handleAddSubTopic} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Sub-topic name..."
                      value={newSubTopicName}
                      onChange={(e) => setNewSubTopicName(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddSubTopic(false)}
                      className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              {/* Add Question form */}
              {showAddQuestion && (
                <div className="px-4 py-3 bg-indigo-50 border-b border-gray-100">
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
                <div key={subTopic.id} className="border-b border-gray-100">
                  <div
                    className="flex items-center px-6 py-2 bg-gray-50/50 cursor-pointer"
                    onClick={() => toggleSubTopic(subTopic.id)}
                  >
                    {expandedSubTopics[subTopic.id] ? (
                      <ChevronDown size={14} className="text-gray-400 mr-2" />
                    ) : (
                      <ChevronRight size={14} className="text-gray-400 mr-2" />
                    )}
                    <FolderOpen size={14} className="text-purple-500 mr-2" />
                    <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                      <InlineEdit
                        value={subTopic.name}
                        onSave={(newName) => editSubTopic(topic.id, subTopic.id, newName)}
                        onDelete={() => deleteSubTopic(topic.id, subTopic.id)}
                        className="text-sm font-medium text-gray-700"
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {subTopic.questions.length} questions
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
                <div className="px-4 py-8 text-center text-sm text-gray-400">
                  No questions yet. Click "Add Question" to get started.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
