/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { useAccessor, useChatThreadsState } from '../util/services.js';
import { ThreadType } from '../../../chatThreadService.js';
import { GitBranch, Clock, MessageSquare } from 'lucide-react';

export const BranchHistory = ({ threadId }: { threadId: string }) => {
  const accessor = useAccessor();
  const chatThreadsService = accessor.get('IChatThreadService');
  const threadsState = useChatThreadsState();
  
  const branchHistory = chatThreadsService.getBranchHistory(threadId);
  
  if (branchHistory.length === 0) {
    return null; // Don't show anything if no branches
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getBranchIcon = (branch: ThreadType) => {
    // You could add different icons based on branch type in the future
    return <GitBranch size={12} className="text-void-fg-3" />;
  };

  const getBranchStatus = (branch: ThreadType) => {
    const messageCount = branch.messages.filter(m => m.role === 'user' || m.role === 'assistant').length;
    return {
      messageCount,
      lastActivity: branch.lastModified
    };
  };

  return (
    <div className="border-t border-void-stroke-1 pt-3 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch size={14} className="text-void-fg-3" />
        <span className="text-sm font-medium text-void-fg-2">Branch History</span>
        <span className="text-xs text-void-fg-3">({branchHistory.length})</span>
      </div>
      
      <div className="space-y-2">
        {branchHistory.map((branch) => {
          const status = getBranchStatus(branch);
          return (
            <div
              key={branch.id}
              className="flex items-center justify-between p-2 bg-void-bg-2 hover:bg-void-bg-3 rounded border border-void-stroke-1 cursor-pointer transition-colors"
              onClick={() => chatThreadsService.switchToThread(branch.id)}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {getBranchIcon(branch)}
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-void-fg-2 truncate">
                    {branch.branchNote || 'Untitled branch'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-void-fg-3">
                    <div className="flex items-center gap-1">
                      <MessageSquare size={10} />
                      <span>{status.messageCount} messages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} />
                      <span>{formatTime(status.lastActivity)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-void-fg-3 ml-2">
                →
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
