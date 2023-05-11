const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const symptoms = [
        { name: 'Fever', description: 'Elevated body temperature, often with chills' },
        { name: 'Cough', description: 'A reflex action to clear your airways of mucus and irritants such as dust or smoke' },
        { name: 'Shortness of breath', description: 'Difficulty in breathing or feeling like you can’t get enough air' },
        { name: 'Fatigue', description: 'Overall feeling of tiredness or lack of energy' },
        { name: 'Headache', description: 'Pain in any region of the head' },
    ];

    for (let symptom of symptoms) {
        await prisma.symptom.create({
            data: symptom,
        });
    }

    console.log('Data seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
