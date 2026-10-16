'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProgressData } from './store';
import { supabase, isSupabaseConfigured, signInWithGoogle as sbSignInWithGoogle, signOut as sbSignOut } from './supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student';
  department?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  progress: UserProgressData;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithCredentials: (email: string, name?: string) => Promise<void>;
  logout: () => void;
  toggleSaveResource: (id: string) => Promise<void>;
  toggleCompleteResource: (id: string) => Promise<void>;
  toggleTrackCertification: (id: string) => Promise<void>;
  toggleEnrollDomain: (id: string) => Promise<void>;
  toggleRsvpActivity: (id: string) => Promise<void>;
  toggleCompleteFoundation: (id: string) => Promise<void>;
  updateUserNotes: (notes: string) => Promise<void>;
}

const defaultProgress: UserProgressData = {
  userId: '',
  enrolledDomains: [],
  savedResourceIds: [],
  completedResourceIds: [],
  trackedCertificationIds: [],
  activeProjectIds: [],
  rsvpdActivityIds: [],
  completedFoundationIds: [],
  notes: ''
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgressData>(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from session or Supabase
  useEffect(() => {
    try {
      if (isSupabaseConfigured) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            const sbUser: User = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
              email: session.user.email || '',
              role: 'student',
              department: session.user.user_metadata?.department || '',
              avatar: session.user.user_metadata?.avatar_url
            };
            setUser(sbUser);
            localStorage.setItem('0xnull_user', JSON.stringify(sbUser));
          }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            const sbUser: User = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
              email: session.user.email || '',
              role: 'student',
              department: session.user.user_metadata?.department || '',
              avatar: session.user.user_metadata?.avatar_url
            };
            setUser(sbUser);
            localStorage.setItem('0xnull_user', JSON.stringify(sbUser));
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem('0xnull_user');
          }
        });

        return () => subscription.unsubscribe();
      }

      // Check local storage if already authenticated
      const storedUser = localStorage.getItem('0xnull_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        // Force role to student — admin is strictly managed via HttpOnly session cookies
        parsed.role = 'student';
        setUser(parsed);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch progress from API only when a valid user ID is present
  useEffect(() => {
    if (!user || !user.id) {
      setProgress(defaultProgress);
      return;
    }
    fetch(`/api/user-progress?userId=${encodeURIComponent(user.id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProgress(data.data);
        }
      })
      .catch((err) => console.error('Failed to load user progress', err));
  }, [user]);

  const saveProgressToApi = async (updated: Partial<UserProgressData>) => {
    if (!user || !user.id) return;
    const next = { ...progress, ...updated };
    setProgress(next);
    try {
      await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...next, userId: user.id })
      });
    } catch (err) {
      console.error('Failed to save progress to API', err);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const res = await sbSignInWithGoogle();
        if (res.error) {
          throw res.error;
        }
        return; // Browser redirects to Google OAuth
      }
      throw new Error('Google OAuth requires Supabase configuration in environment variables.');
    } catch (e: any) {
      setIsLoading(false);
      throw e;
    }
  };

  const loginWithCredentials = async (email: string, name?: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanEmail = email.trim().toLowerCase();
    const resolvedName = name?.trim() || cleanEmail.split('@')[0];

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: resolvedName,
      email: cleanEmail,
      role: 'student',
      department: ''
    };

    setUser(newUser);
    localStorage.setItem('0xnull_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await sbSignOut();
    }
    setUser(null);
    setProgress(defaultProgress);
    localStorage.removeItem('0xnull_user');
  };

  const toggleSaveResource = async (id: string) => {
    const list = progress.savedResourceIds.includes(id)
      ? progress.savedResourceIds.filter((item) => item !== id)
      : [...progress.savedResourceIds, id];
    await saveProgressToApi({ savedResourceIds: list });
  };

  const toggleCompleteResource = async (id: string) => {
    const list = progress.completedResourceIds.includes(id)
      ? progress.completedResourceIds.filter((item) => item !== id)
      : [...progress.completedResourceIds, id];
    await saveProgressToApi({ completedResourceIds: list });
  };

  const toggleTrackCertification = async (id: string) => {
    const list = progress.trackedCertificationIds.includes(id)
      ? progress.trackedCertificationIds.filter((item) => item !== id)
      : [...progress.trackedCertificationIds, id];
    await saveProgressToApi({ trackedCertificationIds: list });
  };

  const toggleEnrollDomain = async (id: string) => {
    const list = progress.enrolledDomains.includes(id)
      ? progress.enrolledDomains.filter((item) => item !== id)
      : [...progress.enrolledDomains, id];
    await saveProgressToApi({ enrolledDomains: list });
  };

  const toggleRsvpActivity = async (id: string) => {
    const list = progress.rsvpdActivityIds.includes(id)
      ? progress.rsvpdActivityIds.filter((item) => item !== id)
      : [...progress.rsvpdActivityIds, id];
    await saveProgressToApi({ rsvpdActivityIds: list });
  };

  const toggleCompleteFoundation = async (id: string) => {
    const list = progress.completedFoundationIds.includes(id)
      ? progress.completedFoundationIds.filter((item) => item !== id)
      : [...progress.completedFoundationIds, id];
    await saveProgressToApi({ completedFoundationIds: list });
  };

  const updateUserNotes = async (notes: string) => {
    await saveProgressToApi({ notes });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        progress,
        isLoading,
        loginWithGoogle,
        loginWithCredentials,
        logout,
        toggleSaveResource,
        toggleCompleteResource,
        toggleTrackCertification,
        toggleEnrollDomain,
        toggleRsvpActivity,
        toggleCompleteFoundation,
        updateUserNotes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
