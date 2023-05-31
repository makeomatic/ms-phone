function isBlacklisted(phone, blackList = []) {
  let blackListed = false;

  if (blackList.length === 0) return blackListed;

  for (const pattern of blackList) {
    if (phone.startsWith(pattern)) {
      blackListed = true;
      break;
    }
  }

  return blackListed;
}

module.exports = isBlacklisted;
