const getTxQueryParams = (params: Record<string, any>): string => {
  const {
    errorMessage,
    blockNumber,
    networkId,
    networkName,
    networkUrl,
    gas,
    gasUsed,
    gasPrice,
    txHash,
    from,
    to,
    status,
    createdAt,
  } = params;

  const queryParams = new URLSearchParams();

  if (errorMessage) {
    queryParams.append('errorMessage', errorMessage);
  }

  if (blockNumber) {
    queryParams.append('blockNumber', blockNumber);
  }

  if (networkId) {
    queryParams.append('networkId', networkId);
  }

  if (networkName) {
    queryParams.append('networkName', networkName);
  }

  if (networkUrl) {
    queryParams.append('networkUrl', networkUrl);
  }

  if (gas) {
    queryParams.append('gas', gas);
  }

  if (gasUsed) {
    queryParams.append('gasUsed', gasUsed);
  }

  if (gasPrice) {
    queryParams.append('gasPrice', gasPrice);
  }

  if (txHash) {
    queryParams.append('txHash', txHash);
  }

  if (from) {
    queryParams.append('from', from);
  }

  if (to) {
    queryParams.append('to', to);
  }

  if (status) {
    queryParams.append('status', status);
  }

  if (createdAt) {
    queryParams.append('createdAt', createdAt);
  }

  return queryParams.toString();
};

const getSharedSimulationQueryParams = (params: Record<string, any>): string => {
  const {
    id,
    txHash,
    errorMessage,
    blockNumber,
    networkId,
    networkName,
    networkUrl,
    gas,
    gasUsed,
    gasPrice,
    from,
    to,
    status,
    shared,
    createdAt,
  } = params;

  const queryParams = new URLSearchParams();

  if (id) {
    queryParams.append('id', id);
  }

  if (errorMessage) {
    queryParams.append('errorMessage', errorMessage);
  }

  if (blockNumber) {
    queryParams.append('blockNumber', blockNumber);
  }

  if (networkId) {
    queryParams.append('networkId', networkId);
  }

  if (txHash) {
    queryParams.append('txHash', txHash);
  }

  if (networkName) {
    queryParams.append('networkName', networkName);
  }

  if (networkUrl) {
    queryParams.append('networkUrl', networkUrl);
  }

  if (gas) {
    queryParams.append('gas', gas);
  }

  if (gasUsed) {
    queryParams.append('gasUsed', gasUsed);
  }

  if (gasPrice) {
    queryParams.append('gasPrice', gasPrice);
  }

  if (from) {
    queryParams.append('from', from);
  }

  if (to) {
    queryParams.append('to', to);
  }

  if (status) {
    queryParams.append('status', status);
  }

  if (shared) {
    queryParams.append('shared', shared);
  }

  if (createdAt) {
    queryParams.append('createdAt', createdAt);
  }

  return queryParams.toString();
};

export {
  getTxQueryParams,
  getSharedSimulationQueryParams,
};
