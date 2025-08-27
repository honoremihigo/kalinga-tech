import { X } from "lucide-react";
import { useEffect, useState } from "react";
import taskService from "../../../../Services/Dispatch/taskService";

const UpsertTaskModal = ({ isOpen, onClose, onSubmit, task, isLoading, title }) => {
    const [formData, setFormData] = useState({
        taskname: '',
        description: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (task) {
            setFormData({
                taskname: task.taskname || '',
                description: task.description || ''
            });
        } else {
            setFormData({
                taskname: '',
                description: ''
            });
        }
        setErrors({});
    }, [task, isOpen]);

    const validateForm = () => {
        const validation = taskService.validateTaskData(formData);
        setErrors(validation.errors.reduce((acc, err) => ({ ...acc, [err.split(' ')[0].toLowerCase()]: err }), {}));
        return validation.isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Permission Name
                            </label>
                            <input
                                type="text"
                                value={formData.taskname}
                                onChange={(e) => handleChange('taskname', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    errors.taskname ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter position name"
                            />
                            {errors.taskname && <p className="text-red-500 text-xs mt-1">{errors.taskname}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter Position description"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Saving...' : (task ? 'Update' : 'Add')} Position
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpsertTaskModal;