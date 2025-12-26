import { useState, useEffect } from 'react';

interface DiscordStats {
  online: number;
  total: number;
  loading: boolean;
  error: boolean;
}

export function useDiscordStats(inviteCode: string): DiscordStats {
  const [stats, setStats] = useState<DiscordStats>({
    online: 0,
    total: 0,
    loading: true,
    error: false,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Discord stats');
        }

        const data = await response.json();

        setStats({
          online: data.approximate_presence_count || 0,
          total: data.approximate_member_count || 0,
          loading: false,
          error: false,
        });
      } catch (err) {
        console.error('Error fetching Discord stats:', err);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: true,
        }));
      }
    };

    fetchStats();

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [inviteCode]);

  return stats;
}
