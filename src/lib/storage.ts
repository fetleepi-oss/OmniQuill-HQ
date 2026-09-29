/**
 * Unified Database Storage Layer with Vercel KV / Upstash Redis support
 * and local in-memory fallback for development.
 * 
 * Works automatically with:
 * - Upstash Redis / Vercel KV (KV_REST_API_URL & KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN)
 * - Local in-memory store for instant local development without credentials
 */

interface SupportTicket {
  id: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  aiSuggestedResolution?: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  type: 'billing' | 'content' | 'support' | 'security';
  timestamp: string;
  details: string;
}

interface UserSubscriptionRecord {
  plan: 'STARTER' | 'PRO' | 'BUSINESS';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
  provider: 'Paddle' | 'Chapa' | 'None';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  txRef?: string;
  updatedAt: string;
}

// In-memory fallbacks
const localUsedChapaTxRefs = new Set<string>();

const localSupportTickets: SupportTicket[] = [
  {
    id: 'TICK-8021',
    email: 'alex@startup.io',
    subject: 'Brand DNA tone not matching technical terms',
    category: 'Brand DNA',
    message: 'We added Kubernetes and microservice terms to our Brand DNA, but output still feels too casual.',
    priority: 'medium',
    status: 'resolved',
    createdAt: new Date(Date.now() - 3600 * 24 * 1000).toISOString(),
    aiSuggestedResolution: 'Resolution: Updated system prompt temperature to 0.4 and added strict industry terminology locks under Brand Guidelines.'
  }
];

const localAuditTrail: AuditLogItem[] = [
  {
    id: 'AUD-001',
    action: 'Workspace Initialized',
    type: 'security',
    timestamp: new Date().toISOString(),
    details: 'Workspace security keys, Brand DNA engine, and payment gateways verified.'
  }
];

let localSubscription: UserSubscriptionRecord = {
  plan: 'PRO',
  status: 'ACTIVE',
  provider: 'Paddle',
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
  cancelAtPeriodEnd: false,
  updatedAt: new Date().toISOString(),
};

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return { url: url.replace(/\/$/, ''), token };
  }
  return null;
}

async function callRedisCommand(command: string, ...args: any[]): Promise<any> {
  const config = getRedisConfig();
  if (!config) return null;

  try {
    const res = await fetch(`${config.url}/${command}/${args.map(a => encodeURIComponent(String(a))).join('/')}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    });
    if (!res.ok) {
      console.warn(`Upstash/KV command ${command} failed with status:`, res.status);
      return null;
    }
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.warn(`Upstash/KV command ${command} error:`, err);
    return null;
  }
}

export const db = {
  /**
   * Used Chapa Transaction Reference (Single-Use Guarantee)
   */
  async isChapaTxRefUsed(txRef: string): Promise<boolean> {
    const config = getRedisConfig();
    if (config) {
      const isMember = await callRedisCommand('SISMEMBER', 'chapa:used_tx_refs', txRef);
      if (isMember !== null) {
        return isMember === 1;
      }
    }
    return localUsedChapaTxRefs.has(txRef);
  },

  async markChapaTxRefUsed(txRef: string): Promise<void> {
    const config = getRedisConfig();
    if (config) {
      await callRedisCommand('SADD', 'chapa:used_tx_refs', txRef);
    }
    localUsedChapaTxRefs.add(txRef);
  },

  /**
   * Support Tickets
   */
  async getSupportTickets(): Promise<SupportTicket[]> {
    const config = getRedisConfig();
    if (config) {
      const items = await callRedisCommand('LRANGE', 'support:tickets', 0, 99);
      if (Array.isArray(items) && items.length > 0) {
        return items.map((raw) => {
          try {
            return typeof raw === 'string' ? JSON.parse(raw) : raw;
          } catch {
            return raw;
          }
        });
      }
    }
    return localSupportTickets;
  },

  async addSupportTicket(ticket: SupportTicket): Promise<void> {
    const config = getRedisConfig();
    if (config) {
      await callRedisCommand('LPUSH', 'support:tickets', JSON.stringify(ticket));
    }
    localSupportTickets.unshift(ticket);
  },

  /**
   * Audit Trail
   */
  async getAuditTrail(): Promise<AuditLogItem[]> {
    const config = getRedisConfig();
    if (config) {
      const items = await callRedisCommand('LRANGE', 'audit:trail', 0, 99);
      if (Array.isArray(items) && items.length > 0) {
        return items.map((raw) => {
          try {
            return typeof raw === 'string' ? JSON.parse(raw) : raw;
          } catch {
            return raw;
          }
        });
      }
    }
    return localAuditTrail;
  },

  async addAuditLog(entry: AuditLogItem): Promise<void> {
    const config = getRedisConfig();
    if (config) {
      await callRedisCommand('LPUSH', 'audit:trail', JSON.stringify(entry));
    }
    localAuditTrail.unshift(entry);
  },

  /**
   * Subscription Status
   */
  async getSubscription(): Promise<UserSubscriptionRecord> {
    const config = getRedisConfig();
    if (config) {
      const raw = await callRedisCommand('GET', 'billing:subscription');
      if (raw) {
        try {
          return typeof raw === 'string' ? JSON.parse(raw) : raw;
        } catch {
          // fallback
        }
      }
    }
    return localSubscription;
  },

  async updateSubscription(partial: Partial<UserSubscriptionRecord>): Promise<UserSubscriptionRecord> {
    const current = await this.getSubscription();
    const updated: UserSubscriptionRecord = {
      ...current,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    const config = getRedisConfig();
    if (config) {
      await callRedisCommand('SET', 'billing:subscription', JSON.stringify(updated));
    }
    localSubscription = updated;
    return updated;
  }
};
