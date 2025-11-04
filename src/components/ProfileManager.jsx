import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ProfileManager() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    avatar_url: '',
    cv_url: '',
    linkedin_url: '',
    github_url: '',
    instagram_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .single();

    if (!error && data) {
      setProfile(data);
      setFormData({
        bio: data.bio || '',
        avatar_url: data.avatar_url || '',
        cv_url: data.cv_url || '',
        linkedin_url: data.social_links?.linkedin || '',
        github_url: data.social_links?.github || '',
        instagram_url: data.social_links?.instagram || ''
      });
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    const social_links = {
      linkedin: formData.linkedin_url,
      github: formData.github_url,
      instagram: formData.instagram_url
    };

    const updateData = {
      bio: formData.bio,
      avatar_url: formData.avatar_url,
      cv_url: formData.cv_url,
      social_links: social_links,
      updated_at: new Date().toISOString()
    };

    let result;
    if (profile) {
      // Update existing profile
      result = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id)
        .select();
    } else {
      // Create new profile
      result = await supabase
        .from('profiles')
        .insert([updateData])
        .select();
    }

    if (!result.error) {
      setProfile(result.data[0]);
      alert('Profile updated successfully!');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Profile</h2>

      <form onSubmit={updateProfile} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
            <input
              type="url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CV URL</label>
            <input
              type="url"
              value={formData.cv_url}
              onChange={(e) => setFormData({...formData, cv_url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-sky-600 text-white px-8 py-3 rounded-md hover:bg-sky-700 disabled:opacity-50 font-semibold"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}