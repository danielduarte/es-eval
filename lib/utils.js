function regExpFromString(q) {
  let flags = q.replace(/.*\/([gimuy]*)$/, "$1");
  if (flags === q) flags = "";
  let pattern = flags
    ? q.replace(new RegExp("^/(.*?)/" + flags + "$"), "$1")
    : q;
  try {
    return new RegExp(pattern, flags);
  } catch (e) {
    return null;
  }
}

module.exports = {
    regExpFromString
};
