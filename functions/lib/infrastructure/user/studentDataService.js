"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToCSV = exports.fetchStudentData = void 0;
const calculateRiskFromResponses = (responses) => {
    const mockRisk = Math.random() * 100;
    let riskLevel;
    if (mockRisk > 70)
        riskLevel = 'High';
    else if (mockRisk > 40)
        riskLevel = 'Moderate';
    else
        riskLevel = 'Low';
    return {
        riskLevel,
        riskPercentage: Math.round(mockRisk),
        categories: {
            emotionalOverwhelm: Math.round(Math.random() * 100),
            lonelinessStress: Math.round(Math.random() * 100),
            depression: Math.round(Math.random() * 100),
            eatingHabits: Math.round(Math.random() * 100),
        }
    };
};
const fetchStudentData = async () => {
    console.log('Using mock student data');
    return getMockStudentData();
};
exports.fetchStudentData = fetchStudentData;
const getMockStudentData = () => {
    const mockData = [];
    const grades = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    const genders = ['Male', 'Female', 'Other'];
    const names = [
        'Alex Johnson', 'Sarah Smith', 'Michael Brown', 'Emma Wilson', 'James Davis',
        'Olivia Miller', 'William Jones', 'Sophia Garcia', 'Benjamin Martinez', 'Isabella Rodriguez',
        'Lucas Anderson', 'Mia Taylor', 'Henry Thomas', 'Charlotte Jackson', 'Alexander White'
    ];
    for (let i = 0; i < 50; i++) {
        const riskPercentage = Math.floor(Math.random() * 100);
        let riskLevel;
        if (riskPercentage > 70)
            riskLevel = 'High';
        else if (riskPercentage > 40)
            riskLevel = 'Moderate';
        else
            riskLevel = 'Low';
        mockData.push({
            id: `student_${i + 1}`,
            rollNo: `ST${String(i + 1).padStart(4, '0')}`,
            name: names[i % names.length],
            gender: genders[Math.floor(Math.random() * genders.length)],
            class: grades[Math.floor(Math.random() * grades.length)],
            riskLevel,
            riskPercentage,
            emotionalOverwhelm: Math.floor(Math.random() * 100),
            lonelinessStress: Math.floor(Math.random() * 100),
            depression: Math.floor(Math.random() * 100),
            eatingHabits: Math.floor(Math.random() * 100),
        });
    }
    return mockData;
};
const exportToCSV = (data) => {
    const csvContent = [
        ['Student ID', 'Name', 'Gender', 'Class', 'Risk Level', 'Risk Percentage', 'Emotional Overwhelm', 'Loneliness Stress', 'Depression', 'Eating Habits'],
        ...data.map(student => [
            student.rollNo,
            student.name,
            student.gender,
            student.class,
            student.riskLevel,
            student.riskPercentage.toString(),
            student.emotionalOverwhelm.toString(),
            student.lonelinessStress.toString(),
            student.depression.toString(),
            student.eatingHabits.toString()
        ])
    ];
    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_risk_assessment.csv';
    a.click();
    window.URL.revokeObjectURL(url);
};
exports.exportToCSV = exportToCSV;
//# sourceMappingURL=studentDataService.js.map