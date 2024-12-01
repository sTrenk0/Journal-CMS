#!/bin/bash

set -e

echo "Running pre-commit hooks..."

if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "Error: This directory is not a Git repository."
    exit 1
fi
EXCLUDE_FILE_PATTERNS=".venv|__pycache__|migrations|build|dist|alembic|test"
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E "\.py$" | grep -Ev "$EXCLUDE_FILE_PATTERNS")

if [ -z "$FILES" ]; then
    echo "No Python files to check."
    exit 0
fi

echo "Files to check: $FILES"

run_linter() {
    local command=$1
    local name=$2

    echo "Running $name..."
    if ! $command; then
        echo "$name failed!"
        exit 1
    fi
    echo "$name passed!"
}

run_linter "ruff check $FILES" "Ruff Check"

run_linter "ruff format $FILES" "Ruff Format"

run_linter "isort $FILES" "Isort"

echo "All checks passed!"
exit 0
