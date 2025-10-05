/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { useAccessor } from '../util/services.js';
import { ThreadType } from '../../../chatThreadService.js';
import { GitBranch, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export const BranchMarker = ({ branch }: { branch: ThreadType }) => {
  const accessor = useAccessor();
  const chatThreadsService = accessor.get('IChatThreadService');

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

  const getBranchStatus = (branch: ThreadType) => {
    const messageCount = branch.messages.filter(m => m.role === 'user' || m.role === 'assistant').length;
    return {
      messageCount,
      lastActivity: branch.lastModified
    };
  };

  const status = getBranchStatus(branch);

  return (
    <div className="flex items-center justify-center py-2">
      <div 
        className="flex items-center gap-3 p-3 bg-void-bg-2 hover:bg-void-bg-3 rounded-lg border border-void-stroke-1 cursor-pointer transition-colors group max-w-md"
        onClick={() => chatThreadsService.switchToThread(branch.id)}
      >
        <div className="flex items-center gap-2">
          <GitBranch size={16} className="text-void-accent" />
          <div className="text-sm font-medium text-void-fg-2">
            Branch: {branch.branchNote || 'Untitled branch'}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-void-fg-3">
          <div className="flex items-center gap-1">
            <MessageSquare size={10} />
            <span>{status.messageCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={10} />
            <span>{formatTime(status.lastActivity)}</span>
          </div>
        </div>
        
        <ArrowRight size={14} className="text-void-fg-3 group-hover:text-void-accent transition-colors" />
      </div>
    </div>
  );
};
