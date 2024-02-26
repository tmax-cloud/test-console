export const APP_SOCKET = `{ header: { targetServiceName: 'com.tmax.superobject.admin.master.GetApplicationConsole', messageType: 'REQUEST', contentType: 'TEXT' }, body: {poolId : 'default', getAll : 'true', describe : 'true'} }`;
export const SERVICE_SOCKET = `{ header: { targetServiceName: 'com.tmax.superobject.admin.master.GetService', messageType: 'REQUEST', contentType: 'TEXT' }, body: {poolId : 'default', getAll : 'true', describe : 'true'} }`;
export const CONTROLLER_SOCKET = `{ header: { targetServiceName: 'com.tmax.superobject.admin.master.GetController', messageType: 'REQUEST', contentType: 'TEXT' }, body: {poolId : 'default', getAll : 'true', describe : 'true'} }`;
export const NODE_SOCKET = `{ header: { targetServiceName: 'com.tmax.superobject.admin.master.GetWorker', messageType: 'REQUEST', contentType: 'TEXT' }, body: {poolId : 'default', getAll : 'true', describe : 'true'} }`;