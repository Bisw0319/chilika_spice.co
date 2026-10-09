import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Clock,
  User,
  Globe,
  AlertCircle,
  Database,
  Lock
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getAuditLogs({ limit: 100 });
      setLogs(Array.isArray(data) ? data : data.logs || []);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
      setError(err.message || 'Unable to load security audit trail. Verify admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !searchTerm ||
      (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.userEmail && log.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.ipAddress && log.ipAddress.includes(searchTerm)) ||
      (log.resourceType && log.resourceType.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const matchesStatus = filterStatus === 'ALL' || log.status === filterStatus;

    return matchesSearch && matchesAction && matchesStatus;
  });

  const getActionBadgeColor = (action, status) => {
    if (status === 'FAILURE' || status === 'BLOCKED') {
      return 'bg-red-100 text-red-700 border-red-200';
    }
    if (action.includes('DELETE') || action.includes('REVOKE')) {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    if (action.includes('LOGIN') || action.includes('AUTH')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (action.includes('UPDATE') || action.includes('EDIT')) {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    if (action.includes('CREATE') || action.includes('UPLOAD')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
            SUCCESS
          </span>
        );
      case 'FAILURE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
            FAILURE
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
            <ShieldAlert className="w-3 h-3 mr-1 text-red-600" />
            BLOCKED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            {status || 'UNKNOWN'}
          </span>
        );
    }
  };

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-spice-crimson/10 rounded-xl text-spice-crimson">
              <Lock className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold font-serif text-spice-brown">
              Security Audit Trail & OWASP Controls
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Immutable administrative event logging verifying authentication, RBAC authorizations, mutations, and session security.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-spice-charcoal hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Total Audited Events</span>
            <Database className="w-4 h-4 text-spice-crimson" />
          </div>
          <div className="text-2xl font-bold text-spice-brown">{logs.length}</div>
          <div className="text-[10px] text-gray-400 mt-1">Latest 100 immutable ledger records</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Successful Actions</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {logs.filter((l) => l.status === 'SUCCESS').length}
          </div>
          <div className="text-[10px] text-emerald-600/70 mt-1">Authorized admin operations</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Failed Attempts</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {logs.filter((l) => l.status === 'FAILURE').length}
          </div>
          <div className="text-[10px] text-amber-600/70 mt-1">Rejected credentials or invalid inputs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Blocked & Suspicious</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">
            {logs.filter((l) => l.status === 'BLOCKED').length}
          </div>
          <div className="text-[10px] text-red-600/70 mt-1">Rate limited or token revoked</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email, IP, or resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-spice-crimson/20 focus:border-spice-crimson"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-spice-crimson bg-white"
          >
            <option value="ALL">All Actions ({logs.length})</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-spice-crimson bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILURE">Failure</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-spice-crimson" />
            <p className="text-xs">Loading encrypted audit trail...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">
            <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Database className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-semibold">No audit logs match current filters</p>
            <p className="text-xs mt-1">Actions performed by authenticated administrators will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Admin / Principal</th>
                  <th className="px-4 py-3">Target Scope</th>
                  <th className="px-4 py-3">IP & Client</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredLogs.map((log) => {
                  const dateObj = new Date(log.timestamp || log.createdAt);
                  return (
                    <tr key={log._id || log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5 text-gray-600">
                          <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="font-mono text-[11px]">
                            {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {dateObj.toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-wide font-mono ${getActionBadgeColor(
                            log.action,
                            log.status
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <div>
                            <span className="font-semibold text-gray-800 block text-xs">
                              {log.userEmail || 'Anonymous'}
                            </span>
                            {log.userRole && (
                              <span className="text-[9px] uppercase tracking-wider font-bold text-spice-turmeric">
                                {log.userRole}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium text-gray-900 block text-[11px]">
                            {log.resourceType || 'System'}
                          </span>
                          {log.resourceId && (
                            <span className="text-[10px] font-mono text-gray-400 block truncate max-w-[120px]">
                              ID: {log.resourceId}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1 text-gray-600 font-mono text-[11px]">
                          <Globe className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{log.ipAddress || '127.0.0.1'}</span>
                        </div>
                        {log.userAgent && (
                          <div className="text-[9px] text-gray-400 truncate max-w-[140px]" title={log.userAgent}>
                            {log.userAgent}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(log.status)}
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-gray-100 hover:bg-spice-crimson hover:text-white text-gray-700 rounded-md text-[11px] font-medium transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-spice-crimson/10 rounded-lg text-spice-crimson">
                  <Lock className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm text-spice-brown font-serif">
                  Audit Ledger Record Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Action</span>
                  <span className="font-mono font-bold text-gray-800">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Status</span>
                  <div>{getStatusBadge(selectedLog.status)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Actor Email</span>
                  <span className="text-gray-700 font-medium">{selectedLog.userEmail || 'Anonymous'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">IP Address</span>
                  <span className="font-mono text-gray-700">{selectedLog.ipAddress || '127.0.0.1'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Resource</span>
                  <span className="text-gray-700">{selectedLog.resourceType || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Resource ID</span>
                  <span className="font-mono text-gray-700">{selectedLog.resourceId || 'N/A'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                  Sanitized Metadata / Redacted Payload
                </span>
                <pre className="bg-gray-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-56">
                  {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                </pre>
              </div>

              {selectedLog.userAgent && (
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-0.5">
                    User-Agent Fingerprint
                  </span>
                  <p className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100 break-all">
                    {selectedLog.userAgent}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-spice-charcoal text-white text-xs font-semibold rounded-xl hover:bg-black transition-all"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
