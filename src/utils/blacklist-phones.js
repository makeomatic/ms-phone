function isBlacklisted(phone, blackList = []) {
  if (blackList.length === 0) return false;

  for (const pattern of blackList) {
    if (phone.startsWith(pattern)) {
      return true;
    }
  }

  return false;
}

module.exports = isBlacklisted;
