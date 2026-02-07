import { useState } from 'react';

export default function QuestionForm({ initialData, onSubmit, onCancel, submitLabel = 'Add' }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    difficulty: initialData?.difficulty || 'Medium',
    problemUrl: initialData?.problemUrl || '',
    platform: initialData?.platform || 'leetcode',
    resource: initialData?.resource || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit({
      ...formData,
      title: formData.title.trim(),
      resource: formData.resource.trim() || null,
    });
    if (!initialData) {
      setFormData({ title: '', difficulty: 'Medium', problemUrl: '', platform: 'leetcode', resource: '' });
    }
  };

  const inputClasses = "px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white placeholder-gray-400 transition-shadow";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Question title *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={inputClasses}
          autoFocus
          required
        />
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          className={`${inputClasses} bg-white`}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <input
          type="url"
          placeholder="Problem URL"
          value={formData.problemUrl}
          onChange={(e) => setFormData({ ...formData, problemUrl: e.target.value })}
          className={inputClasses}
        />
        <select
          value={formData.platform}
          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
          className={`${inputClasses} bg-white`}
        >
          <option value="leetcode">LeetCode</option>
          <option value="interviewbit">InterviewBit</option>
          <option value="tuf">TakeUForward</option>
          <option value="spoj">SPOJ</option>
          <option value="other">Other</option>
        </select>
      </div>
      <input
        type="url"
        placeholder="Video resource URL (optional)"
        value={formData.resource}
        onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
        className={`w-full ${inputClasses}`}
      />
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-200 cursor-pointer transition-all active:scale-95"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
