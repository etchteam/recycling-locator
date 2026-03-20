module.exports = {
  branches: ['main'],
  // npm whoami doesn't support OIDC, so skip npm's verifyConditions.
  // Trusted publishing authenticates via OIDC during npm publish instead.
  verifyConditions: ['@semantic-release/github', '@semantic-release/git'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        presetConfig: {},
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
      },
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        provenance: true,
      },
    ],
    '@semantic-release/github',

    // NOTE: this plugin must be last to ensure all updated files are committed
    '@semantic-release/git',
  ],
};
