/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Calculator, RefreshCw, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F';

interface SubjectRow {
  id: string;
  name: string;
  grade: Grade;
  credits: number;
}

const GRADE_POINTS: Record<Grade, number> = {
  'A+': 4.00,
  'A': 3.75,
  'A-': 3.50,
  'B+': 3.25,
  'B': 3.00,
  'B-': 2.75,
  'C+': 2.50,
  'C': 2.25,
  'D': 2.00,
  'F': 0.00,
};

const GRADES: Grade[] = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'];

export default function App() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([
    { id: crypto.randomUUID(), name: '', grade: 'A+', credits: 3 },
  ]);

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { id: crypto.randomUUID(), name: '', grade: 'A+', credits: 3 },
    ]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id));
    } else {
      // Reset the single remaining row instead of deleting it
      setSubjects([{ id: crypto.randomUUID(), name: '', grade: 'A+', credits: 3 }]);
    }
  };

  const updateSubject = (id: string, field: keyof SubjectRow, value: any) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const clearAll = () => {
    setSubjects([{ id: crypto.randomUUID(), name: '', grade: 'A+', credits: 3 }]);
  };

  const { cgpa, totalCredits } = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach((s) => {
      const points = GRADE_POINTS[s.grade];
      totalPoints += points * s.credits;
      totalCredits += s.credits;
    });

    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    return { cgpa: cgpa.toFixed(2), totalCredits };
  }, [subjects]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">GradePoint</h1>
              <p className="text-slate-500 text-sm font-medium">University CGPA Calculator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-bottom border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <div className="col-span-1">No.</div>
                <div className="col-span-4 md:col-span-6">Subject Name</div>
                <div className="col-span-3 md:col-span-2 text-center">Grade</div>
                <div className="col-span-3 md:col-span-2 text-center">Credits</div>
                <div className="col-span-1 text-right"></div>
              </div>

              <div className="divide-y divide-slate-100">
                <AnimatePresence initial={false}>
                  {subjects.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="grid grid-cols-12 gap-4 p-4 items-center group"
                    >
                      <div className="col-span-1 text-xs font-bold text-slate-400">
                        {index + 1}
                      </div>
                      <div className="col-span-4 md:col-span-6">
                        <input
                          type="text"
                          placeholder="e.g. Mathematics II"
                          value={subject.name}
                          onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm md:text-base font-medium placeholder:text-slate-300"
                        />
                      </div>
                      
                      <div className="col-span-3 md:col-span-2">
                        <select
                          value={subject.grade}
                          onChange={(e) => updateSubject(subject.id, 'grade', e.target.value as Grade)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-sm font-semibold text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
                        >
                          {GRADES.map((g) => (
                            <option key={g} value={g}>
                              {g} ({GRADE_POINTS[g].toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-3 md:col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={subject.credits}
                          onChange={(e) => updateSubject(subject.id, 'credits', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-sm font-semibold text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div className="col-span-1 text-right">
                        <button
                          onClick={() => removeSubject(subject.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Remove row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                <button
                  onClick={addSubject}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all font-semibold text-sm"
                >
                  <Plus className="w-5 h-5" />
                  Add New Subject
                </button>
              </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-slate-800">Summary</h2>
              </div>

              <div className="space-y-6">
                <div className="text-center p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">Current CGPA</span>
                  <span className="text-5xl font-black text-indigo-600 tracking-tighter">{cgpa}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Total Credits</span>
                    <span className="text-slate-900 font-bold">{totalCredits}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Total Subjects</span>
                    <span className="text-slate-900 font-bold">{subjects.length}</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Status</span>
                    <span className={`font-bold ${parseFloat(cgpa) >= 2.0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {parseFloat(cgpa) >= 2.0 ? 'Good Standing' : 'Academic Warning'}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Grade Standards</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-[11px] font-bold">
                      {Object.entries(GRADE_POINTS).map(([grade, point]) => (
                        <div key={grade} className="flex justify-between pr-4">
                          <span className="text-slate-500">{grade}</span>
                          <span className="text-slate-700">{point.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
