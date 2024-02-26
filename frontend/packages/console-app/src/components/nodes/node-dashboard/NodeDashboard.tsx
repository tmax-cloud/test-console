import * as React from 'react';
import * as _ from 'lodash';
import Dashboard from '@console/shared/src/components/dashboard/Dashboard';
import DashboardGrid from '@console/shared/src/components/dashboard/DashboardGrid';
import { NodeKind } from '@console/internal/module/k8s';
import { LimitRequested } from '@console/shared/src/components/dashboard/utilization-card/UtilizationItem';

import { NodeDashboardContext, HealthCheck } from './NodeDashboardContext';
import InventoryCard from './InventoryCard';
import DetailsCard from './DetailsCard';
import StatusCard from './StatusCard';
import ActivityCard from './ActivityCard';
import UtilizationCard from './UtilizationCard';
import { ToastPopupAlert } from '@console/internal/components/utils/hypercloud/toast-popup-alert';
import { isSingleClusterPerspective } from '@console/internal/hypercloud/perspectives';
import { useTranslation } from 'react-i18next';
import { SHOW_ALERT_IN_SINGLECLUSTER_NODEPAGE } from '@console/internal/hypercloud/auth';
import { getActiveCluster } from '@console/internal/actions/ui';
import { coFetchJSON } from '@console/internal/co-fetch';

const leftCards = [{ Card: DetailsCard }, { Card: InventoryCard }];
const mainCards = [{ Card: StatusCard }, { Card: UtilizationCard }];
const rightCards = [{ Card: ActivityCard }];

export enum ActionType {
  CPU_LIMIT = 'CPU_LIMIT',
  MEMORY_LIMIT = 'MEMORY_LIMIT',
  HEALTH_CHECK = 'HEALTH_CHECK',
  OBJ = 'OBJ',
}

export const initialState = (obj: NodeKind): NodeDashboardState => ({
  obj,
  cpuLimit: undefined,
  memoryLimit: undefined,
  healthCheck: undefined,
});

export const reducer = (state: NodeDashboardState, action: NodeDashboardAction) => {
  switch (action.type) {
    case ActionType.CPU_LIMIT: {
      if (_.isEqual(action.payload, state.cpuLimit)) {
        return state;
      }
      return {
        ...state,
        cpuLimit: action.payload,
      };
    }
    case ActionType.MEMORY_LIMIT: {
      if (_.isEqual(action.payload, state.memoryLimit)) {
        return state;
      }
      return {
        ...state,
        memoryLimit: action.payload,
      };
    }
    case ActionType.HEALTH_CHECK: {
      if (_.isEqual(action.payload, state.healthCheck)) {
        return state;
      }
      return {
        ...state,
        healthCheck: action.payload,
      };
    }
    case ActionType.OBJ: {
      if (action.payload === state.obj) {
        return state;
      }
      return {
        ...state,
        obj: action.payload,
      };
    }
    default:
      return state;
  }
};

const NodeDashboard: React.FC<NodeDashboardProps> = ({ obj }) => {
  const { t } = useTranslation();
  const [isAlert, setIsAlert] = React.useState(sessionStorage.getItem(SHOW_ALERT_IN_SINGLECLUSTER_NODEPAGE) === 'true');
  const [state, dispatch] = React.useReducer(reducer, initialState(obj));

  if (obj !== state.obj) {
    dispatch({ type: ActionType.OBJ, payload: obj });
  }

  const setCPULimit = React.useCallback((payload: LimitRequested) => dispatch({ type: ActionType.CPU_LIMIT, payload }), []);
  const setMemoryLimit = React.useCallback((payload: LimitRequested) => dispatch({ type: ActionType.MEMORY_LIMIT, payload }), []);
  const setHealthCheck = React.useCallback((payload: HealthCheck) => dispatch({ type: ActionType.HEALTH_CHECK, payload }), []);

  const context = {
    obj,
    cpuLimit: state.cpuLimit,
    memoryLimit: state.memoryLimit,
    healthCheck: state.healthCheck,
    setCPULimit,
    setMemoryLimit,
    setHealthCheck,
  };

  const [isAWS, setIsAWS] = React.useState(false);
  React.useEffect(() => {
    const getIsAWS = async () => {
      const activeCluster = getActiveCluster();
      const clusterManagerNameSpace = activeCluster.split('/')[0];
      const clusterManagerName = activeCluster.split('/')[1];
      const url = `${origin}/api/kubernetes/apis/cluster.tmax.io/v1alpha1/namespaces/${clusterManagerNameSpace}/clustermanagers/${clusterManagerName}`;

      return coFetchJSON(url).then(result => {
        return result.spec.provider === 'AWS';
      });
    };
    if (isSingleClusterPerspective()) {
      getIsAWS().then(res => {
        setIsAWS(res);
      });
    }
  }, []);


  return (
    <NodeDashboardContext.Provider value={context}>
      {isAlert && isSingleClusterPerspective() && isAWS && (
        <ToastPopupAlert
          title={t('SINGLE:MSG_NODES_NODEDETAILS_TABOVERVIEW_5')}
          message={t('SINGLE:MSG_NODES_NODEDETAILS_TABOVERVIEW_6')}
          onceOption={true}
          key={SHOW_ALERT_IN_SINGLECLUSTER_NODEPAGE}
          setIsAlert={setIsAlert}
        />
      )}
      <Dashboard>
        <DashboardGrid mainCards={mainCards} leftCards={leftCards} rightCards={rightCards} />
      </Dashboard>
    </NodeDashboardContext.Provider>
  );
};

export default NodeDashboard;

type NodeDashboardProps = {
  obj: NodeKind;
};

type NodeDashboardState = {
  obj: NodeKind;
  cpuLimit: LimitRequested;
  memoryLimit: LimitRequested;
  healthCheck: HealthCheck;
};

type NodeDashboardAction = { type: ActionType.CPU_LIMIT; payload: LimitRequested } | { type: ActionType.MEMORY_LIMIT; payload: LimitRequested } | { type: ActionType.HEALTH_CHECK; payload: HealthCheck } | { type: ActionType.OBJ; payload: NodeKind };
