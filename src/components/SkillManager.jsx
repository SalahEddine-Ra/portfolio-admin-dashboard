import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SkillManager() {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newSkill, setNewSkill] = useState({
        name: '',
        category: '',
        icon_url: ''
    });

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        const { data, error } = await supabase
            .from('Skills')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('fetchSkills error', error);
            return;
        }
        setSkills(data || []);
    };

    const addSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.name.trim() || !newSkill.category) return;

        setLoading(true);
        const { data, error } = await supabase
            .from('Skills')
            .insert([newSkill])
            .select();

        if (error) {
            console.error('insert error', error);
        } else if (data && data.length) {
            // use returned row to ensure values match DB
            setSkills([data[0], ...skills]);
            setNewSkill({ name: '', category: '', icon_url: '' });
        }

        setLoading(false);
    };

    const deleteSkill = async (id) => {
        if (!window.confirm('Are you sure you want to delete this skill?')) return;

        const { error } = await supabase
            .from('Skills')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('delete error', error);
        } else {
            setSkills(skills.filter(skill => skill.id !== id));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Skills</h2>

            {/* Add Skill Form */}
            <form onSubmit={addSkill} className="mb-8 p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Add New Skill</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Skill Name"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                    />
                    <select
                        value={newSkill.category}
                        onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                    >
                        <option value="">Select category</option>
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Icon URL (optional)"
                        value={newSkill.icon_url}
                        onChange={(e) => setNewSkill({...newSkill, icon_url: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Skill'}
                </button>
            </form>

            {/* Skills List */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Existing Skills ({skills.length})</h3>
                <div className="grid gap-4">
                    {skills.map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-4">
                                {skill.icon_url && (
                                    <img src={skill.icon_url} alt={skill.name} className="w-8 h-8" />
                                )}
                                <div>
                                    <h4 className="font-semibold">{skill.name}</h4>
                                    <p className="text-sm text-gray-600">
                                        {(skill.level || '').trim()} {skill.level ? '•' : ''} {skill.category || ''}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteSkill(skill.id)}
                                className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 rounded hover:bg-red-50"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}