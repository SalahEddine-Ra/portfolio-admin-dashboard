import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: [],
    project_url: '',
    github_url: '',
    image_url: '',
    category: 'Front-end',
    featured: false
  });
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setProjects(data || []);
  };

  const addTechnology = () => {
    if (techInput.trim() && !newProject.technologies.includes(techInput.trim())) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter(t => t !== tech)
    });
  };

  const addProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.description.trim()) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select();

    if (!error) {
      setProjects([data[0], ...projects]);
      setNewProject({
        title: '',
        description: '',
        technologies: [],
        project_url: '',
        github_url: '',
        image_url: '',
        category: 'Front-end',
        featured: false
      });
    }
    setLoading(false);
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (!error) {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Projects</h2>

      {/* Add Project Form */}
      <form onSubmit={addProject} className="mb-8 p-6 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject({...newProject, title: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <select
            value={newProject.category}
            onChange={(e) => setNewProject({...newProject, category: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="Front-end">Front-end</option>
            <option value="Back-end">Back-end</option>
            <option value="Full-stack">Full-stack</option>
            <option value="Web App">Web App</option>
          </select>
        </div>

        <textarea
          placeholder="Project Description"
          value={newProject.description}
          onChange={(e) => setNewProject({...newProject, description: e.target.value})}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 mb-4"
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add technology"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="button"
              onClick={addTechnology}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {newProject.technologies.map((tech, index) => (
              <span key={index} className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm flex items-center">
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="ml-2 text-sky-600 hover:text-sky-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="url"
            placeholder="Live Demo URL"
            value={newProject.project_url}
            onChange={(e) => setNewProject({...newProject, project_url: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <input
            type="url"
            placeholder="GitHub URL"
            value={newProject.github_url}
            onChange={(e) => setNewProject({...newProject, github_url: e.target.value})}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <input
          type="url"
          placeholder="Image URL"
          value={newProject.image_url}
          onChange={(e) => setNewProject({...newProject, image_url: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 mb-4"
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="featured"
            checked={newProject.featured}
            onChange={(e) => setNewProject({...newProject, featured: e.target.checked})}
            className="mr-2"
          />
          <label htmlFor="featured" className="text-sm text-gray-700">
            Feature this project
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Project'}
        </button>
      </form>

      {/* Projects List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Existing Projects ({projects.length})</h3>
        <div className="grid gap-6">
          {projects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-semibold">{project.title}</h4>
                  <p className="text-gray-600">{project.category} {project.featured && '⭐'}</p>
                </div>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-600 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-sm">
                {project.project_url && (
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-sky-800">
                    Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}