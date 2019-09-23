function isBlank(target){
  if(target === null || target === undefined || typeof target === 'undefined' || target === ''){
    return true
  }
  if(typeof target === 'string' && target.trim().length === 0){
    return true
  }
  if(typeof target === 'object' && JSON.stringify(target) === '{}'){
    return true
  }
  return false
}

module.exports = {
  isBlank
}