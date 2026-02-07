import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { BookOpen } from 'lucide-react';
import useSheetStore from '../store/useSheetStore';
import TopicItem from './TopicItem';

export default function TopicList() {
  const { topics, searchQuery, reorderTopics, reorderQuestions, reorderSubTopicQuestions } =
    useSheetStore();

  const handleDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'TOPIC') {
      reorderTopics(source.index, destination.index);
      return;
    }

    if (type === 'QUESTION') {
      const topicId = source.droppableId.replace('topic-questions-', '');
      if (source.droppableId === destination.droppableId) {
        reorderQuestions(topicId, source.index, destination.index);
      }
      return;
    }

    if (type === 'SUBTOPIC_QUESTION') {
      const srcParts = source.droppableId.match(/subtopic-questions-(.+?)-(.+)$/);
      if (srcParts && source.droppableId === destination.droppableId) {
        const store = useSheetStore.getState();
        for (const topic of store.topics) {
          for (const st of topic.subTopics) {
            if (source.droppableId === `subtopic-questions-${topic.id}-${st.id}`) {
              reorderSubTopicQuestions(topic.id, st.id, source.index, destination.index);
              return;
            }
          }
        }
      }
    }
  };

  const filteredTopics = searchQuery
    ? topics.filter((t) => {
        const topicMatch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
        const questionMatch = t.questions.some((q) =>
          q.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const subTopicMatch = t.subTopics.some(
          (st) =>
            st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            st.questions.some((q) =>
              q.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
        return topicMatch || questionMatch || subTopicMatch;
      })
    : topics;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="topics-list" type="TOPIC">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4"
          >
            {filteredTopics.map((topic, index) => (
              <TopicItem
                key={topic.id}
                topic={topic}
                index={index}
                searchQuery={searchQuery}
              />
            ))}
            {provided.placeholder}

            {filteredTopics.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-4">
                  <BookOpen size={28} className="text-indigo-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  {searchQuery ? 'No matching questions found' : 'No topics yet'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchQuery ? 'Try a different search term.' : 'Click "Add Topic" to get started!'}
                </p>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
