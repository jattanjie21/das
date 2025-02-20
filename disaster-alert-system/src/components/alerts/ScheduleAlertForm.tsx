'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/config';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

const scheduleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  priority: z.enum(['low', 'medium', 'high']),
  scheduleDate: z.string().min(1, 'Schedule date is required'),
  zone_id: z.string().uuid().optional(),
  recurring: z.boolean(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
});

export const ScheduleAlertForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    scheduleDate: '',
    recurring: false,
    frequency: 'daily',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = scheduleSchema.parse(formData);

      const { error } = await supabase
        .from('scheduled_alerts')
        .insert([{
          ...validatedData,
          status: 'pending',
        }]);

      if (error) throw error;

      toast.success('Alert scheduled successfully');
      setFormData({
        title: '',
        content: '',
        priority: 'medium',
        scheduleDate: '',
        recurring: false,
        frequency: 'daily',
      });
    } catch (error) {
      toast.error('Failed to schedule alert');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Schedule Date</label>
        <input
          type="datetime-local"
          value={formData.scheduleDate}
          onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.recurring}
          onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">Recurring Alert</label>
      </div>

      {formData.recurring && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Frequency</label>
          <select
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Schedule Alert
      </button>
    </form>
  );
}; 