const prisma = require('../config/prisma');

async function getAllCrewTypes(req, res) {
  try {
    const crewTypes = await prisma.crew_types.findMany({
      orderBy: { crew_name: 'asc' }
    });
    res.json(crewTypes);
  } catch (error) {
    console.error('Error fetching crew types:', error);
    res.status(500).json({ error: 'Failed to load crew types' });
  }
}

module.exports = { getAllCrewTypes };