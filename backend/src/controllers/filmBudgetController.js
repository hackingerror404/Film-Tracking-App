const prisma = require('../config/prisma');

// --- Helper: Get All Projects ---
async function getAllProjects(req, res) {
    try {
        // Optional: Add Auth check here later
        // const authToken = req.get('Auth-Token'); ...

        const { 
            page = 1, 
            pageSize = 25, 
            query 
        } = req.query;

        // Construct search filter
        let where = {};
        if (query) {
            where.OR = [
                { project_name: { contains: query } },
                { producer_company: { contains: query } },
                { description: { contains: query } }
            ];
        }

        const skip = (Number(page) - 1) * Number(pageSize);
        const take = Number(pageSize);

        // Fetch data and count in parallel
        const [projects, totalCount] = await Promise.all([
            prisma.film_projects.findMany({
                skip,
                take,
                where,
                orderBy: { project_id: 'desc' }, // Default sort
                // Include related items if needed:
                // include: { filmshoots: true } 
            }),
            prisma.film_projects.count({ where }),
        ]);

        res.status(200).json({
            data: projects,
            page: Number(page),
            pageSize: Number(pageSize),
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
        });

    } catch (err) {
        console.error("getAllProjects failed:", err);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

// --- Helper: Get Project by ID ---
async function getProjectById(req, res) {
    try {
        const { id } = req.params;
        
        const project = await prisma.film_projects.findUnique({
            where: { project_id: Number(id) },
            include: {
                filmshoots: true // Example: return shoots with the project
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// --- Helper: Create Project ---
async function createProject(req, res) {
    try {
        const { project_name, producer_company, description } = req.body;

        // Basic validation
        if (!project_name || !producer_company) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newProject = await prisma.film_projects.create({
            data: {
                project_name,
                producer_company,
                description: description || ""
            }
        });

        res.status(201).json(newProject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Export all functions
module.exports = {
    getAllProjects,
    getProjectById,
    createProject
};