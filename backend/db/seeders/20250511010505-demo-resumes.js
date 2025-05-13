"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
options.tableName = "Resumes";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        title: "Sample Resume Title 1",
        content: `Name: John Doe\nJob Title: Software Engineer\nEducation: B.S. in Computer Science\nSkills: JavaScript, React, Node.js\nSummary: Experienced full-stack engineer.\nExperience:\n- Software Engineer at Google: Built scalable features.\n- Intern at Startup X: Assisted with backend APIs.`,
        name: "John Doe",
        jobTitle: "Software Engineer",
        education: "B.S. in Computer Science",
        skills: "JavaScript, React, Node.js",
        summary: "Experienced full-stack engineer.",
        experience: JSON.stringify([
          {
            title: "Software Engineer",
            company: "Google",
            description: "Built scalable features.",
          },
          {
            title: "Intern",
            company: "Startup X",
            description: "Assisted with backend APIs.",
          },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        title: "Sample Resume Title 2",
        content: `Name: Jane Smith\nJob Title: Frontend Developer\nEducation: B.A. in Graphic Design\nSkills: HTML, CSS, JavaScript\nSummary: Creative frontend developer with UI expertise.\nExperience:\n- Frontend Dev at Pixel Co: Designed UI components.\n- Design Intern at Artify: Created design assets.`,
        name: "Jane Smith",
        jobTitle: "Frontend Developer",
        education: "B.A. in Graphic Design",
        skills: "HTML, CSS, JavaScript",
        summary: "Creative frontend developer with UI expertise.",
        experience: JSON.stringify([
          {
            title: "Frontend Dev",
            company: "Pixel Co",
            description: "Designed UI components.",
          },
          {
            title: "Design Intern",
            company: "Artify",
            description: "Created design assets.",
          },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, null, {});
  },
};
