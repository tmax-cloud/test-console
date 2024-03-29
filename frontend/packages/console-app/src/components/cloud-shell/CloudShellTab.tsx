import * as React from 'react';
import { InlineTechPreviewBadge } from '@console/shared';
// import CloudShellTerminal from './CloudShellTerminal';
import HyperCloudShellTerminal from './hypercloud/HyperCloudShellTerminal';
import './CloudShellTab.scss';

const CloudShellTab: React.FC = () => (
  <>
    <div className="co-cloud-shell-tab__header">
      <div className="co-cloud-shell-tab__header-text">OpenShift command line terminal</div>
      <InlineTechPreviewBadge />
    </div>
    <div className="co-cloud-shell-tab__body" id="hypercloudshell-tab-body">
      <HyperCloudShellTerminal />
    </div>
  </>
);

export default CloudShellTab;
