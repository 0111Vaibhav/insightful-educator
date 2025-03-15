
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";

// Types matching our student-data.json structure
export type GradeData = {
  id: number;
  name: string;
  students: any[];
  averageGrade: number;
  recentAssignments: string[];
};

export type PerformanceData = {
  monthly: Array<{
    month: string;
    average: number;
  }>;
  classComparison: Array<{
    class: string;
    thisMonth: number;
    lastMonth: number;
  }>;
};

export type FeedbackTemplate = {
  id: number;
  name: string;
  content: string;
};

export const fetchClasses = async (): Promise<GradeData[]> => {
  try {
    const classesCollection = collection(db, "classes");
    const classesSnapshot = await getDocs(classesCollection);
    return classesSnapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      ...doc.data()
    }) as GradeData);
  } catch (error) {
    console.error("Error fetching classes:", error);
    // Return fallback data similar to student-data.json
    return [];
  }
};

export const fetchPerformance = async (): Promise<PerformanceData> => {
  try {
    const performanceDoc = doc(db, "analytics", "performance");
    const performanceSnapshot = await getDoc(performanceDoc);
    
    if (performanceSnapshot.exists()) {
      return performanceSnapshot.data() as PerformanceData;
    } else {
      throw new Error("Performance data not found");
    }
  } catch (error) {
    console.error("Error fetching performance:", error);
    // Return fallback data
    return {
      monthly: [],
      classComparison: []
    };
  }
};

export const fetchFeedbackTemplates = async (): Promise<FeedbackTemplate[]> => {
  try {
    const templatesCollection = collection(db, "feedbackTemplates");
    const templatesSnapshot = await getDocs(templatesCollection);
    return templatesSnapshot.docs.map(doc => ({
      id: parseInt(doc.id),
      ...doc.data()
    }) as FeedbackTemplate);
  } catch (error) {
    console.error("Error fetching feedback templates:", error);
    return [];
  }
};

export const fetchStudents = async () => {
  try {
    // Get all students from all classes
    const classesCollection = collection(db, "classes");
    const classesSnapshot = await getDocs(classesCollection);
    
    // Extract students from all classes
    const allStudents = classesSnapshot.docs.flatMap(doc => {
      const classData = doc.data();
      return classData.students || [];
    });
    
    return allStudents;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};
