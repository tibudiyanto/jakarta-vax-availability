module.exports = {
  /**
   * Ignoring ESLint on build in favor of GitHub Workflows, read more on issue #28:
   * https://github.com/tibudiyanto/jakarta-vax-availability/issues/28#issuecomment-874470860
   *
   * @see https://nextjs.org/docs/api-reference/next.config.js/ignoring-eslint
   */
  eslint: {
    ignoreDuringBuilds: true
  }
};
