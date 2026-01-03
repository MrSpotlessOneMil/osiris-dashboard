"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Settings {
  spreadsheetId: string;
  hourlyRate: number;
  costPerJob: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    spreadsheetId: '',
    hourlyRate: 25,
    costPerJob: 50
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
      } catch (error) {
        setMessage('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings');
      }
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Settings, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-zinc-600 dark:text-zinc-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Settings
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Configure your dashboard and business parameters
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-zinc-900 dark:text-zinc-50">
                Business Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Spreadsheet ID */}
                <div>
                  <label
                    htmlFor="spreadsheetId"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                  >
                    Google Spreadsheet ID
                  </label>
                  <input
                    type="text"
                    id="spreadsheetId"
                    value={settings.spreadsheetId}
                    onChange={(e) => handleChange('spreadsheetId', e.target.value)}
                    placeholder="Enter your Google Sheets ID"
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    The ID from your Google Sheets URL (optional for mock data mode)
                  </p>
                </div>

                {/* Hourly Rate */}
                <div>
                  <label
                    htmlFor="hourlyRate"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                  >
                    Hourly Labor Rate
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-2 text-zinc-600 dark:text-zinc-400">
                      $
                    </span>
                    <input
                      type="number"
                      id="hourlyRate"
                      value={settings.hourlyRate}
                      onChange={(e) => handleChange('hourlyRate', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Average hourly rate for labor costs
                  </p>
                </div>

                {/* Cost Per Job */}
                <div>
                  <label
                    htmlFor="costPerJob"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                  >
                    Fixed Cost Per Job
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-2 text-zinc-600 dark:text-zinc-400">
                      $
                    </span>
                    <input
                      type="number"
                      id="costPerJob"
                      value={settings.costPerJob}
                      onChange={(e) => handleChange('costPerJob', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Fixed overhead cost per job (materials, supplies, etc.)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              {message && (
                <p className={`text-sm ${message.includes('success') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white rounded-lg font-medium transition-colors"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>

        {/* Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-zinc-50">
              About Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
              <p>
                These settings are used to calculate ROI and profitability metrics across your dashboard.
              </p>
              <p>
                <strong>Spreadsheet ID:</strong> Connect your Google Sheets for live data (currently using mock data).
              </p>
              <p>
                <strong>Hourly Rate:</strong> Used to estimate labor costs based on job duration.
              </p>
              <p>
                <strong>Cost Per Job:</strong> Fixed overhead costs like materials and supplies.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
