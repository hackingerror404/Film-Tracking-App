import type { FilmShoot } from '../../lib/supabase';
import './ShootCard.css';

type ShootCardProps = {
  shoot: FilmShoot;
};

export default function ShootCard({ shoot }: ShootCardProps) {
  const startDate = new Date(shoot.start_time);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="shoot-card">
      {shoot.image_urls && shoot.image_urls.length > 0 && (
        <div className="shoot-image">
          <img src={shoot.image_urls[0]} alt={shoot.film_projects?.project_name} />
        </div>
      )}

      <div className="shoot-content">
        <div className="shoot-header">
          <h3>{shoot.film_projects?.project_name}</h3>
          <span className="producer">{shoot.film_projects?.producer_company}</span>
        </div>

        <p className="shoot-description">{shoot.description}</p>

        <div className="shoot-details">
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <span>{formattedDate} at {formattedTime}</span>
          </div>

          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <span>
              {shoot.location_city}, {shoot.location_state}
            </span>
          </div>

          {shoot.contact_info && (
            <div className="detail-item">
              <span className="detail-icon">📧</span>
              <span>{shoot.contact_info}</span>
            </div>
          )}

          {shoot.rideshare_info && (
            <div className="detail-item">
              <span className="detail-icon">🚗</span>
              <span>{shoot.rideshare_info}</span>
            </div>
          )}
        </div>

        {shoot.shoot_crew_types_requested && shoot.shoot_crew_types_requested.length > 0 && (
          <div className="crew-types">
            <span className="crew-label">Looking for:</span>
            <div className="crew-tags">
              {shoot.shoot_crew_types_requested.map((req: any) => (
                <span key={req.crew_types.crew_id} className="crew-tag">
                  {req.crew_types.crew_name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="shoot-address">
          <strong>Location:</strong> {shoot.location_street_address}
        </div>
      </div>
    </div>
  );
}
