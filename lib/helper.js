

module.exports.dedupe = arr => arr.filter((elem, index) =>  arr.indexOf(elem) === index);

module.exports.isError = val =>
!!val && typeof val === 'object' && (
  val instanceof Error || (
    val.hasOwnProperty('message') && val.hasOwnProperty('stack')
  )
);

module.exports.getType = (ob) => {
  let t = 'unknown';
  const firstShot = typeof ob;
  if (ob === null) {
    t = 'null';
  }
  else if (ob === undefined) {
    t = 'undefined';
  }
  else if (firstShot !== 'object' || ob instanceof Error) {
    t = firstShot;
  }
  else if (ob.constructor === [].constructor) {
    t = 'array';
  }
  else if (ob.constructor === {}.constructor) {
    t = 'object';
  }
  return t;
};
