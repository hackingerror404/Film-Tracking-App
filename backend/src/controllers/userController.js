const prisma = require('../config/prisma');

// Get skills for a specific user
async function getUserCrewTypes(req, res) {
  try {
    const { userId } = req.params;
    
    const userSkills = await prisma.usercrewtypes.findMany({
      where: { user_id: Number(userId) },
      select: { crew_id: true } 
    });

    // Return just the list of IDs to match frontend expectation
    res.json(userSkills); 
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ error: 'Failed to load user skills' });
  }
}

// Add a skill
async function addUserCrewType(req, res) {
  try {
    const { userId } = req.params;
    const { crew_id } = req.body;

    const newSkill = await prisma.usercrewtypes.create({
      data: {
        user_id: Number(userId),
        crew_id: Number(crew_id)
      }
    });

    res.status(201).json(newSkill);
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
}

// Remove a skill
async function removeUserCrewType(req, res) {
  try {
    const { userId, crewId } = req.params;

    // Prisma requires a unique identifier for deletion. 
    // Since we have a composite key (user_id + crew_id), we use deleteMany or the specific unique compound constraint.
    // Based on your schema, @@id([userid, crewid]) is the unique constraint.
    
    await prisma.usercrewtypes.delete({
      where: {
        userid_crewid: { // Prisma generates this name for compound IDs
          user_id: Number(userId),
          crew_id: Number(crewId)
        }
      }
    });

    res.status(200).send();
  } catch (error) {
    console.error('Error removing skill:', error);
    res.status(500).json({ error: 'Failed to remove skill' });
  }
}

module.exports = {
  getUserCrewTypes,
  addUserCrewType,
  removeUserCrewType
};