module.exports = {
    '*.{ts,tsx}': [
        'eslint --fix',
        'prettier --write',
        'bash -c "npm run type-check"'
    ],
    '*.{css,scss}': [
        'stylelint --fix',
        'prettier --write'
    ]
};