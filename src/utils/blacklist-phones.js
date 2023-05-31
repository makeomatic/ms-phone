function isBlacklisted(phone, blackList = []) {
  if (blackList.length === 0) return false;

  return blackList.reduce((blackListed, pattern) => {
    blackListed.push(phone.startsWith(pattern));

    return blackListed;
  }, []).includes(true);
}

module.exports = isBlacklisted;
