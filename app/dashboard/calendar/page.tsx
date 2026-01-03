"use client";

import { useState, useEffect } from "react";
import { Job } from "@/lib/google-sheets";
import { Badge } from "@/components/ui/badge";

export default function CalendarPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLiveData, setIsLiveData] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      setJobs(data.jobs);
      setIsLiveData(data.isLiveData);
    }
    fetchData();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getJobsForDate = (date: number) => {
    const { year, month } = getDaysInMonth(currentDate);
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return jobs.filter(job => job.date === dateString);
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Calendar
          </h1>
          {!isLiveData && (
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              MOCK DATA
            </Badge>
          )}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={previousMonth}
              className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Previous
            </button>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {monthName}
            </h2>
            <button
              onClick={nextMonth}
              className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-zinc-600 dark:text-zinc-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const date = idx + 1;
                const dayJobs = getJobsForDate(date);
                const isToday =
                  new Date().getDate() === date &&
                  new Date().getMonth() === month &&
                  new Date().getFullYear() === year;

                return (
                  <div
                    key={date}
                    className={`aspect-square border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 ${
                      isToday ? 'bg-blue-50 dark:bg-blue-950 border-blue-500' : ''
                    }`}
                  >
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                      {date}
                    </div>
                    <div className="space-y-1">
                      {dayJobs.map((job) => (
                        <button
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className={`w-full text-left text-xs p-1 rounded truncate transition-colors ${
                            selectedJob?.id === job.id
                              ? 'bg-blue-600 text-white'
                              : job.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
                          }`}
                        >
                          <div className="font-medium truncate">{job.title}</div>
                          <div className="truncate opacity-80">{job.client}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Job Details */}
        {selectedJob && (
          <div className="mt-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Job Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Title</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-50">
                  {selectedJob.title}
                </div>
              </div>
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Client</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-50">
                  {selectedJob.client}
                </div>
              </div>
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Status</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-50">
                  {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                </div>
              </div>
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Price</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-50">
                  ${selectedJob.price}
                </div>
              </div>
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Phone</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-50">
                  {selectedJob.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
                </div>
              </div>
              <div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">Team</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-50">
                  {selectedJob.cleaningTeam.join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
