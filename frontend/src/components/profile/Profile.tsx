import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { CrewType } from '../../lib/supabase';
import './Profile.css';

export default function Profile() {
  const { profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [crewTypes, setCrewTypes] = useState<CrewType[]>([]);
  const [userCrewTypes, setUserCrewTypes] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    username: profile?.username || '',
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    bio: profile?.bio || '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        firstName: profile.first_name,
        lastName: profile.last_name,
        bio: profile.bio || '',
      });
      loadCrewTypes();
      loadUserCrewTypes();
    }
  }, [profile]);

  async function loadCrewTypes() {
    try {
      const { data, error } = await supabase
        .from('crew_types')
        .select('*')
        .order('crew_name');

      if (error) throw error;
      setCrewTypes(data || []);
    } catch (error) {
      console.error('Error loading crew types:', error);
    }
  }

  async function loadUserCrewTypes() {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('user_crew_types')
        .select('crew_id')
        .eq('user_id', profile.user_id);

      if (error) throw error;
      setUserCrewTypes(data.map(item => item.crew_id));
    } catch (error) {
      console.error('Error loading user crew types:', error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function toggleCrewType(crewId: number) {
    if (!profile) return;

    try {
      if (userCrewTypes.includes(crewId)) {
        const { error } = await supabase
          .from('user_crew_types')
          .delete()
          .eq('user_id', profile.user_id)
          .eq('crew_id', crewId);

        if (error) throw error;
        setUserCrewTypes(userCrewTypes.filter(id => id !== crewId));
      } else {
        const { error } = await supabase
          .from('user_crew_types')
          .insert({
            user_id: profile.user_id,
            crew_id: crewId,
          });

        if (error) throw error;
        setUserCrewTypes([...userCrewTypes, crewId]);
      }

      setSuccess('Skills updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTimeout(() => setError(''), 3000);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await updateProfile({
        username: formData.username,
        first_name: formData.firstName,
        last_name: formData.lastName,
        bio: formData.bio,
      });

      if (error) throw error;

      setSuccess('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (!profile) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {profile.first_name[0]}{profile.last_name[0]}
          </div>
          <div className="profile-info">
            <h1>{profile.first_name} {profile.last_name}</h1>
            <p className="username">@{profile.username}</p>
          </div>
        </div>

        {!editing ? (
          <div className="profile-view">
            {profile.bio && (
              <div className="bio-section">
                <h3>About</h3>
                <p>{profile.bio}</p>
              </div>
            )}

            <div className="skills-section">
              <h3>Skills & Roles</h3>
              {userCrewTypes.length > 0 ? (
                <div className="skills-tags">
                  {crewTypes
                    .filter(type => userCrewTypes.includes(type.crew_id))
                    .map(type => (
                      <span key={type.crew_id} className="skill-tag">
                        {type.crew_name}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="no-skills">No skills added yet</p>
              )}
            </div>

            <button onClick={() => setEditing(true)} className="edit-button">
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell others about yourself..."
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button type="submit" disabled={loading} className="save-button">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        <div className="crew-types-section">
          <h3>Select Your Skills</h3>
          <p className="section-description">Choose the roles and skills you can contribute to film productions</p>
          <div className="crew-types-grid">
            {crewTypes.map(type => (
              <label key={type.crew_id} className="crew-type-checkbox">
                <input
                  type="checkbox"
                  checked={userCrewTypes.includes(type.crew_id)}
                  onChange={() => toggleCrewType(type.crew_id)}
                />
                <span>{type.crew_name}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <div className="message error-message">{error}</div>}
        {success && <div className="message success-message">{success}</div>}
      </div>
    </div>
  );
}
