import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { fetchFeedbackTemplates, FeedbackTemplate as FeedbackTemplateType } from '@/services/firebaseService';

const FeedbackTemplate: React.FC = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', content: '' });
  const { toast } = useToast();

  const { data: templates = [], isLoading, refetch } = useQuery({
    queryKey: ['feedbackTemplates'],
    queryFn: fetchFeedbackTemplates
  });

  const handleEdit = (template: FeedbackTemplateType) => {
    setEditingId(template.id);
    setFormData({ name: template.name, content: template.content });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDoc(doc(db, "feedbackTemplates", id.toString()));
      refetch();
      toast({
        title: "Template deleted",
        description: "Feedback template has been removed successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "Failed to delete the template. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({ name: '', content: '' });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.content) {
      toast({
        title: "Error",
        description: "Name and content are required",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      if (editingId) {
        // Update existing template
        await updateDoc(doc(db, "feedbackTemplates", editingId.toString()), formData);
        setEditingId(null);
        toast({
          title: "Template updated",
          description: "Your changes have been saved.",
          duration: 3000,
        });
      } else if (isAdding) {
        // Add new template
        const newId = Math.max(...templates.map(t => t.id), 0) + 1;
        await addDoc(collection(db, "feedbackTemplates"), { 
          id: newId,
          ...formData 
        });
        setIsAdding(false);
        toast({
          title: "Template added",
          description: "New feedback template has been created.",
          duration: 3000,
        });
      }
      
      setFormData({ name: '', content: '' });
      refetch();
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "Failed to save the template. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', content: '' });
  };

  if (isLoading) {
    return (
      <div className="educator-card animate-pulse h-64 flex items-center justify-center">
        <p className="text-educator-muted">Loading feedback templates...</p>
      </div>
    );
  }

  return (
    <div className="educator-card animate-fade-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Feedback Templates</h2>
        <button 
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
          disabled={isAdding || editingId !== null}
        >
          <Plus className="h-4 w-4" />
          <span>New Template</span>
        </button>
      </div>

      {(isAdding || editingId !== null) && (
        <div className="mb-6 p-4 border border-educator-blue/20 rounded-lg bg-educator-blue/5 animate-scale-in">
          <h3 className="text-lg font-medium mb-4">
            {isAdding ? 'Create New Template' : 'Edit Template'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-educator-muted mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-educator-blue transition-all duration-300"
                placeholder="E.g., Excellent Work"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-educator-muted mb-1">
                Template Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-educator-blue transition-all duration-300 min-h-[100px]"
                placeholder="Enter your feedback template content here..."
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="btn-primary"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{template.name}</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEdit(template)}
                  className="p-1 text-educator-muted hover:text-educator-blue transition-colors duration-200"
                  disabled={isAdding || editingId !== null}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(template.id)}
                  className="p-1 text-educator-muted hover:text-red-500 transition-colors duration-200"
                  disabled={isAdding || editingId !== null}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-educator-muted">{template.content}</p>
          </div>
        ))}

        {templates.length === 0 && !isAdding && (
          <div className="p-8 text-center border border-dashed border-gray-200 rounded-lg">
            <p className="text-educator-muted mb-4">No feedback templates available.</p>
            <button 
              onClick={handleAdd}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Template</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackTemplate;
