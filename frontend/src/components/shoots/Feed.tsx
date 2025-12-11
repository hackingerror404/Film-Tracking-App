import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { FilmShoot, CrewType } from '../../lib/supabase';
import ShootCard from './ShootCard';
import './Feed.css';

export default function Feed() {
  const [shoots, setShoots] = useState<FilmShoot[]>([]);
  const [crewTypes, setCrewTypes] = useState<CrewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrewType, setSelectedCrewType] = useState<number | null>(null);
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    loadCrewTypes();
    loadShoots();
  }, [selectedCrewType]);

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

  async function loadShoots() {
    try {
      setLoading(true);
      let query = supabase
        .from('film_shoots')
        .select(`
          *,
          film_projects (*),
          shoot_crew_types_requested (
            crew_types (*)
          )
        `)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];

      if (selectedCrewType) {
        filteredData = filteredData.filter(shoot =>
          shoot.shoot_crew_types_requested?.some(
            (req: any) => req.crew_types.crew_id === selectedCrewType
          )
        );
      }

      setShoots(filteredData);
    } catch (error) {
      console.error('Error loading shoots:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredShoots = shoots.filter(shoot => {
    const matchesSearch = searchTerm === '' ||
      shoot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shoot.film_projects?.project_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = locationFilter === '' ||
      shoot.location_city.toLowerCase().includes(locationFilter.toLowerCase()) ||
      shoot.location_state.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>Upcoming Film Shoots</h1>
        <p>Find and connect with local film productions</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search shoots..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <input
          type="text"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedCrewType || ''}
          onChange={(e) => setSelectedCrewType(e.target.value ? Number(e.target.value) : null)}
          className="crew-filter"
        >
          <option value="">All Crew Types</option>
          {crewTypes.map(type => (
            <option key={type.crew_id} value={type.crew_id}>
              {type.crew_name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading shoots...</div>
      ) : filteredShoots.length === 0 ? (
        <div className="no-shoots">
          <p>No upcoming shoots found</p>
          <p className="no-shoots-subtitle">Check back later or adjust your filters</p>
        </div>
      ) : (
        <div className="shoots-grid">
          {filteredShoots.map(shoot => (
            <ShootCard key={shoot.shoot_id} shoot={shoot} />
          ))}
        </div>
      )}
    </div>
  );
}
