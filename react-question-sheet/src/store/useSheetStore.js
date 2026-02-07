import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import sampleData from '../data/sampleData';

const useSheetStore = create((set, get) => ({
  topics: sampleData.topics,
  searchQuery: '',
  
  setSearchQuery: (query) => set({ searchQuery: query }),

  // ========== TOPIC CRUD ==========
  addTopic: (name) =>
    set((state) => ({
      topics: [
        ...state.topics,
        { id: uuidv4(), name, subTopics: [], questions: [] },
      ],
    })),

  editTopic: (topicId, newName) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId ? { ...t, name: newName } : t
      ),
    })),

  deleteTopic: (topicId) =>
    set((state) => ({
      topics: state.topics.filter((t) => t.id !== topicId),
    })),

  // ========== SUB-TOPIC CRUD ==========
  addSubTopic: (topicId, name) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: [
                ...t.subTopics,
                { id: uuidv4(), name, questions: [] },
              ],
            }
          : t
      ),
    })),

  editSubTopic: (topicId, subTopicId, newName) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId ? { ...st, name: newName } : st
              ),
            }
          : t
      ),
    })),

  deleteSubTopic: (topicId, subTopicId) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.filter((st) => st.id !== subTopicId),
            }
          : t
      ),
    })),

  // ========== QUESTION CRUD (under topic) ==========
  addQuestion: (topicId, question) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              questions: [
                ...t.questions,
                { id: uuidv4(), ...question },
              ],
            }
          : t
      ),
    })),

  editQuestion: (topicId, questionId, updatedQuestion) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              questions: t.questions.map((q) =>
                q.id === questionId ? { ...q, ...updatedQuestion } : q
              ),
            }
          : t
      ),
    })),

  deleteQuestion: (topicId, questionId) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              questions: t.questions.filter((q) => q.id !== questionId),
            }
          : t
      ),
    })),

  // ========== QUESTION CRUD (under sub-topic) ==========
  addSubTopicQuestion: (topicId, subTopicId, question) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId
                  ? {
                      ...st,
                      questions: [
                        ...st.questions,
                        { id: uuidv4(), ...question },
                      ],
                    }
                  : st
              ),
            }
          : t
      ),
    })),

  editSubTopicQuestion: (topicId, subTopicId, questionId, updatedQuestion) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId
                  ? {
                      ...st,
                      questions: st.questions.map((q) =>
                        q.id === questionId ? { ...q, ...updatedQuestion } : q
                      ),
                    }
                  : st
              ),
            }
          : t
      ),
    })),

  deleteSubTopicQuestion: (topicId, subTopicId, questionId) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId
                  ? {
                      ...st,
                      questions: st.questions.filter((q) => q.id !== questionId),
                    }
                  : st
              ),
            }
          : t
      ),
    })),

  // ========== REORDER ==========
  reorderTopics: (startIndex, endIndex) =>
    set((state) => {
      const newTopics = [...state.topics];
      const [removed] = newTopics.splice(startIndex, 1);
      newTopics.splice(endIndex, 0, removed);
      return { topics: newTopics };
    }),

  reorderSubTopics: (topicId, startIndex, endIndex) =>
    set((state) => ({
      topics: state.topics.map((t) => {
        if (t.id !== topicId) return t;
        const newSubTopics = [...t.subTopics];
        const [removed] = newSubTopics.splice(startIndex, 1);
        newSubTopics.splice(endIndex, 0, removed);
        return { ...t, subTopics: newSubTopics };
      }),
    })),

  reorderQuestions: (topicId, startIndex, endIndex) =>
    set((state) => ({
      topics: state.topics.map((t) => {
        if (t.id !== topicId) return t;
        const newQuestions = [...t.questions];
        const [removed] = newQuestions.splice(startIndex, 1);
        newQuestions.splice(endIndex, 0, removed);
        return { ...t, questions: newQuestions };
      }),
    })),

  reorderSubTopicQuestions: (topicId, subTopicId, startIndex, endIndex) =>
    set((state) => ({
      topics: state.topics.map((t) => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          subTopics: t.subTopics.map((st) => {
            if (st.id !== subTopicId) return st;
            const newQuestions = [...st.questions];
            const [removed] = newQuestions.splice(startIndex, 1);
            newQuestions.splice(endIndex, 0, removed);
            return { ...st, questions: newQuestions };
          }),
        };
      }),
    })),

  // ========== PROGRESS TRACKING (Bonus) ==========
  toggleQuestionSolved: (topicId, questionId) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              questions: t.questions.map((q) =>
                q.id === questionId ? { ...q, solved: !q.solved } : q
              ),
            }
          : t
      ),
    })),

  toggleSubTopicQuestionSolved: (topicId, subTopicId, questionId) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? {
              ...t,
              subTopics: t.subTopics.map((st) =>
                st.id === subTopicId
                  ? {
                      ...st,
                      questions: st.questions.map((q) =>
                        q.id === questionId ? { ...q, solved: !q.solved } : q
                      ),
                    }
                  : st
              ),
            }
          : t
      ),
    })),

  // ========== STATS ==========
  getStats: () => {
    const state = get();
    let total = 0;
    let solved = 0;
    state.topics.forEach((t) => {
      t.questions.forEach((q) => {
        total++;
        if (q.solved) solved++;
      });
      t.subTopics.forEach((st) => {
        st.questions.forEach((q) => {
          total++;
          if (q.solved) solved++;
        });
      });
    });
    return { total, solved, percentage: total ? Math.round((solved / total) * 100) : 0 };
  },

  getTopicStats: (topicId) => {
    const state = get();
    const topic = state.topics.find((t) => t.id === topicId);
    if (!topic) return { total: 0, solved: 0 };
    let total = 0;
    let solved = 0;
    topic.questions.forEach((q) => {
      total++;
      if (q.solved) solved++;
    });
    topic.subTopics.forEach((st) => {
      st.questions.forEach((q) => {
        total++;
        if (q.solved) solved++;
      });
    });
    return { total, solved };
  },
}));

export default useSheetStore;
