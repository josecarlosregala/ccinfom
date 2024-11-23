import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectTasks,
} from "./controllers/projects-controller.js";

// Test: Get All Projects
async function testGetAllProjects() {
  try {
    const projects = await getAllProjects();
    console.log("All Projects:", projects);
  } catch (err) {
    console.error("Error fetching all projects:", err);
  }
}

// Test: Get Project By ID
async function testGetProjectById(id) {
  try {
    const project = await getProjectById(id);
    console.log(`Project with ID ${id}:`, project);
  } catch (err) {
    console.error(`Error fetching project with ID ${id}:`, err);
  }
}

// Test: Create Project
async function testCreateProject() {
  try {
    const projectId = await createProject("New Test Project", 1000, 5, 200);
    console.log("New Project Created with ID:", projectId);
    await testGetProjectById(projectId); // Fetch the project just created
  } catch (err) {
    console.error("Error creating project:", err);
  }
}

// Test: Update Project
async function testUpdateProject(id) {
  try {
    const updated = await updateProject(
      id,
      "Updated Project Name",
      "2024-01-01",
      "2024-12-31",
      900,
      3,
      150,
      "completed"
    );
    if (updated) {
      console.log(`Project with ID ${id} updated.`);
      await testGetProjectById(id); // Fetch updated project
    } else {
      console.log(`Project with ID ${id} not found for update.`);
    }
  } catch (err) {
    console.error(`Error updating project with ID ${id}:`, err);
  }
}

// Test: Delete Project
async function testDeleteProject(id) {
  try {
    const deleted = await deleteProject(id);
    if (deleted) {
      console.log(`Project with ID ${id} was deleted.`);
    } else {
      console.log(`Project with ID ${id} was not found for deletion.`);
    }
  } catch (err) {
    console.error(`Error deleting project with ID ${id}:`, err);
  }
}

// Test: Get Project Tasks
async function testGetProjectTasks(id) {
  try {
    const tasks = await getProjectTasks(id);
    console.log(`Tasks for Project ID ${id}:`, tasks);
  } catch (err) {
    console.error(`Error fetching tasks for project with ID ${id}:`, err);
  }
}

async function runTests() {
  // Create a new project for testing other CRUD operations
  await testCreateProject();

  // Test getting all projects
  // await testGetAllProjects();

  // Test specific project fetch, update, and delete
  const projectId = 2; // Replace with actual project ID after creation
  // await testGetProjectById(projectId);
  // await testUpdateProject(projectId);
  // await testDeleteProject(projectId);

  // Test getting tasks for a project
  const projectIdForTasks = 1; // Replace with a valid project ID that has tasks
  // await testGetProjectTasks(projectIdForTasks);
}

// Start testing
runTests();
