# Security Policy

## Supported Branch

Security fixes are handled from the default branch and reviewed through pull requests before deployment.

## Reporting a Vulnerability

If you find a vulnerability, do not open a public issue with exploit details.

Send a private report to:

- Email: contato@jabica.com.br

Include:

- affected URL, package, workflow, or file;
- steps to reproduce;
- expected impact;
- suggested fix, if known.

## Baseline

This repository uses:

- Dependabot for dependency and GitHub Actions updates;
- npm lockfile review through CI;
- CodeQL analysis for JavaScript and TypeScript;
- secret scanning guidance through GitHub repository settings;
- pull request review before production changes.

Secrets, credentials, API tokens, `.env` files, private keys, and generated build artifacts must not be committed.
