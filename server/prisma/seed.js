import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const courses = [
  "Design",
  "Marketing",
  "Product",
  "Introdução ao Figma",
  "Full Stack",
  "Front End",
  "Back End",
  "UI/UX",
  "Banco de Dados",
  "Ciência de Dados",
  "DevOps",
];

const students = [
  {
    firstName: "Olivia",
    lastName: "Rhye",
    state: "Rio Grande do Sul",
    courses: ["Design", "Marketing", "Product"],
  },
  {
    firstName: "Phoenix",
    lastName: "Baker",
    state: "Rio Grande do Sul",
    courses: ["Design", "Marketing", "Product"],
  },
  {
    firstName: "Lana",
    lastName: "Steiner",
    state: "Rio Grande do Sul",
    courses: ["Design", "Marketing", "Product"],
  },
  {
    firstName: "Demi",
    lastName: "Wikinson",
    state: "Rio Grande do Sul",
    courses: ["Design", "Marketing", "Product"],
  },
  {
    firstName: "Candice",
    lastName: "Wu",
    state: "Bahia",
    courses: ["Design", "Marketing", "Product", "Full Stack"],
  },
  {
    firstName: "Natali",
    lastName: "Craig",
    state: "Rio Grande do Sul",
    courses: ["Design", "Marketing", "Product"],
  },
  {
    firstName: "Drew",
    lastName: "Cano",
    state: "Bahia",
    courses: ["Design", "Marketing", "Product", "Full Stack", "Front End"],
  },
  {
    firstName: "Orlando",
    lastName: "Diggs",
    state: "Rio de Janeiro",
    courses: [],
  },
  {
    firstName: "Andi",
    lastName: "Lane",
    state: "Santa Catarina",
    courses: [],
  },
  {
    firstName: "Kate",
    lastName: "Morrison",
    state: "Rio Grande do Sul",
    courses: [],
  },
];

async function main() {
  for (const name of courses) {
    const exists = await prisma.course.findUnique({ where: { name } });
    if (!exists) {
      await prisma.course.create({ data: { name } });
      console.log(`Course created: ${name}`);
    } else {
      console.log(`Course already exists: ${name}`);
    }
  }

  for (const student of students) {
    const { firstName, lastName, state, courses } = student;

    const newStudent = await prisma.student.create({
      data: {
        firstName,
        lastName,
        state,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        cpf: `${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        gender: "OTHER",
        zipCode: "91530566",
        street: "Beco H",
        number: "123",
        country: "Brasil",
        neighborhood: "Partenon",
        city: "Porto Alegre",
        birthDate: new Date("1990-01-01"),
      },
    });

    for (const courseName of courses) {
      const course = await prisma.course.findUnique({
        where: { name: courseName },
      });
      if (course) {
        await prisma.enrollment.create({
          data: {
            studentId: newStudent.id,
            courseId: course.id,
            status: "IN_PROGRESS",
            completionDate: new Date("2025-08-30"),
          },
        });
      }
    }

    console.log(`Student created: ${firstName} ${lastName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
