const { execSync } = require('child_process');

/**
 * Get root directory of the project (where the .git folder exists)
 */
const getRootDirectory = (exports.getRootDirectory = () =>
  execSync('git rev-parse --show-toplevel')
    .toString()
    .trim());

/**
 * Get current branch name as a string.
 */
const getCurrentBranch = (exports.getCurrentBranch = () => {
  const directory = getRootDirectory();
  const branchName = execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim();
  return branchName;
});

/**
 * Detect if in detached-HEAD state.
 *
 * @see https://stackoverflow.com/a/52222248/4101408
 * @see https://www.git-tower.com/learn/git/faq/detached-head-when-checkout-commit
 */
const inDetachedHeadState = (exports.inDetachedHeadState = () => {
  try {
    const currentHEAD = execSync('git symbolic-ref -q HEAD');
    return false;
  } catch (error) {
    return true;
  }
});

/**
 * Get count of how many times a particular ref is checked out.
 * @param {String} ref a git ref name
 */
const getCheckoutCount = (exports.getCheckoutCount = (ref = '') => {
  const count = execSync(`git reflog --date=local | grep -o '${branchName}' | wc -l`, options).trim();
  return parseInt(count, 10);
});

/**
 * Check if the checked out branch is a new branch.
 */
const isNewBranch = (exports.isNewBranch = (prevHead, currentHead, branch = '') =>
  prevHead === currentHead && getCheckoutCount(branch) === 1);
