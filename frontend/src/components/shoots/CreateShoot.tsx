import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { CrewType } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './CreateShoot.css';

export default function CreateShoot() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [crewTypes, setCrewTypes] = useState<CrewType[]>([]);

  const [formData, setFormData] = useState({
    projectName: '',
    producerCompany: '',
    projectDescription: '',
    shootDescription: '',
    streetAddress: '',
    city: '',
    state: '',
    country: 'USA',
    startTime: '',
    endTime: '',
    contactInfo: '',
    rideshareInfo: '',
    selectedCrewTypes: [] as number[],
  });

  useEffect(() => {
    loadCrewTypes();
  }, []);

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function toggleCrewType(crewId: number) {
    setFormData({
      ...formData,
      selectedCrewTypes: formData.selectedCrewTypes.includes(crewId)
        ? formData.selectedCrewTypes.filter(id => id !== crewId)
        : [...formData.selectedCrewTypes, crewId],
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { data: project, error: projectError } = await supabase
        .from('film_projects')
        .insert({
          project_name: formData.projectName,
          producer_company: formData.producerCompany,
          description: formData.projectDescription,
          created_by: user.id,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      const { data: shoot, error: shootError } = await supabase
        .from('film_shoots')
        .insert({
          project_id: project.project_id,
          description: formData.shootDescription,
          location_street_address: formData.streetAddress,
          location_city: formData.city,
          location_state: formData.state,
          location_country: formData.country,
          start_time: formData.startTime,
          end_time: formData.endTime || null,
          contact_info: formData.contactInfo || null,
          rideshare_info: formData.rideshareInfo || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (shootError) throw shootError;

      if (formData.selectedCrewTypes.length > 0) {
        const crewTypeInserts = formData.selectedCrewTypes.map(crewId => ({
          shoot_id: shoot.shoot_id,
          crew_id: crewId,
        }));

        const { error: crewTypesError } = await supabase
          .from('shoot_crew_types_requested')
          .insert(crewTypeInserts);

        if (crewTypesError) throw crewTypesError;
      }

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-shoot-container">
      <div className="create-shoot-card">
        <h1>Post a Film Shoot</h1>
        <p className="subtitle">Share information about your upcoming production</p>

        <form onSubmit={handleSubmit} className="create-shoot-form">
          <section className="form-section">
            <h2>Project Information</h2>
            <input
              type="text"
              name="projectName"
              placeholder="Project Name"
              value={formData.projectName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="producerCompany"
              placeholder="Production Company"
              value={formData.producerCompany}
              onChange={handleChange}
              required
            />
            <textarea
              name="projectDescription"
              placeholder="Project Description"
              value={formData.projectDescription}
              onChange={handleChange}
              rows={3}
              required
            />
          </section>

          <section className="form-section">
            <h2>Shoot Details</h2>
            <textarea
              name="shootDescription"
              placeholder="Shoot Description (roles, scenes, etc.)"
              value={formData.shootDescription}
              onChange={handleChange}
              rows={4}
              required
            />
            <div className="form-row">
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                placeholder="End Time (optional)"
              />
            </div>
          </section>

          <section className="form-section">
            <h2>Location</h2>
            <input
              type="text"
              name="streetAddress"
              placeholder="Street Address"
              value={formData.streetAddress}
              onChange={handleChange}
              required
            />
            <div className="form-row">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </section>

          <section className="form-section">
            <h2>Additional Information</h2>
            <input
              type="text"
              name="contactInfo"
              placeholder="Contact Information (email or phone)"
              value={formData.contactInfo}
              onChange={handleChange}
            />
            <textarea
              name="rideshareInfo"
              placeholder="Rideshare/Transportation Info"
              value={formData.rideshareInfo}
              onChange={handleChange}
              rows={2}
            />
          </section>

          <section className="form-section">
            <h2>Crew Types Needed</h2>
            <div className="crew-types-grid">
              {crewTypes.map(type => (
                <label key={type.crew_id} className="crew-type-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.selectedCrewTypes.includes(type.crew_id)}
                    onChange={() => toggleCrewType(type.crew_id)}
                  />
                  <span>{type.crew_name}</span>
                </label>
              ))}
            </div>
          </section>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Posting...' : 'Post Shoot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
