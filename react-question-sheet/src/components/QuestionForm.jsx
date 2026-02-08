import { useState } from 'react';

export default function QuestionForm({ initialData, onSubmit, onCancel, submitLabel = 'Add' }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    difficulty: initialData?.difficulty || 'Medium',
    problemUrl: initialData?.problemUrl || '',
    platform: initialData?.platform || 'leetcode',
    resource: initialData?.resource || '',
    notes: initialData?.notes || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit({
      ...formData,
      title: formData.title.trim(),
      resource: formData.resource.trim() || null,
      notes: formData.notes.trim() || '',
    });
    if (!initialData) {
      setFormData({ title: '', difficulty: 'Medium', problemUrl: '', platform: 'leetcode', resource: '', notes: '' });
    }
  };

  const inputCls = "px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white placeholder-slate-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <input
          type="text"
          placeholder="Question title *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={inputCls}
          autoFocus
          required
        />
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          className={`${inputCls} bg-white`}
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
          className={inputCls}
        />
        <select
          value={formData.platform}
          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
          className={`${inputCls} bg-white`}
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
        className={`w-full ${inputCls}`}
      />
      <textarea
        placeholder="Notes (approach, time complexity, etc.) - optional"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        className={`w-full ${inputCls} resize-none`}
        rows={2}
      />
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer active:scale-[0.97]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
