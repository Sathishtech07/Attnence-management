/**
 * ATTENDX - DATA STORE MODULE
 * Handles LocalStorage persistence, seed datasets, and analytical calculations.
 */

const STORAGE_KEY = 'attendx_data_v2';

// Default Sample Dataset Generator
function generateSampleData() {
    const classes = [
        { id: 'CLS-10A', name: 'Grade 10 - Section A', teacher: 'Prof. Marcus Vance', room: 'Room 201' },
        { id: 'CLS-10B', name: 'Grade 10 - Section B', teacher: 'Dr. Elena Rostova', room: 'Room 204' },
        { id: 'CLS-11CS', name: 'Grade 11 - Computer Science', teacher: 'Alan Turing', room: 'Lab 3' },
        { id: 'CLS-12PHY', name: 'Grade 12 - Physics Core', teacher: 'Marie Curie', room: 'Lab 1' }
    ];

    const students = [
        { id: 'STU-101', roll: '101', name: 'Alex Rivera', classId: 'CLS-10A', gender: 'Male', email: 'alex.r@example.com', phone: '+1 555-0123', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
        { id: 'STU-102', roll: '102', name: 'Sophia Chen', classId: 'CLS-10A', gender: 'Female', email: 'sophia.c@example.com', phone: '+1 555-0124', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
        { id: 'STU-103', roll: '103', name: 'Liam Johnson', classId: 'CLS-10A', gender: 'Male', email: 'liam.j@example.com', phone: '+1 555-0125', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
        { id: 'STU-104', roll: '104', name: 'Emma Watson', classId: 'CLS-10A', gender: 'Female', email: 'emma.w@example.com', phone: '+1 555-0126', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
        { id: 'STU-105', roll: '105', name: 'Noah Davis', classId: 'CLS-10A', gender: 'Male', email: 'noah.d@example.com', phone: '+1 555-0127', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
        
        { id: 'STU-201', roll: '201', name: 'Olivia Martinez', classId: 'CLS-10B', gender: 'Female', email: 'olivia.m@example.com', phone: '+1 555-0201', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
        { id: 'STU-202', roll: '202', name: 'Ethan Brown', classId: 'CLS-10B', gender: 'Male', email: 'ethan.b@example.com', phone: '+1 555-0202', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80' },
        { id: 'STU-203', roll: '203', name: 'Ava Taylor', classId: 'CLS-10B', gender: 'Female', email: 'ava.t@example.com', phone: '+1 555-0203', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
        { id: 'STU-204', roll: '204', name: 'Lucas Anderson', classId: 'CLS-10B', gender: 'Male', email: 'lucas.a@example.com', phone: '+1 555-0204', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80' },

        { id: 'STU-301', roll: '301', name: 'Isabella Garcia', classId: 'CLS-11CS', gender: 'Female', email: 'isabella.g@example.com', phone: '+1 555-0301', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
        { id: 'STU-302', roll: '302', name: 'Mason Wilson', classId: 'CLS-11CS', gender: 'Male', email: 'mason.w@example.com', phone: '+1 555-0302', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
        { id: 'STU-303', roll: '303', name: 'Mia White', classId: 'CLS-11CS', gender: 'Female', email: 'mia.w@example.com', phone: '+1 555-0303', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80' },

        { id: 'STU-401', roll: '401', name: 'James Thomas', classId: 'CLS-12PHY', gender: 'Male', email: 'james.t@example.com', phone: '+1 555-0401', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80' },
        { id: 'STU-402', roll: '402', name: 'Charlotte Lee', classId: 'CLS-12PHY', gender: 'Female', email: 'charlotte.l@example.com', phone: '+1 555-0402', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' }
    ];

    // Generate historical attendance logs for the past 14 days
    const attendanceLogs = [];
    const today = new Date();
    const statuses = ['P', 'P', 'P', 'P', 'A', 'L', 'P', 'P', 'P', 'P', 'P']; // Weighted towards Present

    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        
        // Skip weekends
        if (d.getDay() === 0 || d.getDay() === 6) continue;

        const dateStr = d.toISOString().split('T')[0];

        classes.forEach(cls => {
            const classStudents = students.filter(s => s.classId === cls.id);
            const records = {};

            classStudents.forEach(stu => {
                // Force a couple of specific students to have lower attendance for demo testing
                if (stu.id === 'STU-105' && i % 2 === 0) {
                    records[stu.id] = { status: 'A', remarks: 'Unexcused Absence' };
                } else if (stu.id === 'STU-203' && i % 3 === 0) {
                    records[stu.id] = { status: 'A', remarks: 'Medical Leave' };
                } else {
                    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    records[stu.id] = { status: randomStatus, remarks: randomStatus === 'L' ? '10 mins late' : '' };
                }
            });

            attendanceLogs.push({
                id: `LOG-${dateStr}-${cls.id}`,
                date: dateStr,
                classId: cls.id,
                session: 'General',
                records: records,
                timestamp: d.getTime()
            });
        });
    }

    return {
        classes: classes,
        students: students,
        attendanceLogs: attendanceLogs,
        settings: { lowAttendanceThreshold: 75 }
    };
}

class AttendanceStore {
    constructor() {
        this.init();
    }

    init() {
        const local = localStorage.getItem(STORAGE_KEY);
        if (!local) {
            this.data = generateSampleData();
            this.save();
        } else {
            try {
                this.data = JSON.parse(local);
            } catch (e) {
                console.error("Failed to parse localStorage, resetting to defaults", e);
                this.data = generateSampleData();
                this.save();
            }
        }
    }

    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }

    // Class Operations
    getClasses() {
        return this.data.classes || [];
    }

    getClassById(id) {
        return this.data.classes.find(c => c.id === id);
    }

    addClass(clsObj) {
        clsObj.id = 'CLS-' + Date.now();
        this.data.classes.push(clsObj);
        this.save();
        return clsObj;
    }

    // Student Operations
    getStudents() {
        return this.data.students || [];
    }

    getStudentById(id) {
        return this.data.students.find(s => s.id === id);
    }

    getStudentsByClass(classId) {
        if (classId === 'ALL') return this.getStudents();
        return this.data.students.filter(s => s.classId === classId);
    }

    addStudent(studentObj) {
        studentObj.id = 'STU-' + Date.now();
        if (!studentObj.avatar) {
            studentObj.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentObj.name}`;
        }
        this.data.students.push(studentObj);
        this.save();
        return studentObj;
    }

    updateStudent(studentObj) {
        const index = this.data.students.findIndex(s => s.id === studentObj.id);
        if (index !== -1) {
            this.data.students[index] = { ...this.data.students[index], ...studentObj };
            this.save();
            return true;
        }
        return false;
    }

    deleteStudent(studentId) {
        this.data.students = this.data.students.filter(s => s.id !== studentId);
        this.save();
    }

    // Attendance Log Operations
    getAttendanceLogs() {
        return this.data.attendanceLogs || [];
    }

    getLogForDateAndClass(dateStr, classId, session = 'General') {
        return this.data.attendanceLogs.find(log => log.date === dateStr && log.classId === classId && log.session === session);
    }

    saveAttendanceRecord(dateStr, classId, session, recordsMap) {
        let existingLog = this.getLogForDateAndClass(dateStr, classId, session);

        if (existingLog) {
            existingLog.records = recordsMap;
            existingLog.timestamp = Date.now();
        } else {
            const newLog = {
                id: `LOG-${dateStr}-${classId}-${session}`,
                date: dateStr,
                classId: classId,
                session: session,
                records: recordsMap,
                timestamp: Date.now()
            };
            this.data.attendanceLogs.push(newLog);
        }
        this.save();
    }

    // Analytical Calculations
    calculateStudentStats(studentId) {
        const logs = this.data.attendanceLogs;
        let totalSessions = 0;
        let present = 0;
        let absent = 0;
        let late = 0;
        let excused = 0;

        logs.forEach(log => {
            if (log.records && log.records[studentId]) {
                totalSessions++;
                const st = log.records[studentId].status;
                if (st === 'P') present++;
                else if (st === 'A') absent++;
                else if (st === 'L') { late++; present++; } // Count late as present for % calculation
                else if (st === 'E') excused++;
            }
        });

        const rate = totalSessions > 0 ? Math.round(((present) / totalSessions) * 100) : 100;

        return {
            totalSessions,
            present,
            absent,
            late,
            excused,
            rate
        };
    }

    getDashboardMetrics() {
        const todayStr = new Date().toISOString().split('T')[0];
        const students = this.getStudents();
        const totalStudents = students.length;

        // Today's stats
        const todayLogs = this.data.attendanceLogs.filter(l => l.date === todayStr);
        let presentToday = 0;
        let absentToday = 0;

        todayLogs.forEach(log => {
            Object.values(log.records).forEach(rec => {
                if (rec.status === 'P' || rec.status === 'L') presentToday++;
                else if (rec.status === 'A') absentToday++;
            });
        });

        const threshold = this.data.settings?.lowAttendanceThreshold || 75;
        let lowAttendanceCount = 0;

        students.forEach(s => {
            const stats = this.calculateStudentStats(s.id);
            if (stats.totalSessions > 0 && stats.rate < threshold) {
                lowAttendanceCount++;
            }
        });

        return {
            totalStudents,
            presentToday,
            absentToday,
            lowAttendanceCount,
            todayLogs
        };
    }

    // Settings & Backup
    resetToSampleData() {
        this.data = generateSampleData();
        this.save();
    }

    exportBackupJSON() {
        return JSON.stringify(this.data, null, 2);
    }

    importBackupJSON(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed.students && parsed.classes && parsed.attendanceLogs) {
                this.data = parsed;
                this.save();
                return true;
            }
        } catch (e) {
            console.error("Invalid JSON format", e);
        }
        return false;
    }
}

// Global Store Singleton
window.store = new AttendanceStore();
