export const validAchievements = [
    {
        id: "3ffe5574-9b56-4e57-8efc-2925f78208e2",
        content: "valid achievement 1",
        date: new Date("2025-04-01 09:00:00")
    },
    {
        id: "ecaf3f79-5cad-4783-9739-321b392690a1",
        content: "valid achievement 2",
        date: new Date("2025-04-02 09:00:00")
    },
    {
        id: "ffef366d-64da-4dca-82eb-f701f5d40e09",
        content: "valid achievement 3",
        date: new Date("2025-04-03 09:00:00")
    }
];

export const validStars = [
    {
        id: "5dcd76f8-07e0-4ae3-9d42-e1766d77a23c",
        achievementId: "3ffe5574-9b56-4e57-8efc-2925f78208e2",
        content: "valid star 1 (following achievement 1)",
        date: new Date("2025-04-01 09:30:00")
    },
    {
        id: "a47baaac-afe5-4447-87b5-943445304725",
        achievementId: "ecaf3f79-5cad-4783-9739-321b392690a1",
        content: "",
        date: new Date("2025-04-02 09:30:00")
    },
    {
        id: "7d0d56a2-96ad-4cc1-969d-7c038932c7ee",
        achievementId: "ecaf3f79-5cad-4783-9739-321b392690a1",
        content: "valid star 3 (following achievement 2)",
        date: new Date("2025-04-03 09:30:00")
    }
];

export const validRecords = [
    {
        achievement: validAchievements[0],
        stars: [validStars[0]]
    },
    {
        achievement: validAchievements[1],
        stars: [validStars[1], validStars[2]]
    },
    {
        achievement: validAchievements[2],
        stars: []
    }
];
