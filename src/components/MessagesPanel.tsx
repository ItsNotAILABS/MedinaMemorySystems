'use client';

import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import type { MessageDraft, ApprovalRequest } from '@/types';

interface MessagesPanelState {
  drafts: MessageDraft[];
  sent: MessageDraft[];
  pending: ApprovalRequest[];
  loading: boolean;
  error: string | null;
}

export default function MessagesPanel() {
  const [state, setState] = useState<MessagesPanelState>({
    drafts: [],
    sent: [],
    pending: [],
    loading: true,
    error: null,
  });

  const [activeTab, setActiveTab] = useState<'compose' | 'drafts' | 'sent' | 'pending'>('compose');
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    body: '',
    channel: 'email' as MessageDraft['channel'],
  });

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [draftsRes, sentRes, pendingRes] = await Promise.all([
        fetch('/api/message?action=list'),
        fetch('/api/message?action=sent'),
        fetch('/api/message?action=pending'),
      ]);

      const draftsData = await draftsRes.json() as { drafts?: MessageDraft[] };
      const sentData = await sentRes.json() as { messages?: MessageDraft[] };
      const pendingData = await pendingRes.json() as { approvals?: ApprovalRequest[] };

      setState({
        drafts: draftsData.drafts || [],
        sent: sentData.messages || [],
        pending: pendingData.approvals || [],
        loading: false,
        error: null,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: String(err),
      }));
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleCreateDraft = async () => {
    if (!newMessage.to.trim() || !newMessage.body.trim()) return;

    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          to: newMessage.to.split(',').map(t => t.trim()),
          body: newMessage.body,
          channel: newMessage.channel,
          subject: newMessage.subject || undefined,
        }),
      });

      if (res.ok) {
        setNewMessage({ to: '', subject: '', body: '', channel: 'email' });
        setActiveTab('drafts');
        void loadData();
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: String(err) }));
    }
  };

  const handleSend = async (draftId: string, requireApproval: boolean = false) => {
    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          id: draftId,
          requireApproval,
        }),
      });

      if (res.ok) {
        void loadData();
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: String(err) }));
    }
  };

  const handleApprove = async (approvalId: string) => {
    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          approvalId,
        }),
      });

      if (res.ok) {
        void loadData();
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: String(err) }));
    }
  };

  const handleReject = async (approvalId: string) => {
    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          approvalId,
        }),
      });

      if (res.ok) {
        void loadData();
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: String(err) }));
    }
  };

  const handleDelete = async (draftId: string) => {
    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          id: draftId,
        }),
      });

      if (res.ok) {
        void loadData();
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: String(err) }));
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d15]">
        <div className="flex items-center gap-2">
          <span className="text-sky-400 text-lg">✉️</span>
          <h1 className="text-sm font-semibold text-slate-200">Messages</h1>
          <span className="text-xs text-slate-500">Send & Manage</span>
        </div>
        <button
          onClick={() => void loadData()}
          className="px-3 py-1.5 text-xs bg-[#1e1e2e] text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1e1e2e] bg-[#0d0d15]">
        {(['compose', 'drafts', 'sent', 'pending'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'flex-1 px-4 py-2 text-xs font-medium transition-colors',
              activeTab === tab
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'pending' && state.pending.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px]">
                {state.pending.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {state.loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-slate-500">Loading...</span>
          </div>
        ) : state.error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <span className="text-red-400 text-sm">{state.error}</span>
          </div>
        ) : (
          <>
            {/* Compose Tab */}
            {activeTab === 'compose' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Channel</label>
                  <select
                    value={newMessage.channel}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, channel: e.target.value as MessageDraft['channel'] }))}
                    className="w-full px-3 py-2 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 outline-none focus:border-sky-500"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="in-app">In-App</option>
                    <option value="push">Push</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">To (comma-separated)</label>
                  <input
                    type="text"
                    value={newMessage.to}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
                    placeholder="recipient@example.com"
                    className="w-full px-3 py-2 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-sky-500"
                  />
                </div>

                {newMessage.channel === 'email' && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Subject</label>
                    <input
                      type="text"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Message subject"
                      className="w-full px-3 py-2 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-sky-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Body</label>
                  <textarea
                    value={newMessage.body}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="Write your message..."
                    rows={6}
                    className="w-full px-3 py-2 bg-[#12121a] border border-[#1e1e2e] rounded-lg text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-sky-500 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => void handleCreateDraft()}
                    disabled={!newMessage.to.trim() || !newMessage.body.trim()}
                    className={clsx(
                      'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      newMessage.to.trim() && newMessage.body.trim()
                        ? 'bg-sky-600 hover:bg-sky-500 text-white'
                        : 'bg-[#1e1e2e] text-slate-600 cursor-not-allowed'
                    )}
                  >
                    Save Draft
                  </button>
                </div>
              </div>
            )}

            {/* Drafts Tab */}
            {activeTab === 'drafts' && (
              <div className="space-y-3">
                {state.drafts.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">No drafts</div>
                ) : (
                  state.drafts.map((draft) => (
                    <div key={draft.id} className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">{draft.channel.toUpperCase()}</span>
                        <span className="text-xs text-slate-500">{draft.status}</span>
                      </div>
                      <div className="text-sm text-slate-300 mb-1">To: {draft.to.join(', ')}</div>
                      {draft.subject && (
                        <div className="text-sm text-slate-400 mb-2">Subject: {draft.subject}</div>
                      )}
                      <div className="text-xs text-slate-500 line-clamp-2 mb-3">{draft.body}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => void handleSend(draft.id)}
                          className="px-3 py-1 bg-sky-600/20 text-sky-400 text-xs rounded hover:bg-sky-600/30 transition-colors"
                        >
                          Send
                        </button>
                        <button
                          onClick={() => void handleSend(draft.id, true)}
                          className="px-3 py-1 bg-amber-600/20 text-amber-400 text-xs rounded hover:bg-amber-600/30 transition-colors"
                        >
                          Send w/ Approval
                        </button>
                        <button
                          onClick={() => void handleDelete(draft.id)}
                          className="px-3 py-1 bg-red-600/20 text-red-400 text-xs rounded hover:bg-red-600/30 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sent Tab */}
            {activeTab === 'sent' && (
              <div className="space-y-3">
                {state.sent.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">No sent messages</div>
                ) : (
                  state.sent.map((msg) => (
                    <div key={msg.id} className="bg-[#12121a] border border-[#1e1e2e] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">{msg.channel.toUpperCase()}</span>
                        <span className={clsx(
                          'text-xs',
                          msg.status === 'sent' ? 'text-green-400' : 'text-red-400'
                        )}>
                          {msg.status}
                        </span>
                      </div>
                      <div className="text-sm text-slate-300 mb-1">To: {msg.to.join(', ')}</div>
                      <div className="text-xs text-slate-500 line-clamp-2">{msg.body}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Tab */}
            {activeTab === 'pending' && (
              <div className="space-y-3">
                {state.pending.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">No pending approvals</div>
                ) : (
                  state.pending.map((approval) => (
                    <div key={approval.id} className="bg-[#12121a] border border-amber-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-amber-400">⚠️ PENDING APPROVAL</span>
                        <span className="text-xs text-slate-500">
                          {new Date(approval.requestedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-slate-200 mb-2">{approval.title}</div>
                      <div className="text-xs text-slate-500 mb-3">{approval.description}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => void handleApprove(approval.id)}
                          className="px-4 py-1.5 bg-green-600/20 text-green-400 text-xs rounded hover:bg-green-600/30 transition-colors"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => void handleReject(approval.id)}
                          className="px-4 py-1.5 bg-red-600/20 text-red-400 text-xs rounded hover:bg-red-600/30 transition-colors"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
